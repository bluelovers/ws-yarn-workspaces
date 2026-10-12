/**
 * Merge ignore files with their static templates / 將 ignore 檔案與靜態樣板合併
 *
 * resetStaticFiles 會先刪除正式的 ignore 檔（.gitignore / .npmignore 等）再重新複製樣板，
 * 既有規則會因此遺失；此模組在 reset 之前先取樣，並在複製完成後把取樣內容合併回去。
 * resetStaticFiles deletes the real ignore files (.gitignore / .npmignore, etc.) before copying the
 * templates back, which loses the existing rules; this module captures them before the reset and
 * merges the captured content back once the copy is done.
 *
 * @module mergeIgnoreFiles
 */
import { IgnoreFile } from '@yarn-tool/ignore/lib/IgnoreFile';
import { existsSync } from 'fs-extra';
import { basename, resolve } from 'path';
import { IIgnoreFilesSnapshot, IStaticFilesMapArray } from './types';

/**
 * 需要參與自動合併的 ignore 檔案名稱 / Ignore file names that participate in auto-merge
 *
 * 只列「忽略規則」類型的檔案；一般設定檔（如 .editorconfig）不適用行合併語意。
 * Only rule-list style files are listed; ordinary config files (e.g. .editorconfig) do not suit line merging.
 *
 * @see _isIgnoreFileForMerge
 */
export const defaultMergeIgnoreFiles = [
	'.gitignore',
	'.npmignore',
	'.eslintignore',
	'.nowignore',
] as const;

/**
 * 判斷目標檔案是否為需要合併的 ignore 檔案 / Decide whether the target file is an ignore file that should be merged
 *
 * 以 basename 比對，讓位於子目錄（如 test/.gitignore）的 ignore 檔同樣被涵蓋。
 * Matched by basename so ignore files inside subdirectories (e.g. test/.gitignore) are covered as well.
 *
 * @param targetFile - 目標檔案路徑（相對於 cwd）/ Target file path (relative to cwd)
 * @returns 是否需要合併 / Whether it should be merged
 */
export function _isIgnoreFileForMerge(targetFile: string)
{
	return (defaultMergeIgnoreFiles as readonly string[]).includes(basename(targetFile));
}

/**
 * 在 reset 之前讀取現有 ignore 檔案並建立快照 / Read existing ignore files before the reset and build a snapshot
 *
 * 快照以記憶體中的 IgnoreFile 保存，後續即使檔案被刪除也不受影響；
 * 檔案不存在時不列入快照，合併階段會因此略過該檔案。
 * The snapshot is held as in-memory IgnoreFile objects, so later deletion does not affect them;
 * a missing file is left out of the snapshot, which makes the merge skip that file.
 *
 * @param cwd - 目標目錄 / Target directory
 * @returns 以相對目標路徑為鍵的快照 / Snapshot keyed by the relative target path
 *
 * @see mergeIgnoreFiles
 */
export function _readIgnoreFilesSnapshot(cwd: string): IIgnoreFilesSnapshot
{
	const snapshot: IIgnoreFilesSnapshot = new Map();

	for (const targetFile of defaultMergeIgnoreFiles)
	{
		const targetFileFull = resolve(cwd, targetFile);

		/**
		 * 尚未存在的 ignore 檔沒有既有規則可保留，無需取樣
		 * An ignore file that does not exist yet has no rules to preserve, so there is nothing to capture
		 */
		if (!existsSync(targetFileFull))
		{
			continue;
		}

		snapshot.set(targetFile, IgnoreFile.from(targetFileFull, {
			endCount: true,
		}));
	}

	return snapshot;
}

/**
 * 將快照內容合併回複製後的 ignore 檔 / Merge the snapshot back into the copied ignore files
 *
 * 以複製後的目標檔為 B、reset 前取樣的內容為 A，執行 B.addList(A.lines, true) 後寫回目標：
 * - 樣板的新規則來自 B 本身
 * - A 的既有規則（含使用者自訂）不會因 reset 而遺失
 * - addList 會略過重複行，重複執行結果一致
 * With the post-copy target as B and the pre-reset capture as A, it runs B.addList(A.lines, true)
 * and writes B back to the target:
 * - New template rules come from B itself
 * - Existing rules in A (including user-authored ones) survive the reset
 * - addList skips duplicate lines, so re-running yields a stable result
 *
 * @param cwd - 目標目錄 / Target directory
 * @param file_map - 已解析的靜態檔案映射 / Resolved static file map
 * @param snapshot - reset 前建立的快照；未提供時不執行任何合併 / Snapshot taken before the reset; nothing is merged when omitted
 */
export function mergeIgnoreFiles(cwd: string,
	file_map: IStaticFilesMapArray<string>,
	snapshot?: IIgnoreFilesSnapshot,
)
{
	/**
	 * 未提供快照代表停用合併，維持單純的複製結果
	 * No snapshot means merging is disabled and the plain copy result is kept
	 */
	if (!snapshot?.size)
	{
		return;
	}

	for (const entry of file_map)
	{
		const [targetFile] = entry;

		/**
		 * 非 ignore 檔案維持原本的複製行為，不做行合併
		 * Non-ignore files keep the plain copy behaviour and are not merged
		 */
		if (!_isIgnoreFileForMerge(targetFile))
		{
			continue;
		}

		/**
		 * 取樣時該檔案不存在，沒有既有規則需要保留
		 * The file did not exist when captured, so there are no existing rules to keep
		 */
		const target = snapshot.get(basename(targetFile));

		if (!target)
		{
			continue;
		}

		const targetFileFull = resolve(cwd, targetFile);

		/**
		 * 複製後仍不存在代表對應樣板缺失，維持原狀不寫入
		 * Still missing after the copy means the matching template is absent; leave it untouched
		 */
		if (!existsSync(targetFileFull))
		{
			continue;
		}

		/**
		 * B = 複製後的目標檔，內容為最新樣板
		 * B = post-copy target, whose content is the fresh template
		 */
		const copied = IgnoreFile.from(targetFileFull, {
			endCount: true,
		});

		/**
		 * 將 A（取樣內容）的行併入 B，讓樣板規則與既有規則並存
		 * Fold A's lines (the captured content) into B so template rules and existing rules coexist
		 */
		copied.addList(target.lines, true);

		/**
		 * 寫回目標檔；靜態樣板本身不受影響
		 * Write back to the target; the static template itself stays untouched
		 */
		copied.outputFile(targetFileFull);
	}
}

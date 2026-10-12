import { IIgnoreFilesSnapshot, IStaticFilesMapArray } from './types';
/**
 * 需要參與自動合併的 ignore 檔案名稱 / Ignore file names that participate in auto-merge
 *
 * 只列「忽略規則」類型的檔案；一般設定檔（如 .editorconfig）不適用行合併語意。
 * Only rule-list style files are listed; ordinary config files (e.g. .editorconfig) do not suit line merging.
 *
 * @see _isIgnoreFileForMerge
 */
export declare const defaultMergeIgnoreFiles: readonly [".gitignore", ".npmignore", ".eslintignore", ".nowignore"];
/**
 * 判斷目標檔案是否為需要合併的 ignore 檔案 / Decide whether the target file is an ignore file that should be merged
 *
 * 以 basename 比對，讓位於子目錄（如 test/.gitignore）的 ignore 檔同樣被涵蓋。
 * Matched by basename so ignore files inside subdirectories (e.g. test/.gitignore) are covered as well.
 *
 * @param targetFile - 目標檔案路徑（相對於 cwd）/ Target file path (relative to cwd)
 * @returns 是否需要合併 / Whether it should be merged
 */
export declare function _isIgnoreFileForMerge(targetFile: string): boolean;
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
export declare function _readIgnoreFilesSnapshot(cwd: string): IIgnoreFilesSnapshot;
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
export declare function mergeIgnoreFiles(cwd: string, file_map: IStaticFilesMapArray<string>, snapshot?: IIgnoreFilesSnapshot): void;

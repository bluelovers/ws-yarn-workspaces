/**
 * 將 test/fixtures/split/ 的分類片段組合成新的 gitignore 與 npmignore
 * Compose the classified fragments under test/fixtures/split/ into new gitignore and npmignore files
 *
 * 組合規則：
 * 1. 逐主題（{@link TOPICS} 順序）先放目標分類片段（git 或 npm），再放共用片段，
 *    片段之間以單一空行分隔。
 * 2. `# %gen:NAME%` 佔位行由 lib/ignore-split 的共用產生器展開。
 * 3. other/ 分類（重複與冗餘規則）永不輸出。
 * 4. 行陣列直接作為內容交給 IgnoreFile 保存（支援陣列內容與自動 EOF 結尾換行），
 *    預設優化會去重（保留最後一筆）。
 *
 * Composition rules:
 * 1. Per topic (in {@link TOPICS} order), the target-bucket fragment comes first
 *    and the shared fragment follows, with a single blank line between fragments.
 * 2. `# %gen:NAME%` placeholders are expanded by the shared generators in
 *    lib/ignore-split.
 * 3. The other/ bucket (duplicated and redundant rules) is never emitted.
 * 4. The line array goes to IgnoreFile as content directly (array content and
 *    automatic EOF newline); the default optimization dedupes rules (keeping
 *    the last occurrence).
 *
 * 待組合的分類與輸出檔名請見 lib 的 {@link IGNORE_SPLIT_TARGETS}（單一事實來源）。
 * The targets and their output file names come from {@link IGNORE_SPLIT_TARGETS}
 * in the lib (the single source of truth).
 *
 * 執行 / run: tsx packages/@yarn-tool/static-file/test/scripts/compose-split-ignore-files.ts
 * 輸出 / output: test/fixtures/out/gitignore、test/fixtures/out/npmignore
 */
import { join } from 'path';
import { IgnoreFile } from '@yarn-tool/ignore/lib/IgnoreFile';
import { __ROOT } from '../__root';
import type { IIgnoreSplitTargetBucket } from './lib/ignore-split';
import {
	IGNORE_SPLIT_TARGETS,
	TOPICS,
	expandGenPlaceholders,
	readSplitFragment,
} from './lib/ignore-split';

/**
 * 組合結果的輸出目錄 / Output directory of the composed files
 */
const OUT_ROOT = join(__ROOT, 'test', 'fixtures', 'out');

/**
 * 組合單一目標分類的行陣列
 * Assemble the line array for a single target bucket
 *
 * @param target - 目標分類：git 或 npm / Target bucket: git or npm
 * @returns 展開佔位後的完整行陣列 / The full line array after expanding placeholders
 */
function compose(target: IIgnoreSplitTargetBucket): string[]
{
	const lines: string[] = [];

	for (const topic of TOPICS)
	{
		for (const bucket of [target, 'shared'] as const)
		{
			const fragment = readSplitFragment(bucket, topic.id);

			if (fragment.length === 0)
			{
				continue;
			}

			lines.push(...fragment, '');
		}
	}

	return expandGenPlaceholders(lines);
}

/**
 * 腳本進入點：組合兩份 ignore 檔並輸出到 test/fixtures/out
 * Script entry: compose both ignore files and write them to test/fixtures/out
 */
function main(): void
{
	for (const { bucket, fileName } of IGNORE_SPLIT_TARGETS)
	{
		const path = join(OUT_ROOT, fileName);

		/**
		 * 行陣列直接交給 IgnoreFile：建構子接受陣列內容，
		 * 結尾空行（EOF 換行）自動記錄並於輸出時還原，無需自行展開或補空行
		 * The line array goes straight into IgnoreFile: the constructor accepts
		 * array content, and the trailing blank (the EOF newline) is recorded
		 * automatically and restored on output — no manual spread or blank needed
		 */
		const ignoreFile = new IgnoreFile(path, compose(bucket));

		ignoreFile.save();

		console.log(`composed ${path} (${ignoreFile.lines.length} lines)`);
	}
}

main();

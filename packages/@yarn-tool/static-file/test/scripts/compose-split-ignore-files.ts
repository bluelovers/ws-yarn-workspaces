/**
 * 將 test/fixtures/split/ 的分類片段組合成新的 gitignore 與 npmignore
 * Compose the classified fragments under test/fixtures/split/ into new gitignore and npmignore files
 *
 * 組合規則：
 * 1. 逐主題（{@link TOPICS} 順序）先放目標分類片段（git 或 npm），再放共用片段，
 *    片段之間以單一空行分隔。
 * 2. `# %gen:NAME%` 佔位行由 lib/ignore-split 的共用產生器展開。
 * 3. other/ 分類（重複與冗餘規則）永不輸出。
 * 4. 透過 IgnoreFile 保存，預設優化會去重（保留最後一筆）並補上結尾換行。
 *
 * Composition rules:
 * 1. Per topic (in {@link TOPICS} order), the target-bucket fragment comes first
 *    and the shared fragment follows, with a single blank line between fragments.
 * 2. `# %gen:NAME%` placeholders are expanded by the shared generators in
 *    lib/ignore-split.
 * 3. The other/ bucket (duplicated and redundant rules) is never emitted.
 * 4. Saved via IgnoreFile, whose default optimization dedupes rules (keeping the
 *    last occurrence) and restores the trailing newline.
 *
 * 執行 / run: tsx packages/@yarn-tool/static-file/test/scripts/compose-split-ignore-files.ts
 * 輸出 / output: test/fixtures/out/gitignore、test/fixtures/out/npmignore
 */
import { join } from 'path';
import { IgnoreFile } from '@yarn-tool/ignore/lib/IgnoreFile';
import { __ROOT } from '../__root';
import {
	TOPICS,
	expandGenPlaceholders,
	readSplitFragment,
} from './lib/ignore-split';

/**
 * 分類片段的根目錄 / Root directory of the classified fragments
 */
const SPLIT_ROOT = join(__ROOT, 'test', 'fixtures', 'split');

/**
 * 組合結果的輸出目錄 / Output directory of the composed files
 */
const OUT_ROOT = join(__ROOT, 'test', 'fixtures', 'out');

/**
 * 待組合的兩個目標 / The two composition targets
 *
 * 第一欄為分類（決定先輸出的片段群），第二欄為輸出檔名。
 * The first entry is the bucket (deciding which fragment group comes first),
 * the second is the output file name.
 */
const TARGETS = [
	['git', 'gitignore'],
	['npm', 'npmignore'],
] as const;

/**
 * 組合單一目標分類的行陣列
 * Assemble the line array for a single target bucket
 *
 * @param target - 目標分類：git 或 npm / Target bucket: git or npm
 * @returns 展開佔位後的完整行陣列 / The full line array after expanding placeholders
 */
function compose(target: typeof TARGETS[number][0]): string[]
{
	const lines: string[] = [];

	for (const topic of TOPICS)
	{
		for (const bucket of [target, 'shared'] as const)
		{
			const fragment = readSplitFragment(SPLIT_ROOT, bucket, topic.id);

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
	for (const [target, fileName] of TARGETS)
	{
		const lines = compose(target);
		const path = join(OUT_ROOT, fileName);

		/**
		 * 結尾只保留一個空行：compose() 的最後一個片段已帶一個空行，
		 * 若再補一個會使 endCount=2，輸出檔尾多出空行。
		 * Keep exactly one trailing blank: compose() already ends the last
		 * fragment with a blank, and adding another would set endCount=2 and
		 * leave an extra blank line at the end of the file
		 */
		while (lines.length > 0 && lines[lines.length - 1] === '')
		{
			lines.pop();
		}

		new IgnoreFile(path, [...lines, '']).save();

		console.log(`composed ${path} (${lines.length} lines)`);
	}
}

main();

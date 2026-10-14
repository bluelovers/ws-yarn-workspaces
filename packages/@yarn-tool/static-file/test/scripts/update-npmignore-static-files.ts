/**
 * Script to extract staticFile values from const.ts
 * and add them as !<file> entries to .npmignore and .gitignore
 *
 * 腳本從 const.ts 提取 staticFile 值
 * 並將它們作為 !<file> 條目加入 .npmignore 和 .gitignore
 *
 * 讀取與保存皆透過 IgnoreFile（行陣列模型：支援陣列內容，EOF 換行自動還原）
 * Reading and saving both go through IgnoreFile (the line model: array content
 * is supported and the EOF newline is restored automatically)
 */
import * as path from 'path';
import { IgnoreFile } from '@yarn-tool/ignore/lib/IgnoreFile';
import { __ROOT } from '../__root';
import {
	defaultCopyStaticFiles,
	defaultCopyStaticFilesRootOnly,
	defaultCopyStaticFilesWsRootOnly,
} from '../../lib/const';
import { defaultCopyStaticFilesTsdx } from '../../lib/const-tsdx';

/**
 * 生成區段的起始標記，用於識別並替換上一次產生的內容
 * Start marker of the generated section, used to locate and replace the previous run's output
 */
const HEADER = '# Static files from const.ts';

/**
 * 生成區段的結束標記
 * End marker of the generated section
 */
const FOOTER = '# END Static files from const.ts';

/**
 * 收集三份清單中所有不重複的 staticFile 來源路徑
 * Collect every unique staticFile source path across the three lists
 *
 * 以 includes 去重，確保 ignore 檔中同一來源只出現一次
 * Dedupe with includes so each source appears only once in the ignore file
 *
 * @returns 靜態樣板的來源路徑陣列 / Array of static template source paths
 */
function extractStaticFiles(): string[]
{
	const staticFiles: string[] = [];

	/**
	 * 三份清單的內容可能重疊（例如同一樣板被不同情境引用），
	 * 合併後再統一去重
	 * The three lists may overlap (e.g. one template referenced by different scenarios),
	 * so merge first and dedupe afterwards
	 */
	const allArrays = [
		...defaultCopyStaticFiles,
		...defaultCopyStaticFilesRootOnly,
		...defaultCopyStaticFilesWsRootOnly,
		...defaultCopyStaticFilesTsdx,
	];

	for (const entry of allArrays)
	{
		const staticFile = entry[1];

		/**
		 * 已存在則跳過，避免 ignore 檔重複列出
		 * Skip when already collected to avoid duplicate entries in the ignore file
		 */
		if (!staticFiles.includes(staticFile))
		{
			staticFiles.push(staticFile);
		}
	}

	return staticFiles;
}

/**
 * 重寫 ignore 檔中的生成區段
 * Rewrite the generated section of an ignore file
 *
 * 先移除舊的 `!file/` 條目與標記區段，再重新寫入，
 * 使腳本可重複執行（Idempotent）而不會不斷累加
 * Old `!file/` entries and the marked section are removed before rewriting,
 * so the script stays idempotent instead of appending forever
 *
 * @param filePath - .npmignore 或 .gitignore 的路徑 / Path to .npmignore or .gitignore
 * @param staticFiles - 要排除的靜態樣板路徑 / Static template paths to whitelist
 */
function updateIgnoreFile(filePath: string, staticFiles: string[]): void
{

	/**
	 * 以 IgnoreFile 讀取：內容統一為行陣列，結尾空白行已由建構處理
	 * Read via IgnoreFile: content is normalized into a line array, with the trailing blanks already handled at construction
	 */
	const ignoreFile = IgnoreFile.from(filePath, {
		endCount: true,
	});

	const lines: string[] = [];

	lines.push('');
	lines.push(HEADER);
	lines.push(...staticFiles);
	lines.push(FOOTER);
	lines.push('');

	ignoreFile.addList(lines, true);

	ignoreFile.outputFile(filePath);
}

/**
 * 腳本進入點：擷取清單並更新 .npmignore 與 .gitignore
 * Script entry: extract the list and update .npmignore and .gitignore
 */
function main(): void
{
	console.log('Extracting static files from imported module...');

	const staticFiles = extractStaticFiles();

	staticFiles.push('test/fixtures/out/');
	staticFiles.push('test/fixtures/split/');
	staticFiles.push('test/fixtures/out/**');
	staticFiles.push('test/fixtures/split/**');

	console.log(`Found ${staticFiles.length} static files:`);

	const entries = staticFiles.sort().map(f => {
		const entry = `!${f}`
		console.log(`  ${entry}`)
		return entry
	});

	const npmIgnore = path.join(__ROOT, '.npmignore');
	const gitIgnore = path.join(__ROOT, '.gitignore');

	/**
	 * 兩個檔案採用同一套生成規則，先 npmignore 再 gitignore
	 * Both files share the same generated rules, npmignore first then gitignore
	 */
	updateIgnoreFile(npmIgnore, entries);
	console.log(`\nUpdated ${npmIgnore}`);

	updateIgnoreFile(gitIgnore, entries);
	console.log(`Updated ${gitIgnore}`);
}

main();

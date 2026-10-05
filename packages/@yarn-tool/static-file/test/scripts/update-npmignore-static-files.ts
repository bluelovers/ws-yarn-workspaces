/**
 * Script to extract staticFile values from const.ts
 * and add them as !<file> entries to .npmignore and .gitignore
 *
 * 腳本從 const.ts 提取 staticFile 值
 * 並將它們作為 !<file> 條目加入 .npmignore 和 .gitignore
 */
import * as fs from 'fs';
import * as path from 'path';
import { __ROOT } from '../__root';
import {
	defaultCopyStaticFiles,
	defaultCopyStaticFilesRootOnly,
	defaultCopyStaticFilesWsRootOnly,
} from '../../lib/const';

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
	let content = fs.readFileSync(filePath, 'utf-8');

	const lines = content.split('\n');

	/**
	 * 過濾掉舊的白名單條目與標記行，
	 * 保留使用者自行撰寫的其他規則
	 * Filter out stale whitelist entries and marker lines,
	 * keeping the user-written rules intact
	 */
	const filteredLines = lines.filter(line =>
	{
		const trimmed = line.trim();
		if (trimmed.startsWith('!file/') || trimmed === '!file/*.tpl')
		{
			return false;
		}
		if (trimmed === HEADER)
		{
			return false;
		}
		if (trimmed === FOOTER)
		{
			return false;
		}
		return true;
	});

	const newEntries = staticFiles.map(f => `!${f}`);

	/**
	 * 移除結尾空白行，確保標記區段緊接在既有規則之後
	 * Drop trailing blank lines so the generated section follows the existing rules directly
	 */
	while (filteredLines.length > 0 && filteredLines[filteredLines.length - 1].trim() === '')
	{
		filteredLines.pop();
	}

	filteredLines.push('');
	filteredLines.push(HEADER);
	filteredLines.push(...newEntries);
	filteredLines.push(FOOTER);
	filteredLines.push('');

	fs.writeFileSync(filePath, filteredLines.join('\n'), 'utf-8');
}

/**
 * 腳本進入點：擷取清單並更新 .npmignore 與 .gitignore
 * Script entry: extract the list and update .npmignore and .gitignore
 */
function main(): void
{
	console.log('Extracting static files from imported module...');

	const staticFiles = extractStaticFiles();

	console.log(`Found ${staticFiles.length} static files:`);
	staticFiles.forEach(f => console.log(`  !${f}`));

	const npmIgnore = path.join(__ROOT, '.npmignore');
	const gitIgnore = path.join(__ROOT, '.gitignore');

	/**
	 * 兩個檔案採用同一套生成規則，先 npmignore 再 gitignore
	 * Both files share the same generated rules, npmignore first then gitignore
	 */
	updateIgnoreFile(npmIgnore, staticFiles);
	console.log(`\nUpdated ${npmIgnore}`);

	updateIgnoreFile(gitIgnore, staticFiles);
	console.log(`Updated ${gitIgnore}`);
}

main();

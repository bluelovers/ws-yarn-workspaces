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

const HEADER = '# Static files from const.ts';
const FOOTER = '# END Static files from const.ts';

function extractStaticFiles(): string[]
{
	const staticFiles: string[] = [];

	const allArrays = [
		...defaultCopyStaticFiles,
		...defaultCopyStaticFilesRootOnly,
		...defaultCopyStaticFilesWsRootOnly,
	];

	for (const entry of allArrays)
	{
		const staticFile = entry[1];
		if (!staticFiles.includes(staticFile))
		{
			staticFiles.push(staticFile);
		}
	}

	return staticFiles;
}

function updateIgnoreFile(filePath: string, staticFiles: string[]): void
{
	let content = fs.readFileSync(filePath, 'utf-8');

	const lines = content.split('\n');
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

function main(): void
{
	console.log('Extracting static files from imported module...');

	const staticFiles = extractStaticFiles();

	console.log(`Found ${staticFiles.length} static files:`);
	staticFiles.forEach(f => console.log(`  !${f}`));

	const npmIgnore = path.join(__ROOT, '.npmignore');
	const gitIgnore = path.join(__ROOT, '.gitignore');

	updateIgnoreFile(npmIgnore, staticFiles);
	console.log(`\nUpdated ${npmIgnore}`);

	updateIgnoreFile(gitIgnore, staticFiles);
	console.log(`Updated ${gitIgnore}`);
}

main();

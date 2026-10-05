#!/usr/bin/env node

import yargs from 'yargs';
import { checkWorkspaces, checkPkgJson, checkPkgDir } from '..';
import { console, chalkByConsoleMaybe } from 'debug-color2';
import Table from 'cli-table3';
import pkgDir from 'pkg-dir';
import stringNaturalCompare from '@bluelovers/string-natural-compare';
import { applyStyleBorderless } from '@yarn-tool/table';
import { findRoot } from '@yarn-tool/find-root';

/**
 * CLI 參數定義：
 * --workspaces(-w) 強制以 workspace 模式檢查；
 * 未指定時交由 findRoot 的 isWorkspace 判斷，讓 monorepo 與單套件目錄皆可直接執行。
 *
 * CLI options: --workspaces(-w) forces workspace mode; when omitted, findRoot's
 * isWorkspace decides, so both monorepo and single-package dirs can run as-is.
 */
const cli = yargs
	.option('workspaces', {
		alias: ['w'],
		boolean: true,
	})
	.option('cwd', {
		normalize: true,
		default: process.cwd(),
	})
	.help()
	.parseSync()
;

// 以無邊框樣式輸出表格，避免在 CI / 純文字終機中出現雜亂的框線符號。
// Borderless table style avoids noisy box-drawing glyphs in CI / plain terminals.
const table = new Table({
	colAligns: ['left', 'right'],
});

applyStyleBorderless(table);

const chalk = chalkByConsoleMaybe(console);

table.options.head = [
	chalk.bold.reset('package name'),
	chalk.bold.reset('validate'),
];

// 整體驗證結果：只有「有 bin 且未通過」才會被設為 false；
// 初值 undefined 保留給「所有套件都沒有 bin」的情況，使其不觸發 exit 1。
// Overall result: only "has bins and failed" sets false; the initial undefined
// covers "no package has bins" so that case does not trigger exit 1.
let bool: boolean;

const rootData = findRoot(cli);

if (cli.workspaces ?? rootData.isWorkspace)
{
	// workspace 模式：依套件名稱自然排序後逐一檢查，
	// 並在表格中以顏色區分通過（綠）/ 失敗（紅）/ 無 bin（灰）。
	// Workspace mode: check each package (naturally sorted by name) and color
	// pass (green) / fail (red) / no bins (gray) in the table.
	checkWorkspaces(cli.cwd)
		.sort((a, b) => stringNaturalCompare(a.name, b.name))
		.forEach(data =>
		{
			let valid = data.valid.toString()
			let color = 'gray';

			if (data.result.length)
			{
				// 僅有 bin 的套件才納入整體驗證；
				// 空 result 以 none 呈現，不影響 exit code。
				// Only packages with bins count toward the overall result; an
				// empty result shows "none" without affecting the exit code.
				bool = data.valid && (bool ?? true)

				color = data.valid ? 'green' : 'red';
			}
			else
			{
				valid = 'none'
			}

			table.push([
				data.name,
				chalk[color](valid),
			]);
		})
	;
}
else
{
	// 單套件模式：以 pkgDir.sync 向上尋找 package.json 所在目錄。
	// 沒有 bin 或全部通過皆視為成功（true），僅「有 bin 且失敗」才會 exit 1。
	// Single-package mode: pkgDir.sync walks up to the package.json directory.
	// No bins or all passing counts as success; only "has bins and failed" exits 1.
	let data = checkPkgDir(pkgDir.sync(cli.cwd))
	bool = (!data.result.length || data.valid);
	let valid = data.valid.toString()
	let color = 'gray';

	if (!data.result.length)
	{
		valid = 'none'
	}
	else
	{
		color = data.valid ? 'green' : 'red';
	}

	table.push([
		chalk.blue(data.name),
		chalk[color](valid),
	]);
}

console.log(table.toString())

// 僅在明確驗證失敗時以狀態碼 1 結束，
// 讓 CI 可據此攔截「bin 缺少 shebang」的套件。
// Exit with status 1 only on explicit failure so CI can block packages whose
// bins are missing a shebang.
if (bool === false)
{
	process.exit(1)
}

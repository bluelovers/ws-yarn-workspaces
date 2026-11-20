#!/usr/bin/env node

/**
 * version-recommended CLI 入口點
 *
 * 讀取 package.json 的版本並計算下一個版本，印出以 diff 著色的差異；
 * 預設寫回 package.json，--dry-run 只輸出不寫入，--no-color 輸出純文字
 */
import yargs from 'yargs';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { findRoot } from '@yarn-tool/find-root';
import { chalkByConsoleMaybe } from 'debug-color2';
import { colorizeDiff } from '@yarn-tool/semver-diff';
import { setupToYargs } from '../lib/argv';
import { nextVersionRecommendedByPackageFindUp } from '..';
import { INextVersionRecommendedOptions } from '../lib/types';

/**
 * setupToYargs 已註冊 bump / preid 等選項；
 * 此處補上 cwd 與 dry-run、no-color 讓它們顯示於 --help
 */
const argv = setupToYargs(yargs)
	.option('cwd', {
		default: process.cwd(),
		normalize: true,
		desc: 'path of the package.json to update',
	})
	.option('dry-run', {
		type: 'boolean',
		default: false,
		desc: 'print the result without writing package.json',
	})
	.option('no-color', {
		type: 'boolean',
		default: false,
		desc: 'disable colors',
	})
	/** 失敗時顯示說明，避免使用者只看到裸錯誤訊息 */
	.showHelpOnFail(true)
	.version()
	.help()
	.parseSync()
;

/**
 * 與套件預設匯出同一套查找邏輯：自 cwd 向上尋找專案根目錄的 package.json，
 * 不假設 cwd 底下一定有 package.json；findRoot 另提供寫回所需的路徑
 */
const rootData = findRoot({ cwd: argv.cwd });
const pkgPath = join(rootData.pkg, 'package.json');
const text = readFileSync(pkgPath, 'utf8');

/**
 * yargs 選項名稱與 INextVersionRecommendedOptions 欄位一一對應，直接轉交；
 * --new-version 明確指定時優先，否則依 bump / preid 推薦
 */
const result = nextVersionRecommendedByPackageFindUp({
	cwd: argv.cwd,
	bump: argv.bump as INextVersionRecommendedOptions['bump'],
	preid: argv.preid,
	defaultPreid: argv.defaultPreid,
});

const pkg = result.pkg;
const oldVersion = String(pkg.version ?? '');
const newVersion = argv['new-version']?.length
	? argv['new-version']
	: result.newVersion;

const noColor = !!argv['no-color'];
const chalk = chalkByConsoleMaybe();

/**
 * 差異段落交給 colorizeDiff 著色（major 紅、minor 青、patch 綠）；
 * --no-color 時以 stripAnsi 取得純文字，其餘樣式於輸出前統一剝除
 */
const diff = colorizeDiff(oldVersion, newVersion, noColor ? { stripAnsi: true } : undefined);
const newVersionText = noColor ? diff : chalk.yellow(diff);

const output = [
	`${chalk.bold.reset(pkg.name ?? pkgPath)}`,
	`  ${chalk.red(oldVersion)} ${chalk.gray('→')} ${newVersionText}`,
	`  ${pkgPath}`,
].join('\n');

console.log(noColor ? stripAnsi(output) : output);

if (oldVersion === newVersion)
{
	console.log('version is up to date, nothing to do');
	process.exit(0);
}

if (argv['dry-run'])
{
	console.log('(dry run) package.json not written');
	process.exit(0);
}

/** 只替換與舊版本相符的 version 欄位，保留其餘排版與欄位順序 */
const pattern = new RegExp(`("version"\\s*:\\s*")${escapeRegExp(oldVersion)}(")`);

if (!pattern.test(text))
{
	console.error(`unable to locate "version": "${oldVersion}" in ${pkgPath}`);
	process.exit(1);
}

writeFileSync(pkgPath, text.replace(pattern, `$1${newVersion}$2`));

console.log(`updated ${oldVersion} → ${newVersion}`);

/**
 * 剝除 ANSI 轉義序列，供 --no-color 輸出純文字
 *
 * @param text - 可能含色彩的字串
 * @returns 純文字
 */
function stripAnsi(text: string): string
{
	return text.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * 轉義正則特殊字元，避免版本號中的 `.` 等字元被當成萬用字元
 *
 * @param text - 原始字串
 * @returns 可安全置入字面值比對的字串
 */
function escapeRegExp(text: string): string
{
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

#!/usr/bin/env node

/**
 * `sync-lockfile` 命令列入口 (CLI entry)：解析參數後呼叫 index 的 syncLockfile。
 *
 * Command-line entry of `sync-lockfile`: parses the arguments and then calls
 * syncLockfile from the package root.
 *
 * Created by user on 2020/1/8.
 */

import yargs from 'yargs';
import syncLockfile from '../index';

/**
 * 以 yargs 定義 CLI 介面：`--cwd` 決定起始目錄、`--silent` 關閉列印，
 * 失敗時自動顯示說明 (help) 讓使用者立刻看到可用選項。
 *
 * Defines the CLI surface with yargs: `--cwd` picks the start directory and
 * `--silent` turns off output, while failures auto-show help so users see
 * the available options right away.
 */
let argv = yargs
	.option('cwd', {
		alias: ['c'],
		default: process.cwd(),
		normalize: true,
		string: true,
	})
	.option('silent', {
		boolean: true,
	})
	.help(true)
	.showHelpOnFail(true)
	.parseSync()
;

/**
 * CLI 預設保持輸出（`print: true`），僅在明確指定 `--silent` 時靜默，
 * 讓一般使用者總能看到複製了哪些目標。
 *
 * The CLI prints by default (`print: true`) and stays quiet only when
 * `--silent` is passed, so regular users always see which targets were
 * copied.
 */
syncLockfile(argv.cwd, {
	print: !argv.silent,
});

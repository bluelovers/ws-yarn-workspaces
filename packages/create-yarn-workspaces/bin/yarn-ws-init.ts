#!/usr/bin/env node

import createYarnWorkspaces from '..';
import debug from 'debug-color2/logger';
import yargs from 'yargs';
import { join } from 'path';
import setupWorkspacesInitToYargs from '../yargs-setting';

/**
 * CLI 一律以呼叫當下的 shell 目錄作為基準路徑。
 * The CLI always uses the invoking shell's directory as the base path.
 */
const CWD = process.cwd();

/**
 * CLI 入口：解析參數後呼叫 createYarnWorkspaces，失敗時印出說明。
 * CLI entry: parse arguments, call `createYarnWorkspaces`, and print help on failure.
 */
let cli = setupWorkspacesInitToYargs(yargs)
	// @ts-ignore
	.command('$0', '', function (yargs)
	{
		// @ts-ignore
		// 優先採用 --name，否則取第一個位置參數作為目標資料夾名稱。
		// Prefer `--name`; otherwise take the first positional argument as the target folder name.
		let name = (yargs.argv.name || yargs.argv._[0]) as string;

		// 未指定名稱時就地初始化（以 CWD 為目標）。
		// When no name is given, initialize in place (target = `CWD`).
		if (name)
		{
			name = join(CWD, name);
		}
		else
		{
			name = CWD;
		}

		//console.log(CWD, yargs.argv);

		// @ts-ignore
		yargs.argv.debug && debug.debug(yargs.argv);

		// 布林參數以 !! 強制轉型；靜態檔案相關選項刻意保留原始值，讓 addStaticFiles 維持預設 true。
		// Coerce booleans with `!!`; static-file options are intentionally passed through untouched so `addStaticFiles` keeps its default of `true`.
		let bool = createYarnWorkspaces(name, {
			// @ts-ignore
			ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
			// @ts-ignore
			ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
			// @ts-ignore
			debug: !!yargs.argv.debug,
			/*
			 * 保留 undefined，讓 addStaticFiles 維持預設 true / Keep undefined so addStaticFiles keeps its default of true
			 * */
			// @ts-ignore
			addStaticFiles: yargs.argv.addStaticFiles,
			// @ts-ignore
			noStaticFiles: yargs.argv.noStaticFiles,
			// @ts-ignore
			resetStaticFiles: yargs.argv.resetStaticFiles,
		});

		//console.log(77777777777, bool);

		// 回傳 false 代表前置檢查失敗（如已存在 Package），此時顯示說明協助使用者修正參數。
		// A `false` return means a pre-check failed (e.g. package already exists), so show help to guide the user.
		if (!bool)
		{
			console.log('\n');
			yargs.showHelp();
		}
		else
		{
			debug.success(`done`);
		}
	})
	.version()
	.help()
	.argv
;

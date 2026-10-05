#!/usr/bin/env node

/**
 * yt-tag 命令列入口
 * yt-tag CLI entry
 *
 * 解析參數後呼叫 gitPackageTag，並以 git 的 exitCode 結束程序，
 * 讓 CI 能據此判斷成功與否。
 * Parses arguments, calls gitPackageTag, and exits with git's exitCode so CI
 * can detect success or failure.
 */
import { setupToYargs } from '../lib/yargs-setting';
import yargs, { Argv, Omit } from 'yargs';
import { gitPackageTag } from '../lib/git-tag';

/**
 * setupToYargs 已註冊主要選項；此處補上 cwd 是為了
 * 讓 --cwd 在 --help 顯示於一般分頁並帶預設值
 *
 * setupToYargs already registers the main options; cwd is re-declared here
 * so --cwd shows under general options in --help with its default value
 */
let argv = setupToYargs(yargs)
	.option('cwd', {
		default: process.cwd(),
		normalize: true,
	})
	/** 失敗時顯示說明，避免使用者只看到裸錯誤訊息 / Show help on failure so users see usage instead of a bare error */
	.showHelpOnFail(true)
	.version()
	.help()
	.parseSync()
;

/**
 * yargs 產出 kebab-case 參數，逐一對應 IOptionsPackageTag 欄位；
 * spawnOptions 以 stdio: 'inherit' 讓 git 輸出直通終端
 *
 * yargs yields kebab-case arguments, mapped one by one to IOptionsPackageTag
 * fields; stdio: 'inherit' lets git's output pass straight to the terminal
 */
gitPackageTag({
	cwd: argv.cwd,
	tagPrefix: argv['tag-prefix'],
	excludeName: argv['exclude-name'],
	message: argv.message,
	forceGitTag: argv['force-git-tag'],
	signGitTag: argv['sign-git-tag'],
}, {
	stdio: 'inherit',
})
	.then(result => {
		/** 以 git 的結束代碼結束程序，確保 CI 能正確反映結果 / Exit with git's code so CI reports the true outcome */
		process.exit(result.exitCode);
	})
;

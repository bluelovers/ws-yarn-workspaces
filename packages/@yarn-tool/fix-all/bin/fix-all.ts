#!/usr/bin/env node

/**
 * fix-all CLI 入口點
 */
import yargs from 'yargs';
import { setupToYargs } from '../lib/util/yargs-setting';
import { npmAutoFixAll, INpmAutoFixAll } from '..';

/**
 * setupToYargs 已註冊修復相關選項；此處補上 cwd 讓 --cwd
 * 在 --help 顯示於一般分頁並帶預設值
 */
let argv = setupToYargs(yargs)
	.option('cwd', {
		default: process.cwd(),
		normalize: true,
	})
	/** 失敗時顯示說明，避免使用者只看到裸錯誤訊息 */
	.showHelpOnFail(true)
	.version()
	.help()
	.parseSync()
;

/**
 * yargs 產出的選項名稱與 INpmAutoFixAll 欄位一一對應，直接轉交
 * Yargs option names map one-to-one with INpmAutoFixAll fields, so they are
 * forwarded as-is
 */
let options: INpmAutoFixAll = {
	overwriteHostedGitInfo: argv.overwriteHostedGitInfo,
	branch: argv.branch,
	resetStaticFiles: argv.resetStaticFiles,
	addStaticFiles: argv.addStaticFiles,
	noStaticFiles: argv.noStaticFiles,
	noMergeIgnoreFiles: argv.noMergeIgnoreFiles,
};

npmAutoFixAll(argv.cwd, options);

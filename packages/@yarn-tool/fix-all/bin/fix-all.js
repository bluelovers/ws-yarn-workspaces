#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * fix-all CLI 入口點
 */
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const yargs_setting_1 = require("../lib/util/yargs-setting");
const __1 = require("..");
/**
 * setupToYargs 已註冊修復相關選項；此處補上 cwd 讓 --cwd
 * 在 --help 顯示於一般分頁並帶預設值
 */
let argv = (0, yargs_setting_1.setupToYargs)(yargs_1.default)
    .option('cwd', {
    default: process.cwd(),
    normalize: true,
})
    /** 失敗時顯示說明，避免使用者只看到裸錯誤訊息 */
    .showHelpOnFail(true)
    .version()
    .help()
    .parseSync();
/**
 * yargs 產出的選項名稱與 INpmAutoFixAll 欄位一一對應，直接轉交
 * Yargs option names map one-to-one with INpmAutoFixAll fields, so they are
 * forwarded as-is
 */
let options = {
    overwriteHostedGitInfo: argv.overwriteHostedGitInfo,
    branch: argv.branch,
    resetStaticFiles: argv.resetStaticFiles,
    addStaticFiles: argv.addStaticFiles,
    noStaticFiles: argv.noStaticFiles,
    noMergeIgnoreFiles: argv.noMergeIgnoreFiles,
};
(0, __1.npmAutoFixAll)(argv.cwd, options);
//# sourceMappingURL=fix-all.js.map
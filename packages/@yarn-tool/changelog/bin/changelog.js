#!/usr/bin/env node
"use strict";
/**
 * Changelog CLI 工具
 * Changelog CLI Tool
 *
 * 命令列介面，用於自動生成和更新套件的 CHANGELOG.md
 * Command line interface for auto-generating and updating package CHANGELOG.md
 *
 * 基於 conventional commits 規範分析 Git 歷史記錄
 * Analyzes Git history based on conventional commits specification
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("v8-compile-cache");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const yargs_setting_1 = require("../lib/yargs-setting");
const from_list_1 = require("../lib/lerna/from-list");
const table_1 = require("@yarn-tool/table");
const path_is_same_1 = require("path-is-same");
const semver_diff_1 = require("@yarn-tool/semver-diff");
/**
 * 解析命令列參數
 * Parse command line arguments
 */
const argv = (0, yargs_setting_1.setupToYargs)(yargs_1.default)
    .option('cwd', {
    default: process.cwd(),
    normalize: true,
})
    .showHelpOnFail(true)
    .version()
    .help()
    .parseSync();
/**
 * 設定選項物件
 * Setup options object
 */
let options = {
    /**
     * Changelog 預設規範
     * Changelog preset
     */
    changelogPreset: argv.preset,
    /**
     * 標籤前綴
     * Tag prefix
     */
    tagPrefix: argv['tag-prefix'],
    /**
     * Changelog 類型 (independent 或 root)
     * Changelog type (independent or root)
     */
    type: argv.type || (argv['lerna-package'] ? 'independent' : 'root'),
};
/**
 * 執行 Changelog 更新
 * Execute changelog update
 */
(0, from_list_1.updateChangelogByCwd)(argv.cwd, options)
    .then(data => {
    /**
     * 建立輸出表格
     * Create output table
     */
    const table = (0, table_1.createDependencyTable)({
        colAligns: ['left', 'left'],
    });
    /**
     * 加入基本資訊行
     * Add basic info rows
     */
    table.push([`rootPath`, data.rootPath]);
    /**
     * 若目標路徑與根路徑不同，顯示目標路徑
     * Show target path if different from root path
     */
    if (!(0, path_is_same_1.pathIsSame)(data.rootPath, data.cwd)) {
        table.push([`targetPath`, data.cwd]);
    }
    table.push([`changelogPreset`, data.options.changelogPreset]);
    table.push([`type`, data.options.type]);
    table.push([`tagPrefix`, data.options.tagPrefix]);
    /**
     * 使用顏色突顯版本差異
     * Highlight version diff with colors
     */
    let version = (0, semver_diff_1.colorizeDiff)(data.pkg.version, data.version);
    table.push([`package`, data.pkg.name]);
    table.push([`version`, version]);
    table.push([`file`, data.logPath]);
    /**
     * 輸出表格並移除行尾空格
     * Output table and remove trailing spaces
     */
    console.log(table.toString().replace(/ +$/g, ''));
});
//# sourceMappingURL=changelog.js.map
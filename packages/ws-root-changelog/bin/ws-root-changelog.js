#!/usr/bin/env node
"use strict";
/**
 * 工作區根目錄 Changelog CLI 工具
 * Workspace Root Changelog CLI Tool
 *
 * 命令列介面，用於在工作區根目錄生成套件 Changelog 總覽
 * Command line interface for generating package changelog overview in workspace root
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const upath2_1 = require("upath2");
/**
 * 解析命令列參數
 * Parse command line arguments
 */
let argv = process.argv.slice(2);
/**
     * 解析輸入路徑，預設為當前工作目錄
     * Parse input path, default to current working directory
     */
let input = (0, upath2_1.resolve)(process.cwd(), (_a = argv[0]) !== null && _a !== void 0 ? _a : '');
console.log(`input: ${input}`);
/**
 * 獲取 Changelog 檔案路徑
 * Get changelog file path
 */
const file = (0, index_1.getWorkspacesRootChangelogPath)(input);
/**
 * 獲取目標目錄
 * Get target directory
 */
const cwd = (0, upath2_1.dirname)(file);
console.log(`target dir: ${cwd}`);
/**
 * 輸出 Changelog 檔案
 * Output changelog file
 */
let ret = (0, index_1.outputWorkspacesRootChangelog)(cwd, file);
console.log(`output file: ${ret.file}`);
//# sourceMappingURL=ws-root-changelog.js.map
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
 * 解析輸入路徑，預設為當前工作目錄；
 * 以 `??` 取代 `||`，未傳入參數時 argv[0] 為 undefined，交由 resolve 視為目前目錄
 * Parse input path, default to current working directory;
 * `??` is used because a missing argument yields undefined, which resolve() treats as the current directory
 */
let input = (0, upath2_1.resolve)(process.cwd(), (_a = argv[0]) !== null && _a !== void 0 ? _a : '');
console.log(`input: ${input}`);
/**
 * 取得根目錄 Changelog 的完整檔案路徑；
 * 內部會自動向上尋找工作區根目錄，因此傳入任意子目錄皆可
 * Get the full path of the root changelog file;
 * it searches upward for the workspace root internally, so any subdirectory works as input
 */
const file = (0, index_1.getWorkspacesRootChangelogPath)(input);
/**
 * 取得目標目錄：寫檔函式會重新解析根目錄，
 * 因此一併傳入根目錄與絕對檔名，避免重複查找造成路徑不一致
 * Get the target directory: the writer re-resolves the root,
 * so both the root and the absolute file path are passed to avoid inconsistent paths from duplicate lookups
 */
const cwd = (0, upath2_1.dirname)(file);
console.log(`target dir: ${cwd}`);
/**
 * 輸出 Changelog 檔案（同步），確保程序退出前已完成寫入，才能正確回報輸出路徑
 * Write the changelog file synchronously so the path can be reported before the process exits
 */
let ret = (0, index_1.outputWorkspacesRootChangelog)(cwd, file);
console.log(`output file: ${ret.file}`);
//# sourceMappingURL=ws-root-changelog.js.map
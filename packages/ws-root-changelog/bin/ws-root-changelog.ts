#!/usr/bin/env node

/**
 * 工作區根目錄 Changelog CLI 工具
 * Workspace Root Changelog CLI Tool
 *
 * 命令列介面，用於在工作區根目錄生成套件 Changelog 總覽
 * Command line interface for generating package changelog overview in workspace root
 */

import {
	getWorkspacesRootChangelogPath,
	outputWorkspacesRootChangelog,
	outputWorkspacesRootChangelogAsync,
} from '../index';
import { dirname, resolve } from 'upath2';

/**
 * 解析命令列參數
 * Parse command line arguments
 */
let argv = process.argv.slice(2);

/**
	 * 解析輸入路徑，預設為當前工作目錄
	 * Parse input path, default to current working directory
	 */
let input = resolve(process.cwd(), argv[0] ?? '');

console.log(`input: ${input}`);

/**
 * 獲取 Changelog 檔案路徑
 * Get changelog file path
 */
const file = getWorkspacesRootChangelogPath(input);

/**
 * 獲取目標目錄
 * Get target directory
 */
const cwd = dirname(file);

console.log(`target dir: ${cwd}`);

/**
 * 輸出 Changelog 檔案
 * Output changelog file
 */
let ret = outputWorkspacesRootChangelog(cwd, file);

console.log(`output file: ${ret.file}`);

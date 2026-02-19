/**
 * npm 快取路徑尋找模組
 * npm Cache Path Finder Module
 *
 * 此模組提供尋找 npm 全域快取路徑的功能，
 * This module provides functionality to find npm global cache path,
 * 透過執行 npm config get cache 命令取得。
 * by executing npm config get cache command.
 *
 * @module cache-path/lib/finder/findNpmCachePath
 */
/**
 * 嘗試取得 npm 全域快取路徑
 * Try to get npm global cache path
 *
 * 此函數會執行 `npm config get cache` 命令來取得 npm 的快取目錄路徑。
 * This function executes `npm config get cache` command to get npm's cache directory path.
 *
 * @param {string} [cwd] - 執行命令時的工作目錄 / Working directory when executing command
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 環境變數 / Environment variables
 * @returns {string} npm 快取目錄路徑 / npm cache directory path
 *
 * @example
 * const npmCache = findNpmCachePath();
 * console.log(npmCache); // 例如: '/Users/user/.npm' / e.g.: '/Users/user/.npm'
 */
export declare function findNpmCachePath(cwd?: string, processEnv?: NodeJS.ProcessEnv): string;

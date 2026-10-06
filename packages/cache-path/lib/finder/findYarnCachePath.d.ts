/**
 * Yarn 快取路徑尋找模組
 * Yarn Fast Cache Path Finder Module
 *
 * 此模組提供尋找 Yarn 快取路徑的功能，
 * This module provides functionality to find Yarn cache path,
 * 透過執行 yarn config current 指令或檢查環境變數取得。
 * by executing the yarn config current command or checking environment variables.
 *
 * @module cache-path/lib/finder/findYarnCachePath
 */
/**
 * 嘗試取得 Yarn 快取路徑
 * Try to get Yarn cache path
 *
 * 此函數會先執行 `yarn config current --json` 取得 Yarn 的 tempFolder，
 * This function first tries to execute `yarn config current --json` to get Yarn's tempFolder,
 * 失敗時才改查 YARN_CACHE_FOLDER 環境變數。
 * and falls back to the YARN_CACHE_FOLDER environment variable only when that fails.
 *
 * @param {string} [cwd] - 執行指令時的工作目錄 / Working directory when executing command
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 環境變數 / Environment variables
 * @returns {string|undefined} Yarn 快取目錄路徑，找不到時回傳 undefined / Yarn cache directory path, or undefined if not found
 *
 * @example
 * const yarnCache = findYarnCachePath();
 * console.log(yarnCache); // 例如: '/Users/user/Library/Caches/Yarn' / e.g.: '/Users/user/Library/Caches/Yarn'
 */
export declare function findYarnCachePath(cwd?: string, processEnv?: NodeJS.ProcessEnv): string;

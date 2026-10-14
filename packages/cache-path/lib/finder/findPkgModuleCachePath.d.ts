/**
 * 專案模組快取路徑尋找模組
 * Package Module Cache Path Finder Module
 *
 * @module cache-path/lib/finder/findPkgModuleCachePath
 */
import { IOptions } from "../types";
/**
 * 尋找專案根目錄
 * Find package root directory
 *
 * 使用 @yarn-tool/find-root 尋找專案的根目錄。
 * Uses @yarn-tool/find-root to find the project's root directory.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} 專案根目錄路徑 / Package root directory path
 */
export declare function findPkgPath(cwd?: string): string;
/**
 * 取得 node_modules 路徑的核心函式
 * Core function to get node_modules path
 *
 * @param {string} root - 專案根目錄 / Package root
 * @returns {string} node_modules 目錄路徑 / node_modules directory path
 */
export declare function findPkgModulePathCore(root: string): string;
/**
 * 取得專案快取路徑的核心函式
 * Core function to get package cache path
 *
 * @param {string} root - 專案根目錄 / Package root
 * @returns {string} node_modules 底下的快取目錄路徑 / Cache directory path under node_modules
 */
export declare function findPkgModuleCachePathCore(root: string, processEnv?: NodeJS.ProcessEnv, options?: IOptions): string;
/**
 * 嘗試取得 專案/node_modules 路徑
 * Try to get pkg/node_modules path
 *
 * 尋找目前目錄所屬專案的 node_modules 目錄。
 * Finds the node_modules directory of the project where the current directory is located.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} node_modules 目錄路徑 / node_modules directory path
 *
 * @example
 * const modulesPath = findPkgModulePath();
 * console.log(modulesPath); // '/path/to/project/node_modules'
 */
export declare function findPkgModulePath(cwd?: string): string;
/**
 * 尋找專案的 node_modules/.cache 目錄路徑
 * Find package's node_modules/.cache directory path
 *
 * 尋找目前目錄所屬專案 node_modules 底下的 .cache 目錄。
 * Finds the .cache directory under node_modules of the project where the current directory is located.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} 快取目錄路徑 / Cache directory path
 *
 * @example
 * const cachePath = findPkgModuleCachePath();
 * console.log(cachePath); // '/path/to/project/node_modules/.cache'
 */
export declare function findPkgModuleCachePath(cwd?: string, processEnv?: NodeJS.ProcessEnv, options?: IOptions): string;

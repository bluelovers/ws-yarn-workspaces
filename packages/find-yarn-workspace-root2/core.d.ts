/**
 * 尋找 Yarn Workspace 根目錄的核心模組
 * Core module for finding Yarn workspace root directory
 *
 * 此模組提供演算法來找出 Yarn workspace 的根目錄位置，
 * This module provides algorithms to locate the root directory of a Yarn workspace,
 * 從 yarnpkg.com 提取並改良而來。
 * extracted and improved from yarnpkg.com.
 *
 * @module find-yarn-workspace-root2/core
 */
/**
 * 尋找 Yarn workspace 的根目錄路徑
 * Find the root directory path of a Yarn workspace
 *
 * 此函數會從指定的起始目錄開始，向上遍歷目錄樹，
 * This function traverses up the directory tree from the specified starting directory,
 * 尋找包含 workspaces 配置 的 package.json 所在目錄。
 * looking for the directory containing a package.json with workspaces configuration.
 *
 * 演算法改編自 Yarn 原始碼：
 * Algorithm adapted from Yarn source code:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 *
 * @param {string} [initial] - 起始搜尋目錄，若未提供則使用當前工作目錄 / Starting directory for search, uses current working directory if not provided
 * @returns {string|null} workspace 根目錄的絕對路徑，若找不到則返回 null / Absolute path to workspace root, or null if not found
 *
 * @example
 * // 從當前目錄開始搜尋 / Search from current directory
 * const root = findWorkspaceRoot();
 *
 * @example
 * // 從指定目錄開始搜尋 / Search from specified directory
 * const root = findWorkspaceRoot('/path/to/project');
 */
export declare function findWorkspaceRoot(initial?: string): string;
export declare namespace findWorkspaceRoot {
    export var findWorkspaceRoot: typeof import("./core").findWorkspaceRoot;
    export var readPackageJSON: typeof import("./core").readPackageJSON;
    export var extractWorkspaces: typeof import("./core").extractWorkspaces;
    export var isMatchWorkspaces: typeof import("./core").isMatchWorkspaces;
    var _a: typeof import("./core").findWorkspaceRoot;
    export { _a as default };
}
/**
 * 檢查當前目錄是否符合 Yarn workspace 的條件
 * Check if current directory matches Yarn workspace conditions
 *
 * 此函數會驗證指定的目錄是否為有效的 workspace 根目錄，
 * This function validates whether the specified directory is a valid workspace root,
 * 透過檢查 workspaces 配置和路徑匹配來判斷。
 * by examining workspaces configuration and path matching.
 *
 * @param {string} current - 當前正在檢查的目錄路徑 / Current directory path being examined
 * @param {string} initial - 起始搜尋的目錄路徑 / Initial directory path where search started
 * @returns {Object} 檢查結果物件 / Check result object
 * @returns {boolean} returns.done - 是否已完成檢查（找到 workspaces 配置）/ Whether check is complete (workspaces config found)
 * @returns {string|null} returns.found - 找到的 workspace 根目錄路徑，若不符合則為 null / Found workspace root path, or null if not matching
 * @returns {string} returns.relativePath - 從 current 到 initial 的相對路徑 / Relative path from current to initial
 */
export declare function checkWorkspaces(current: string, initial: string): {
    done: boolean;
    found: string;
    relativePath: string;
};
/**
 * 檢查相對路徑是否符合 workspaces 的 glob 模式
 * Check if relative path matches workspaces glob patterns
 *
 * 使用 micromatch 函式庫進行 glob 模式匹配，
 * Uses micromatch library for glob pattern matching,
 * 判斷指定的路徑是否屬於 workspace 的一部分。
 * determining if the specified path is part of the workspace.
 *
 * @param {string} relativePath - 要檢查的相對路徑 / Relative path to check
 * @param {string[]} workspaces - workspaces 的 glob 模式陣列 / Array of glob patterns for workspaces
 * @returns {boolean} 若路徑符合任一模式則返回 true / Returns true if path matches any pattern
 *
 * @example
 * isMatchWorkspaces('packages/pkg-a', ['packages/*']); // true
 * isMatchWorkspaces('src/utils', ['packages/*']); // false
 */
export declare function isMatchWorkspaces(relativePath: string, workspaces: string[]): boolean;
/**
 * 從 package.json 的 manifest 物件中提取 workspaces 配置
 * Extract workspaces configuration from package.json manifest object
 *
 * Yarn workspaces 支援兩種配置格式：
 * Yarn workspaces supports two configuration formats:
 * 1. 陣列格式：`workspaces: ['packages/*']`
 * 2. 物件格式：`workspaces: { packages: ['packages/*'] }`
 *
 * 此函數會自動識別並提取正確的配置格式。
 * This function automatically identifies and extracts the correct configuration format.
 *
 * @template T - workspaces 字串陣列的類型 / Type of workspaces string array
 * @param {Object} manifest - package.json 的內容物件 / package.json content object
 * @param {Object} [manifest.workspaces] - workspaces 配置 / workspaces configuration
 * @returns {T|null} workspaces 的 packages 陣列，若無配置則返回 null / workspaces packages array, or null if not configured
 *
 * @example
 * // 陣列格式 / Array format
 * extractWorkspaces({ workspaces: ['packages/*'] });
 * // 返回 ['packages/*'] / Returns ['packages/*']
 *
 * @example
 * // 物件格式 / Object format
 * extractWorkspaces({ workspaces: { packages: ['packages/*'] } });
 * // 返回 ['packages/*'] / Returns ['packages/*']
 */
export declare function extractWorkspaces<T extends string[]>(manifest: {
    workspaces?: {
        packages: T;
    };
}): T;
export declare function extractWorkspaces<T extends string[]>(manifest: {
    workspaces?: T;
}): T;
/**
 * 讀取指定目錄下的 package.json 檔案
 * Read package.json file from specified directory
 *
 * 此函數會嘗試讀取指定目錄下的 package.json 檔案並解析為 JSON 物件。
 * This function attempts to read and parse the package.json file from the specified directory.
 * 若檔案不存在則返回 null。
 * Returns null if the file does not exist.
 *
 * @template T - package.json 物件的類型，需包含 workspaces 屬性 / Type of package.json object, must include workspaces property
 * @param {string} dir - 要讀取 package.json 的目錄路徑 / Directory path to read package.json from
 * @returns {T|null} 解析後的 package.json 物件，若檔案不存在則返回 null / Parsed package.json object, or null if file doesn't exist
 *
 * @example
 * const manifest = readPackageJSON('/path/to/project');
 * console.log(manifest?.name); // 套件名稱 / Package name
 */
export declare function readPackageJSON<T extends {
    workspaces?: any;
}>(dir: string): T;
export default findWorkspaceRoot;

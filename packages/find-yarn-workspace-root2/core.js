"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWorkspaceRoot = findWorkspaceRoot;
exports.checkWorkspaces = checkWorkspaces;
exports.isMatchWorkspaces = isMatchWorkspaces;
exports.extractWorkspaces = extractWorkspaces;
exports.readPackageJSON = readPackageJSON;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const pkg_dir_1 = tslib_1.__importDefault(require("pkg-dir"));
const fs_1 = require("fs");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
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
function findWorkspaceRoot(initial) {
    // 若未提供起始目錄，使用當前工作目錄
    // Use current working directory if no initial path provided
    if (!initial) {
        initial = process.cwd();
    }
    // 使用 pkg-dir 找出最近的 package.json 所在目錄
    // Use pkg-dir to find the nearest directory containing package.json
    let _pkg = pkg_dir_1.default.sync(initial);
    // 若找不到 package.json，返回 null
    // Return null if no package.json found
    if (!_pkg) {
        return null;
    }
    // 標準化路徑格式
    // Normalize path format
    initial = (0, upath2_1.normalize)(_pkg);
    // 用於追蹤上一個檢查的目錄，防止無限迴圈
    // Track previous directory to prevent infinite loops
    let previous = null;
    // 當前正在檢查的目錄
    // Current directory being examined
    let current = initial;
    // 向上遍歷目錄樹，尋找 workspace 根目錄
    // Traverse up the directory tree to find workspace root
    do {
        // 讀取當前目錄的 package.json
        // Read package.json from current directory
        const manifest = readPackageJSON(current);
        // 提取 workspaces 配置
        // Extract workspaces configuration
        const workspaces = extractWorkspaces(manifest);
        // 檢查當前目錄是否符合 workspace 條件
        // Check if current directory matches workspace conditions
        let { done, found } = checkWorkspaces(current, initial);
        // 若檢查完成，返回結果
        // Return result if check is complete
        if (done) {
            return found;
        }
        // 更新追蹤變數，移動到上層目錄
        // Update tracking variables, move to parent directory
        previous = current;
        current = (0, upath2_1.dirname)(current);
    } 
    // 當 current 等於 previous 時表示已到達根目錄
    // When current equals previous, we've reached the root directory
    while (current !== previous);
    // 未找到 workspace 根目錄
    // No workspace root found
    return null;
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
function checkWorkspaces(current, initial) {
    // 讀取當前目錄的 package.json
    // Read package.json from current directory
    const manifest = readPackageJSON(current);
    // 提取 workspaces 配置
    // Extract workspaces configuration
    const workspaces = extractWorkspaces(manifest);
    // 檢查結果的狀態變數
    // Status variables for check result
    let done = false;
    let found;
    let relativePath;
    // 若存在 workspaces 配置，進行進一步檢查
    // If workspaces configuration exists, perform further checks
    if (workspaces) {
        // 標記檢查完成
        // Mark check as complete
        done = true;
        // 計算從當前目錄到起始目錄的相對路徑
        // Calculate relative path from current directory to initial directory
        relativePath = (0, upath2_1.relative)(current, initial);
        // 若相對路徑為空（同一目錄）或符合 workspaces 模式，則找到根目錄
        // If relative path is empty (same directory) or matches workspaces pattern, root is found
        if (relativePath === '' || isMatchWorkspaces(relativePath, workspaces)) {
            found = current;
        }
        else {
            // 路徑不符合 workspaces 模式
            // Path does not match workspaces pattern
            found = null;
        }
    }
    return {
        done,
        found,
        relativePath,
    };
}
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
function isMatchWorkspaces(relativePath, workspaces) {
    // 使用 micromatch 進行 glob 模式匹配
    // Use micromatch for glob pattern matching
    let ls = (0, micromatch_1.default)([relativePath], workspaces);
    // 若匹配結果不為空，表示路徑符合 workspaces 模式
    // If match result is not empty, path matches workspaces pattern
    return ls.length > 0;
}
function extractWorkspaces(manifest) {
    // 從 manifest 中取得 workspaces 屬性
    // Get workspaces property from manifest
    const workspaces = (manifest || {}).workspaces;
    // 優先返回物件格式的 packages 屬性，否則返回陣列格式，皆無則返回 null
    // Return packages property from object format first, otherwise return array format, or null if neither
    return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
}
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
function readPackageJSON(dir) {
    // 組合 package.json 的完整路徑
    // Construct full path to package.json
    const file = (0, upath2_1.join)(dir, 'package.json');
    // 檢查檔案是否存在，若存在則讀取並解析
    // Check if file exists, read and parse if it does
    if ((0, fs_1.existsSync)(file)) {
        return JSON.parse((0, fs_1.readFileSync)(file, 'utf8'));
    }
    // 檔案不存在時返回 null
    // Return null when file doesn't exist
    return null;
}
// 將輔助函數附加到 findWorkspaceRoot 作為靜態屬性
// Attach helper functions to findWorkspaceRoot as static properties
findWorkspaceRoot.findWorkspaceRoot = findWorkspaceRoot;
findWorkspaceRoot.readPackageJSON = readPackageJSON;
findWorkspaceRoot.extractWorkspaces = extractWorkspaces;
findWorkspaceRoot.isMatchWorkspaces = isMatchWorkspaces;
findWorkspaceRoot.default = findWorkspaceRoot;
exports.default = findWorkspaceRoot;
//# sourceMappingURL=core.js.map
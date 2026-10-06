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
    /**
     * 若未提供起始目錄，使用當前工作目錄
     * Use current working directory if no initial path provided
     */
    if (!initial) {
        initial = process.cwd();
    }
    /**
     * 使用 pkg-dir 找出最近的 package.json 所在目錄
     * Use pkg-dir to find the nearest directory containing package.json
     */
    let _pkg = pkg_dir_1.default.sync(initial);
    /**
     * 找不到 package.json 表示不在任何 npm 套件內，此時無從判斷 workspace，返回 null
     * Return null if no package.json found, meaning there is no package to evaluate a workspace from
     */
    if (!_pkg) {
        return null;
    }
    /**
     * 標準化路徑格式，避免因分隔符或大小寫差異導致後續相對路徑 glob 匹配失敗
     * Normalize path format to prevent relative path glob mismatch caused by separator or case differences
     */
    initial = (0, upath2_1.normalize)(_pkg);
    /**
     * 用於追蹤上一個檢查的目錄，防止無限迴圈
     * Track previous directory to prevent infinite loops
     */
    let previous = null;
    /**
     * 當前正在檢查的目錄
     * Current directory being examined
     */
    let current = initial;
    /**
     * 向上遍歷目錄樹，尋找 workspace 根目錄
     * Traverse up the directory tree to find workspace root
     *
     * 每次迭代會讀取當前目錄的 package.json 與 workspaces 配置，並交由 checkWorkspaces 判定；
     * 讀取結果亦作為日後除錯時的中繼狀態，實際判定以 checkWorkspaces 的回傳值為準。
     * Each iteration reads the current directory's package.json and workspaces configuration, then defers
     * the verdict to checkWorkspaces; the read result is intermediate state, the returned value is authoritative.
     */
    do {
        /**
         * 讀取當前目錄的 package.json
         * Read package.json from current directory
         */
        const manifest = readPackageJSON(current);
        /**
         * 提取 workspaces 配置
         * Extract workspaces configuration
         */
        const workspaces = extractWorkspaces(manifest);
        /**
         * 檢查當前目錄是否符合 workspace 條件
         * Check if current directory matches workspace conditions
         */
        let { done, found } = checkWorkspaces(current, initial);
        /**
         * 若檢查完成（已找到帶 workspaces 配置的目錄），立即返回結果，
         * 包含「找到根目錄」與「路徑不符合模式」兩種情況
         * Return immediately once the check is done (a directory with workspaces config was reached),
         * covering both "root found" and "path does not match the pattern" outcomes
         */
        if (done) {
            return found;
        }
        /**
         * 更新追蹤變數，移動到上層目錄繼續查找
         * Update tracking variables, move to parent directory to continue the search
         */
        previous = current;
        current = (0, upath2_1.dirname)(current);
    } 
    /**
     * 當 current 等於 previous 時表示已到達根目錄，終止迴圈以免在根目錄無限迴圈
     * When current equals previous we've reached the root directory; stop to avoid looping forever at the root
     */
    while (current !== previous);
    /**
     * 已到達根目錄仍未找到 workspace 根目錄
     * Reached the root directory without finding a workspace root
     */
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
    /**
     * 讀取當前目錄的 package.json
     * Read package.json from current directory
     */
    const manifest = readPackageJSON(current);
    /**
     * 提取 workspaces 配置
     * Extract workspaces configuration
     */
    const workspaces = extractWorkspaces(manifest);
    /**
     * 檢查結果的狀態變數：done 表示是否已完成判定，found 為找到的根目錄
     * Status variables: done indicates the verdict is final, found holds the located root
     */
    let done = false;
    let found;
    let relativePath;
    /**
     * 若存在 workspaces 配置，進行進一步檢查；
     * 找到配置即代表檢查結束（done = true），不再往上層目錄查找
     * If a workspaces configuration exists, perform further checks;
     * reaching a configured directory ends the search (done = true), no further ancestors are inspected
     */
    if (workspaces) {
        /**
         * 標記檢查完成
         * Mark check as complete
         */
        done = true;
        /**
         * 計算從當前目錄到起始目錄的相對路徑，作為 glob 匹配的輸入
         * Calculate relative path from current directory to initial directory, used as input for glob matching
         */
        relativePath = (0, upath2_1.relative)(current, initial);
        /**
         * 相對路徑為空表示起始目錄就是根目錄本身，此時不需匹配直接成立；
         * 否則需符合 workspaces 的 glob 模式才算找到根目錄
         * An empty relative path means the initial directory is the root itself and matches without globbing;
         * otherwise the path must match a workspaces glob pattern to count as the root
         */
        if (relativePath === '' || isMatchWorkspaces(relativePath, workspaces)) {
            found = current;
        }
        else {
            /**
             * 路徑不符合 workspaces 模式，表示此配置屬於其他 workspace 分支
             * Path does not match workspaces pattern, meaning this configuration belongs to another workspace branch
             */
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
    /**
     * 使用 micromatch 進行 glob 模式匹配，將單一路徑視為候選字串比對所有模式
     * Use micromatch for glob pattern matching, treating the single path as the candidate against all patterns
     */
    let ls = (0, micromatch_1.default)([relativePath], workspaces);
    /**
     * 匹配結果非空即表示路徑符合 workspaces 模式；
     * micromatch 找不到符合項時回傳空陣列，故以此作為 false 的判定
     * A non-empty match result means the path matches a workspaces pattern;
     * micromatch returns an empty array when nothing matches, which serves as the false case
     */
    return ls.length > 0;
}
function extractWorkspaces(manifest) {
    /**
     * 從 manifest 中取得 workspaces 屬性
     * Get workspaces property from manifest
     *
     * 以 `(manifest || {})` 防禦 manifest 為 null/undefined 的情況（例如 package.json 不存在）
     * Guards against a null/undefined manifest (e.g. missing package.json) via `(manifest || {})`
     */
    const workspaces = (manifest || {}).workspaces;
    /**
     * 優先返回物件格式的 packages 屬性，否則返回陣列格式，皆無則返回 null
     * 物件格式若不含 packages，會被視為無效配置而退回 null
     * Return packages property from object format first, otherwise return array format, or null if neither
     * An object-format entry without a `packages` field is treated as invalid and falls back to null
     */
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
    /**
     * 組合 package.json 的完整路徑
     * Construct full path to package.json
     */
    const file = (0, upath2_1.join)(dir, 'package.json');
    /**
     * 先檢查檔案是否存在再讀取，避免不存在時 readFileSync 拋出 ENOENT 例外中斷向上查找
     * Check existence before reading, so a missing file does not throw ENOENT and abort the upward search
     */
    if ((0, fs_1.existsSync)(file)) {
        return JSON.parse((0, fs_1.readFileSync)(file, 'utf8'));
    }
    /**
     * 檔案不存在時返回 null
     * Return null when file doesn't exist
     */
    return null;
}
/**
 * 將輔助函數附加到 findWorkspaceRoot 作為靜態屬性，
 * 使 CommonJS 使用者只取得預設函式也能存取其餘 API
 * Attach helper functions to findWorkspaceRoot as static properties,
 * so CommonJS consumers holding only the default function can still reach the rest of the API
 */
findWorkspaceRoot.findWorkspaceRoot = findWorkspaceRoot;
findWorkspaceRoot.readPackageJSON = readPackageJSON;
findWorkspaceRoot.extractWorkspaces = extractWorkspaces;
findWorkspaceRoot.isMatchWorkspaces = isMatchWorkspaces;
findWorkspaceRoot.default = findWorkspaceRoot;
exports.default = findWorkspaceRoot;
//# sourceMappingURL=core.js.map
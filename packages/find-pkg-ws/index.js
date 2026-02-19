"use strict";
/**
 * 尋找 Yarn Workspaces 的 package.json 檔案
 * Find Yarn Workspaces package.json file
 *
 * 此模組提供快速找到 Yarn workspace 根目錄下 package.json 的功能，
 * This module provides functionality to quickly find the package.json file
 * 位於 workspace 根目錄下的 package.json 檔案路徑。
 * at the root directory of a Yarn workspace.
 *
 * @packageDocumentation
 */
/**
 * Created by user on 2018/5/14/014.
 */
const core_1 = require("find-yarn-workspace-root2/core");
const path_1 = require("path");
/**
 * 尋找 Yarn workspace 根目錄的 package.json 檔案路徑
 * Find the path to package.json in Yarn workspace root directory
 *
 * 此函數會從指定目錄開始搜尋，找到 workspace 根目錄後，
 * This function searches from the specified directory, and after finding the workspace root,
 * 返回該目錄下 package.json 的完整路徑。
 * returns the full path to the package.json in that directory.
 *
 * @param {string} [cwd] - 起始搜尋目錄，若未提供則使用當前工作目錄 / Starting directory for search, uses current working directory if not provided
 * @returns {string|null} package.json 的絕對路徑，若找不到 workspace 則返回 null / Absolute path to package.json, or null if workspace not found
 *
 * @example
 * // 從當前目錄搜尋 / Search from current directory
 * const pkgPath = findWorkspacePackageJson();
 * console.log(pkgPath); // '/path/to/workspace/root/package.json'
 *
 * @example
 * // 從指定目錄搜尋 / Search from specified directory
 * const pkgPath = findWorkspacePackageJson('/path/to/subdir');
 */
function findWorkspacePackageJson(cwd) {
    // 使用 findYarnWorkspaceRoot 找到 workspace 根目錄
    // Use findYarnWorkspaceRoot to find workspace root directory
    let ws = (0, core_1.findWorkspaceRoot)(cwd || process.cwd());
    // 若找到 workspace 根目錄，返回 package.json 的完整路徑
    // If workspace root is found, return full path to package.json
    if (ws) {
        return (0, path_1.join)(ws, 'package.json');
    }
    // 未找到 workspace 根目錄，返回 null
    // Return null if workspace root not found
    return null;
}
// 將函數附加為自身的靜態屬性，方便存取
// Attach function as its own static property for convenient access
findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;
module.exports = findWorkspacePackageJson;
//# sourceMappingURL=index.js.map
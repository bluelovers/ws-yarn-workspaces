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
declare function findWorkspacePackageJson(cwd?: string): string;
declare namespace findWorkspacePackageJson {
    export var findPkg: typeof findWorkspacePackageJson;
    var _a: typeof findWorkspacePackageJson;
    export { _a as default };
}
export = findWorkspacePackageJson;

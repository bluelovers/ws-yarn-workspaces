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

import { findWorkspaceRoot as findYarnWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { join } from 'path';

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
function findWorkspacePackageJson(cwd?: string)
{
	/**
	 * 委由 findYarnWorkspaceRoot 判斷工作區根目錄，
	 * 因為只有它知道 workspaces glob 與 monorepo 結構的判定規則
	 * Delegate workspace-root detection to findYarnWorkspaceRoot, since only it
	 * knows the rules for workspaces globs and monorepo layout
	 */
	let ws = findYarnWorkspaceRoot(cwd || process.cwd());

	/**
	 * 找到根目錄才組出路徑；此處不回傳 null 而交由下一段處理，
	 * 讓「找不到」的分支集中在單一出口
	 * Only join the path when a root was found; deferring the miss case to the
	 * fall-through below keeps the "not found" branch at a single exit point
	 */
	if (ws)
	{
		return join(ws, 'package.json');
	}

	/**
	 * 回傳 null 而非拋錯：「不在任何 workspace 內」是合法情況，
	 * 呼叫端應自行決定是否視為錯誤
	 * Return null instead of throwing: "not inside any workspace" is a legitimate
	 * situation and the caller decides whether that is an error
	 */
	return null;
}

/**
 * 將函式附加為自身的靜態屬性，
 * 讓 require() 後無論取用預設或具名存取都能拿到同一函式
 * Attach the function as its own static property so that after require(),
 * both default and named access yield the same function
 */
findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;

export = findWorkspacePackageJson

/**
 * 工作區模組路徑尋找工具
 * Workspace module path finding utilities
 *
 * @author user
 * @created 2020/6/5
 */

import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import { findModulesPackagePaths } from './find-paths';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { IListableRow } from 'ws-pkg-list/lib/types';
import { findWorkspaceRoot } from 'find-yarn-workspace-root2/core';

/**
 * 工作區模組路徑尋找核心函數
 * Core function for finding workspace module paths
 *
 * @param list - 工作區套件列表 / Workspace package list
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
export function wsFindPackageHasModulesCore(list: IListableRow[], cwd: string, dir?: string)
{
	return list
		.map(row => {
			// 對每個套件尋找其 node_modules 中的模組
			// Find modules in node_modules for each package
			let modules = findModulesPackagePaths(row.location, dir).modules

			return {
				// 保留原有的套件資訊
				...row,
				// 新增模組資訊
				modules,
			}
		})
		.filter(data => data?.modules?.length)  // 過濾出有模組的套件
	;
}

/**
 * 尋找工作區中包含模組的套件
 * Find packages in workspace that contain modules
 *
 * @param cwd - 可選的工作目錄，若未提供則自動尋找工作區根目錄 / Optional working directory, automatically finds workspace root if not provided
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
export function wsFindPackageHasModules(cwd?: string, dir?: string)
{
	// 自動尋找工作區根目錄
	// Automatically find workspace root directory
	cwd = findWorkspaceRoot(cwd);

	// 取得工作區套件列表並尋找模組
	// Get workspace package list and find modules
	return wsFindPackageHasModulesCore(wsPkgListable(cwd), cwd, dir)
}

export default wsFindPackageHasModules

/**
 * Get root copy static files configuration / 獲取根目錄複製靜態檔案配置
 *
 * This module provides a function to determine the appropriate static files
 * to copy based on the project root structure.
 * 此模組提供根據專案根目錄結構確定要複製的適當靜態檔案的函數。
 *
 * @module getRootCopyStaticFiles
 */
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IStaticFilesMapArray } from '../types';
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '../const';

/**
 * Get the appropriate static files map based on root data / 根據根目錄數據獲取適當的靜態檔案映射
 *
 * Determines which static files should be copied based on whether the current
 * directory is the workspace root and whether it has workspaces.
 * 根據當前目錄是否為工作區根目錄以及是否具有工作區，確定應複製哪些靜態檔案。
 *
 * @param rootData - Information about the project root / 關於專案根目錄的資訊
 * @param rootData.isRoot - Whether the current directory is the workspace root / 當前目錄是否為工作區根目錄
 * @param rootData.hasWorkspace - Whether the project has workspaces / 專案是否具有工作區
 *
 * @returns An array of static file entries to copy / 要複製的靜態檔案條目陣列
 *
 * @example
 * ```typescript
 * import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file';
 *
 * // For a workspace root with workspaces
 * // 對於具有工作區的工作區根目錄
 * const files1 = getRootCopyStaticFilesAuto({
 *   isRoot: true,
 *   hasWorkspace: true
 * });
 * // Returns only defaultCopyStaticFiles (not root-only files)
 * // 僅返回 defaultCopyStaticFiles（不包含僅根目錄的檔案）
 *
 * // For a standalone project root
 * // 對於獨立專案根目錄
 * const files2 = getRootCopyStaticFilesAuto({
 *   isRoot: true,
 *   hasWorkspace: false
 * });
 * // Returns defaultCopyStaticFiles + defaultCopyStaticFilesRootOnly
 * // 返回 defaultCopyStaticFiles + defaultCopyStaticFilesRootOnly
 *
 * // For a package within a workspace
 * // 對於工作區內的套件
 * const files3 = getRootCopyStaticFilesAuto({
 *   isRoot: false,
 *   hasWorkspace: true
 * });
 * // Returns only defaultCopyStaticFiles
 * // 僅返回 defaultCopyStaticFiles
 * ```
 */
export function getRootCopyStaticFilesAuto(rootData: Pick<IFindRootReturnType, 'isRoot'| 'hasWorkspace'>)
{
	/**
	 * 從預設套件層級檔案開始
	 * Start with default package-level files
	 *
	 * 所有情境都需要的基礎檔案（.gitignore、tsconfig 等）
	 * Base files needed in every scenario (.gitignore, tsconfig, etc.)
	 */
	let file_map: IStaticFilesMapArray<string> = [
		...defaultCopyStaticFiles,
	];

	/**
	 * 只有根目錄才可能需要額外檔案
	 * Only a root directory can need the extra files
	 */
	if (rootData.isRoot)
	{
		/**
		 * 具有 workspaces 的根目錄代表 monorepo，
		 * 根目錄專用檔案（如 pnpm-workspace.yaml）交由工作區流程處理，故不加入
		 * A root with workspaces is a monorepo, where root-only files (e.g. pnpm-workspace.yaml)
		 * are handled by the workspace flow, so they are not added here
		 */
		if (!rootData.hasWorkspace)
		{
			file_map = [
				...file_map,
				...defaultCopyStaticFilesRootOnly,
			];
		}
	}

	return file_map
}

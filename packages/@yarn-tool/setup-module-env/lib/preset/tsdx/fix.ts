/**
 * tsdx package.json 修復與調整工具函式
 * Utility functions for fixing and adjusting tsdx package.json
 */

import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
import { deleteValue } from 'dot-values2';
import { ITSPickExtra } from 'ts-type/lib/type/record';

/**
 * 修復 tsdx 專案的 package.json 設定
 * Fix tsdx project's package.json configuration
 *
 * 根據工作區 (workspace) 的狀態調整 tslib 依賴的位置：
 * Adjusts tslib dependency location based on workspace status:
 *
 * - 如果位於工作區內但不是工作區根目錄：移除 tslib 依賴（由根目錄統一管理）
 *   If inside a workspace but not the workspace root: removes tslib dependency (managed by root)
 *
 * - 如果是獨立專案或工作區根目錄：將 tslib 從 dependencies 移至 devDependencies
 *   If standalone project or workspace root: moves tslib from dependencies to devDependencies
 *
 * @param pkg - package.json 物件 / package.json object
 * @param config - 包含 rootData 的設定選項 / configuration options containing rootData
 * @returns 修改後的 package.json 物件 / Modified package.json object
 */
export function fixTsdxPackage<P extends IPackageJson>(pkg: P, config: ITSPickExtra<ISetupTsdxOptions<P>, 'rootData'>)
{
	// 檢查是否在工作區內但不是工作區本身（即子套件）
	// Check if inside a workspace but not the workspace itself (i.e., sub-package)
	if (config.rootData.hasWorkspace && !config.rootData.isWorkspace)
	{
		// 在工作區子套件中，移除 tslib 依賴（由根目錄統一管理）
		// In workspace sub-packages, remove tslib dependency (managed by root)
		deleteValue(pkg, ['dependencies', 'tslib']);
		deleteValue(pkg, ['devDependencies', 'tslib']);
	}
	else
	{
		// 確保 devDependencies 存在
		// Ensure devDependencies exists
		pkg.devDependencies ??= {};

		// 如果 tslib 在 dependencies 中，將其移至 devDependencies
		// If tslib is in dependencies, move it to devDependencies
		if (pkg.dependencies?.['tslib']?.length > 0)
		{
			pkg.devDependencies['tslib'] ??= pkg.dependencies['tslib'];
			deleteValue(pkg, ['dependencies', 'tslib']);
		}

		// 如果是根目錄，確保 @bluelovers/tsconfig 存在
		// If it's the root directory, ensure @bluelovers/tsconfig exists
		if (config.rootData.isRoot)
		{
			pkg.devDependencies['@bluelovers/tsconfig'] ??= '*';
		}
	}

	return pkg
}

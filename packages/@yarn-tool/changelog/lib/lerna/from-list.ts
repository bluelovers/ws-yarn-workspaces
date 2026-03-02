/**
 * 基於套件列表更新 Changelog 模組
 * Update Changelog Based on Package List Module
 *
 * 根據工作區根目錄自動查找並更新指定套件的 Changelog
 * Automatically finds and updates changelog for specified package based on workspace root
 */

import { IListableRow, wsPkgListableFromPaths } from 'ws-pkg-list';
import { IOptionsWithType, IOptionsUpdateChangelog } from '../types';
import { findRoot } from '@yarn-tool/find-root';
import updateChangelog from './update';
import { defaults } from 'lodash';

/**
 * 根據工作目錄更新 Changelog
 * Update changelog based on working directory
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Partial<IOptionsWithType<IOptionsUpdateChangelog>>} [options] - 更新選項 / Update options
 * @returns {Promise<object>} 包含更新結果和元資訊的物件 / Object containing update result and metadata
 */
export function updateChangelogByCwd(cwd?: string, options?: Partial<IOptionsWithType<IOptionsUpdateChangelog>>)
{
	/**
	 * 查找工作區根資訊
	 * Find workspace root information
	 */
	let rootData = findRoot({
		cwd: cwd ?? process.cwd(),
	})

	/**
	 * 禁止在工作區根目錄建立 Changelog
	 * Disallow creating changelog in workspace root
	 */
	if (rootData.hasWorkspace && rootData.isWorkspace)
	{
		throw new Error(`disallow create changelog for workspace root`)
	}

	/**
	 * 設定實際的套件目錄
	 * Set actual package directory
	 */
	cwd = rootData.pkg;

	/**
	 * 從路徑獲取套件資訊
	 * Get package info from path
	 */
	let pkg = wsPkgListableFromPaths([
		rootData.pkg,
	])[0];

	/**
	 * 合併選項
	 * Merge options
	 */
	options = {
		...options,
	}

	/**
	 * 設定預設選項值
	 * Set default option values
	 */
	options = defaults(options ?? {}, {
		rootPath: rootData.root,
	});

	/**
	 * 執行更新並返回結果
	 * Execute update and return result
	 */
	return updateChangelog(pkg, options as any)
		.then(data => {
			return {
				...data,
				cwd,
				rootPath: options.rootPath,
				options,
				pkg,
			}
		})
	;
}

/**
 * 預設匯出函數
 * Default export function
 */
export default updateChangelogByCwd

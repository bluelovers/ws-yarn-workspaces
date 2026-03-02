/**
 * Changelog 更新模組
 * Changelog Update Module
 *
 * 使用 conventional commits 更新套件的 CHANGELOG.md
 * Updates package CHANGELOG.md using conventional commits
 */

import { IListableRow } from 'ws-pkg-list';
import { IOptionsUpdateChangelog, IOptionsWithType, IReturnTypeUpdateChangelog } from '../types';
import { updateChangelog as _updateChangelog } from '@lerna/conventional-commits/lib/update-changelog';
import { handleOptions } from './util';
import { normalize } from 'upath2';

/**
 * 更新指定套件的 Changelog
 * Update changelog for specified package
 *
 * @param {IListableRow} pkg - 套件資訊 / Package information
 * @param {IOptionsWithType<IOptionsUpdateChangelog>} [options] - 更新選項 / Update options
 * @returns {Promise<IReturnTypeUpdateChangelog>} 更新結果 / Update result
 */
export function updateChangelog(pkg: IListableRow, options?: IOptionsWithType<IOptionsUpdateChangelog>): Promise<IReturnTypeUpdateChangelog>
{
	/**
	 * 處理並標準化選項
	 * Process and normalize options
	 */
	options = handleOptions(options)

	/**
	 * 設定版本號，優先使用選項中的版本，否則使用套件目前版本
	 * Set version, prioritize option version or use package current version
	 */
	let version = options.version ?? pkg.version;
	options.version = version;

	/**
	 * 呼叫 @lerna/conventional-commits 更新 Changelog
	 * Call @lerna/conventional-commits to update changelog
	 */
	return _updateChangelog({
		...pkg,
		version,
	}, options.type, options)
		.then((data: IReturnTypeUpdateChangelog) => {
			return {
				...data,
				/**
				 * 標準化日誌路徑
				 * Normalize log path
				 */
				logPath: normalize(data.logPath),
				version,
			}
		})
	;
}

/**
 * 預設匯出更新函數
 * Default export update function
 */
export default updateChangelog

/**
 * Lerna Changelog 工具函數模組
 * Lerna Changelog Utility Functions Module
 *
 * 處理選項的預設值和規範解析
 * Handles option defaults and preset resolution
 */

import {
	IOptionsWithType,
	IOptionsUpdateChangelog,
	IOptionsRecommendVersion,
	IOptionsBaseCore,
	IChangelogPreset, IOptionsBase,
} from '../types';
import { defaults } from 'lodash';
import { requireResolveExtra, requireResolveCore } from '@yarn-tool/require-resolve';
import { join } from 'path';

/**
 * 處理並標準化選項
 * Process and normalize options
 *
 * 設定預設值並解析 changelog 預設規範
 * Sets defaults and resolves changelog preset
 *
 * @param {IOptionsWithType<T>} [options] - 輸入選項 / Input options
 * @returns {IOptionsWithType<T>} 標準化後的選項 / Normalized options
 */
export function handleOptions<T extends IOptionsRecommendVersion | IOptionsUpdateChangelog>(options?: IOptionsWithType<T>): IOptionsWithType<T>
{
	/**
	 * 預設的 Changelog 規範
	 * Default changelog preset
	 */
	const defaultChangelogPreset = '@bluelovers/conventional-changelog-bluelovers' as const;

	/**
	 * 設定預設選項值
	 * Set default option values
	 */
	options = defaults(options ?? {} as null, <IOptionsWithType<IOptionsBase>>{
		type: 'independent',
		changelogPreset: void 0,
		tagPrefix: 'v',
	})

	/**
	 * 確保 type 有有效值
	 * Ensure type has valid value
	 */
	if (typeof options.type !== 'string' || !options.type.length)
	{
		options.type = 'independent'
	}

	/**
	 * 確保 tagPrefix 為字串
	 * Ensure tagPrefix is string
	 */
	if (typeof options.tagPrefix !== 'string')
	{
		options.tagPrefix = 'v'
	}

	/**
	 * 處理空的 changelogPreset
	 * Handle empty changelogPreset
	 */
	if (typeof options.changelogPreset !== 'string' || !options.changelogPreset.length || !Boolean(options.changelogPreset))
	{
		options.changelogPreset = void 0;
	}

	/**
	 * 解析預設規範的路徑
	 * Resolve default preset path
	 */
	if (!options.changelogPreset || options.changelogPreset === defaultChangelogPreset)
	{
		options.changelogPreset = requireResolveExtra(defaultChangelogPreset, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				join(__dirname, '../..'),
			],
		}).result ?? options.changelogPreset;
	}

	/**
	 * 若仍未設定，使用 angular 作為後備
	 * Fallback to angular if still not set
	 */
	options.changelogPreset ??= 'conventional-changelog-angular';

	return options
}

/**
 * 嘗試載入指定模組
 * Try to require specified module
 *
 * @param {IChangelogPreset} name - 模組名稱 / Module name
 * @returns {any} 模組導出內容 / Module exports
 */
function tryRequire(name: IChangelogPreset)
{
	try
	{
		return requireResolveCore(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
		})
	}
	catch (err)
	{
		if (err.code !== "MODULE_NOT_FOUND")
		{
			throw new err
		}
	}
}

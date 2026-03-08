/**
 * 測試工具函數
 * Test utility functions
 *
 * @packageDocumentation
 */
import {
	_handleVersionStyleOptions,
	_parseJetbrainsVersion,
	_parseStandardFullVersion,
	IVersionStyleOptions,
	parseVersion,
} from '../../lib/index';
import { Dayjs } from 'dayjs';

/**
 * Lazy parse version - parses a version string using all available parsers
 *
 * @param version - 版本號字串 / Version string
 * @returns 包含所有解析結果的物件 / Object with all parse results
 */
export function _lazyParseVersion(version: string)
{
	return {
		inputVersion: version,
		parseVersion: parseVersion(version),
		parseVersionStandardFull: _parseStandardFullVersion(version),
		parseVersionJetbrains: _parseJetbrainsVersion(version),
	};
}

/**
 * Test helper for _handleVersionStyleOptions
 * 使用快照匹配驗證結果，日期會被轉換為 ISO 字串
 *
 * @param optionsOrDate - 選項或日期 / Options or Date
 * @param propertyMatchers - 額外的屬性匹配器 / Additional property matchers
 * @returns 處理後的結果 / Processed result
 */
export function _expectHandleVersionStyleOptions(optionsOrDate?: IVersionStyleOptions | Date,
	propertyMatchers?: Record<string, any>,
)
{
	const result = _handleVersionStyleOptions(optionsOrDate);

/*	// 驗證基本屬性
	expect(result).toHaveProperty('dailyIncrement');
	expect(result).toHaveProperty('disableDailyVersionSuffix');
	expect(result).toHaveProperty('style');
	expect(result).toHaveProperty('date');
	expect(result).toHaveProperty('currentVersion');

	// 驗證預設值
	expect(result.dailyIncrement).toBe(1);
	expect(result.disableDailyVersionSuffix).toBe(false);
	expect(result.style).toBe('jetbrains-short-md');*/

	expect(result).toMatchSnapshot({
		date: expect.anything(),
		dailyIncrement: 1,
		disableDailyVersionSuffix: false,
		...propertyMatchers,
	});

	return result;
}

/**
 * 測試輔助函數：驗證版本號產生的基本屬性
 *
 * @param version - 產生的版本號 / Generated version
 * @param expectedStyle - 預期的樣式 / Expected style
 */
export function expectVersionProperties(version: string, expectedStyle: string)
{
	expect(version).toMatch(/^\d+\.\d+\.\d+(-?\d+)?$/);
}

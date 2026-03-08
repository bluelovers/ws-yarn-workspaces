/**
 * 測試工具函數
 * Test utility functions
 *
 * @packageDocumentation
 */
import {
	parseVersion,
} from '../../lib/index';
import { IVersionStyleOptions } from '../../lib/types';
import { _handleVersionStyleOptions } from '../../lib/options';
import { _parseJetbrainsVersion, _parseStandardFullVersion } from '../../lib/helpers';

// ==================== 測試常數 / Test Constants ====================

// ==================== 預期結果映射表 / Expected Result Maps ====================

// ==================== 解析測試預期結果 / Parse Test Expected Results ====================

// ==================== 輔助函數 / Helper Functions ====================

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

/**
 * 驗證 isValidDateInfo 的測試資料生成器
 * Test data generator for isValidDateInfo
 *
 * @param isValid - 是否有效 / Whether valid
 * @param overrides - 覆寫預設值 / Override default values
 * @returns 測試用日期資訊 / Test date info
 */
export function createDateInfoTestCase(isValid: boolean, overrides?: Partial<{ year: number; month: number; day: number }>)
{
	const base = { year: 2026, month: 1, day: 1 };
	return { ...base, ...overrides };
}

// 調試用 / For debugging
export function _debug(...args: any[])
{
	console.log(`[${'version-style'.padEnd(20)}]`, args);
}

/**
 * 測試工具函數
 *
 * @packageDocumentation
 */
import assert from 'node:assert/strict';
import type { TestContext } from 'node:test';
import { IVersionStyleOptions } from '../../lib/types';
import { _handleVersionStyleOptions } from '../../lib/options';
import { _parseJetbrainsVersion, _parseStandardFullVersion } from '../../lib/helpers';
import { parseVersion } from '../../index';

/**
 * Lazy parse version - parses a version string using all available parsers
 *
 * @param version - 版本號字串
 * @returns 包含所有解析結果的物件
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
 * 改以 node:test 快照與逐欄斷言驗證（原 Jest toMatchSnapshot + propertyMatchers）
 *
 * @param t - node:test 測試上下文
 * @param optionsOrDate - 選項或日期
 * @param propertyMatchers - 額外的屬性匹配器
 * @returns 處理後的結果
 */
export function _expectHandleVersionStyleOptions(t: TestContext,
	optionsOrDate?: IVersionStyleOptions | Date,
	propertyMatchers?: Record<string, any>,
	opts?: {
		/**
		 * 在使用使用真實時間測試時，忽略日期欄位的快照
		 */
		snapshotIgnoreDate?: boolean;
	}
)
{
	const result = _handleVersionStyleOptions(optionsOrDate);

	/** 原 date: expect.anything()：只要求非空 */
	assert.ok(result.date != null);

	/**
	 * 其餘欄位逐一比對，propertyMatchers 可覆寫預設值
	 */
	const matchers = {
		dailyIncrement: 1,
		disableDailyVersionSuffix: false,
		...propertyMatchers,
	};

	for (const [key, value] of Object.entries(matchers))
	{
		assert.deepStrictEqual((result as any)[key], value);
	}

	const snap = {
		date: result.date,
		dailyIncrement: result.dailyIncrement,
		disableDailyVersionSuffix: result.disableDailyVersionSuffix,
		...propertyMatchers,
	};

	if (opts?.snapshotIgnoreDate)
	{
		delete snap.date;
	}

	/** 快照記錄驗證過的欄位 */
	t.assert.snapshot(snap);

	return result;
}

/**
 * 測試輔助函數：驗證版本號產生的基本屬性
 *
 * @param version - 產生的版本號
 * @param expectedStyle - 預期的樣式
 */
export function expectVersionProperties(version: string, expectedStyle: string)
{
	assert.match(version, /^\d+\.\d+\.\d+(-?\d+)?$/);
}

/**
 * 驗證 isValidDateInfo 的測試資料生成器
 *
 * @param isValid - 是否有效
 * @param overrides - 覆寫預設值
 */
export function createDateInfoTestCase(isValid: boolean, overrides?: Partial<{ year: number; month: number; day: number }>)
{
	const base = { year: 2026, month: 1, day: 1 };
	return { ...base, ...overrides };
}

export function _debug(...args: any[])
{
	console.log(`[${'version-style'.padEnd(20)}]`, args);
}

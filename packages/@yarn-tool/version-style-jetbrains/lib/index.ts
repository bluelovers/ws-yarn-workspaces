/**
 * 基於日期的版本編號生成器核心模組
 * Date-based version style generator core module
 *
 * 支援的版本格式:
 * - 261.1.1-1   => 2026年.一月.一號 - 當日第一版 (年=26+235)
 * - 261.101.1  => 2026年.一月一號.當日第一版 (年=26+235, 月日=101)
 * - 2026.101.1 => 2026年.一月一號.當日第一版 (年=2026, 月日=101)
 * - 2026.1.1-1  => 2026年.一月.一號 - 當日第一版 (年=2026, 月=1, 日=1)
 */

import {
	EnumVersionStyle,
	IDateInput,
	IParseVersionResult,
	IVersionStyleOptions,
	IVersionStyleOptionsWithDateInfo,
} from './types';
import {
	_parseJetbrainsVersion,
	_parseStandardFullVersion,
} from './helpers';
import { _getParsedVersionFromOptions, _getStyleFromFlags, _handleVersionStyleOptions } from './options';
import { _dateToVersionByStyleCore } from './core';
import { _getDateInfoFromDayjs } from './date';
import { _assertValidDateInfo } from './assert';

// ==================== Main Functions ====================

/**
 * 解析版本號
 * Parse version string
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export function parseVersion(version: string): IParseVersionResult | null
{
	// 嘗試解析標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
	let result: IParseVersionResult = _parseStandardFullVersion(version);

	if (!result)
	{
		// 嘗試解析 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
		result = _parseJetbrainsVersion(version);
	}

	if (result)
	{
		_assertValidDateInfo(result);
		return result;
	}

	return null;
}

/**
 * 將日期轉換為版本字串
 * Convert date to version string
 *
 * @param options - 選項 / Options
 * @returns 版本字串 / Version string
 */
export function dateToVersion(options?: IVersionStyleOptions): string
{
	const processed = _handleVersionStyleOptions(options);
	const { year, month, day } = _getDateInfoFromDayjs(processed.date);
	const { dailyIncrement, disableDailyVersionSuffix, style } = processed;

	return _dateToVersionByStyleCore(style, {
		year,
		month,
		day,
		dailyIncrement,
		disableDailyVersionSuffix,
	});
}

/**
 * 根據樣式將日期轉換為版本字串
 * Convert date to version string by style
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options
 * @returns 版本字串 / Version string
 */
export function dateToVersionByStyle(
	style: EnumVersionStyle,
	options: IVersionStyleOptionsWithDateInfo,
): string
{
	const processed = _handleVersionStyleOptions(options);

	return _dateToVersionByStyleCore(style, processed)
}

/**
 * 取得下一天版本號
 * Get next day version
 *
 * @param currentVersion - 目前版本號 / Current version
 * @returns 新版本號 / New version
 */
export function getNextDayVersion(currentVersion: string): string
{
	const parsed = parseVersion(currentVersion);

	if (!parsed)
	{
		return dateToVersion({});
	}

	const { year, month, day, isJetbrainsShort, isMDCombined } = parsed;

	let nextDay = day + 1;
	let nextMonth = month;
	let nextYear = year;

	const daysInMonth = new Date(year, month, 0).getDate();

	if (nextDay > daysInMonth)
	{
		nextDay = 1;
		nextMonth = month + 1;

		if (nextMonth > 12)
		{
			nextMonth = 1;
			nextYear = year + 1;
		}
	}

	const style = _getStyleFromFlags(isJetbrainsShort, isMDCombined);

	return _dateToVersionByStyleCore(style, {
		year: nextYear,
		month: nextMonth,
		day: nextDay,
		dailyIncrement: 1,
	});
}

/**
 * 遞增版本號的當日計數
 * Increment daily version count
 *
 * @param currentVersion - 目前版本號 / Current version
 * @returns 遞增後的版本號 / Incremented version
 */
export function incrementVersion(currentVersion: string): string
{
	const parsed = parseVersion(currentVersion);

	if (!parsed)
	{
		return dateToVersion({});
	}

	const { year, month, day, dailyVersion, isJetbrainsShort, isMDCombined } = parsed;

	const style = _getStyleFromFlags(isJetbrainsShort, isMDCombined);

	return _dateToVersionByStyleCore(style, {
		year,
		month,
		day,
		dailyIncrement: dailyVersion + 1,
	});
}

/**
 * 檢查版本號是否為今天的日期
 * Check if version is today's date
 *
 * @param version - 版本號 / Version
 * @param optionsOrDate - 選項或日期 / Options or Date
 * @returns 是否為今天的版本 / Whether it's today's version
 */
export function isTodayVersion(version: string, optionsOrDate?: IVersionStyleOptions | IDateInput): boolean
{
	const parsed = parseVersion(version);

	if (!parsed)
	{
		return false;
	}

	const compareDate = _handleVersionStyleOptions(optionsOrDate).date;

	return parsed.year === compareDate.year()
		&& parsed.month === compareDate.month() + 1
		&& parsed.day === compareDate.date();
}

/**
 * 從現有版本號取得下個版本
 * Get next version from existing version
 *
 * @param options - 選項 / Options
 * @returns 下一個版本號 / Next version
 */
export function getNextVersion(options?: IVersionStyleOptions): string
{
	const processed = _handleVersionStyleOptions(options);
	const { disableDailyVersionSuffix, style, throwOnError } = processed;

	let parsed: IParseVersionResult;

	try
	{
		processed.throwOnError ??= true;
		parsed = _getParsedVersionFromOptions(processed);
	}
	catch (e)
	{
		if (throwOnError)
		{
			throw e;
		}
		return dateToVersion(processed);
	}

	return _dateToVersionByStyleCore(style, {
		year: parsed.year,
		month: parsed.month,
		day: parsed.day,
		dailyIncrement: parsed.dailyVersion + 1,
		disableDailyVersionSuffix,
	});
}

/**
 * 產生所有格式的版本號
 * Generate version in all formats
 *
 * @param options - 選項 / Options
 * @returns 包含所有格式版本號的物件 / Object with all format versions
 */
export function generateAllStyleVersions(options?: IVersionStyleOptions): Record<EnumVersionStyle, string>
{
	const processed = _handleVersionStyleOptions(options);
	const { year, month, day } = _getDateInfoFromDayjs(processed.date);
	const { dailyIncrement, disableDailyVersionSuffix } = processed;

	return {
		[EnumVersionStyle.JetbrainsShort]: _dateToVersionByStyleCore(EnumVersionStyle.JetbrainsShort, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
		}),
		[EnumVersionStyle.JetbrainsShortMD]: _dateToVersionByStyleCore(EnumVersionStyle.JetbrainsShortMD, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
		}),
		[EnumVersionStyle.StandardFull]: _dateToVersionByStyleCore(EnumVersionStyle.StandardFull, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
		}),
		[EnumVersionStyle.StandardFullMD]: _dateToVersionByStyleCore(EnumVersionStyle.StandardFullMD, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
		}),
	};
}


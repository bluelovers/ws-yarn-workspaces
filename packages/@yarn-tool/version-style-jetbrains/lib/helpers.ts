/**
 * 版本樣式輔助函數
 * Version style helper functions
 *
 * 內部使用的輔助函數
 * Internal helper functions
 */

import { IParseVersionResult } from './types';
import { _assertValidDateInfo } from './assert';
import { _parseJetbrainsYearQuarter, _parseMonthDayInfo } from './date';

/**
 * 解析標準完整年份格式版本號
 * Parse standard full year format version
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export function _parseStandardFullVersion(version: string): IParseVersionResult<false> | null
{
	const standardFullMatch = version.match(/^(\d{4})\.(\d+)\.(\d+)(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層改嘗試其他格式 / Return null on mismatch so the caller can try another format */
	if (!standardFullMatch)
	{
		return null;
	}

	const [, yearStr, monthOrMD, dayOrIncrement, increment] = standardFullMatch;
	const year = parseInt(yearStr, 10);

	/** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 / The month/day part may be separate or a combined number; delegate to the shared helper */
	const { month, day, dailyVersion, isMDCombined } = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);

	return {
		year,
		month,
		day,
		dailyVersion,
		isJetbrainsShort: false,
		isMDCombined,
	};
}

/**
 * 解析 JetBrains 短年份格式版本號
 * Parse JetBrains short year format version
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export function _parseJetbrainsVersion(version: string): IParseVersionResult<true> | null
{
	const jetbrainsMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層決定是否改用其他格式 / Return null on mismatch so the caller can decide on another format */
	if (!jetbrainsMatch)
	{
		return null;
	}

	const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;

	/** 首段為「年份後兩位 + 季度」的壓縮編碼，需還原成完整年份 / The first segment encodes two-digit year + quarter and must be expanded back to a full year */
	const { year } = _parseJetbrainsYearQuarter(yearQuarterStr);

	/** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 / The month/day part may be separate or a combined number; delegate to the shared helper */
	const { month, day, dailyVersion, isMDCombined } = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);

	return {
		year,
		month,
		day,
		dailyVersion,
		isJetbrainsShort: true,
		isMDCombined,
	};
}

/**
 * 解析版本號（內部函數）
 * Parse version string (internal function)
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export function _parseVersion(version: string): IParseVersionResult | null
{
	/**
	 * 先嘗試解析標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
	 *
	 * Try the standard format first: YYYY.M.D-increment or YYYY.MD.increment
	 */
	let result: IParseVersionResult = _parseStandardFullVersion(version);

	/**
	 * 標準格式失敗才退回 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
	 *
	 * Only fall back to the JetBrains short-year format when the standard one fails
	 */
	if (!result)
	{
		result = _parseJetbrainsVersion(version);
	}

	/**
	 * 解析成功仍需驗證日期合法性（如月份 1-12），
	 * 不合法會在此拋出 RangeError 而非回傳錯誤結果
	 *
	 * Even a successful parse needs date validation (e.g. month 1-12);
	 * invalid data throws RangeError here instead of returning a bad result
	 */
	if (result)
	{
		_assertValidDateInfo(result);
		return result;
	}

	/**
	 * 兩種格式皆不符：回傳 null 交由呼叫端決定容錯策略
	 *
	 * Neither format matched: return null and let the caller choose the fallback policy
	 */
	return null;
}


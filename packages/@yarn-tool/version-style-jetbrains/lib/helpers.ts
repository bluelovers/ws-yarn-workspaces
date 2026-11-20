import { IParseVersionResult } from './types';
import { _assertValidDateInfo } from './assert';
import { _parseJetbrainsYearQuarter, _parseMonthDayInfo } from './date';

/**
 * 解析標準完整年份格式版本號
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
export function _parseStandardFullVersion(version: string): IParseVersionResult<false> | null
{
	const standardFullMatch = version.match(/^(\d{4})\.(\d+)\.(\d+)(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層改嘗試其他格式 */
	if (!standardFullMatch)
	{
		return null;
	}

	const [, yearStr, monthOrMD, dayOrIncrement, increment] = standardFullMatch;
	const year = parseInt(yearStr, 10);

	/** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 */
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
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
export function _parseJetbrainsVersion(version: string): IParseVersionResult<true> | null
{
	const jetbrainsMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層決定是否改用其他格式 */
	if (!jetbrainsMatch)
	{
		return null;
	}

	const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;

	/** 首段為「年份後兩位 + 季度」的壓縮編碼，需還原成完整年份 */
	const { year } = _parseJetbrainsYearQuarter(yearQuarterStr);

	/** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 */
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
 * 解析版本號
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
export function _parseVersion(version: string): IParseVersionResult | null
{
	/**
	 * 先嘗試解析標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
	 */
	let result: IParseVersionResult = _parseStandardFullVersion(version);

	/**
	 * 標準格式失敗才退回 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
	 */
	if (!result)
	{
		result = _parseJetbrainsVersion(version);
	}

	/**
	 * 解析成功仍需驗證日期合法性（如月份 1-12），
	 * 不合法會在此拋出 RangeError 而非回傳錯誤結果
	 */
	if (result)
	{
		_assertValidDateInfo(result);
		return result;
	}

	/**
	 * 兩種格式皆不符：回傳 null 交由呼叫端決定容錯策略
	 */
	return null;
}


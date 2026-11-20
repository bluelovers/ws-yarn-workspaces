import { IParseVersionResult } from './types';
import { _assertValidDateInfo, isValidQuarter } from './assert';
import {
	Y2K_DATETIME_YEAR_CODE_MAX,
	Y2K_DATETIME_YEAR_CODE_MIN,
	_parseY2KDateTimeYear,
	_parseJetbrainsYearQuarter,
	_parseMonthDayFromMD,
	_parseMonthDayInfo,
	_parseTimeFromHHmm,
} from './date';
import { ITSNumberValue2 } from 'ts-type';

/**
 * 解析 JetBrains 日期時間樣式版本號
 *
 * 格式: YYQ.MMDD.HHmm 或 YYQ.MMDD.HHmm-increment
 * 例如: 264.1120.1744-1 表示 2026年Q4 11 月 20 日 17:44 第一版
 *
 * 首段末位須為合法季度 (1-4) 才屬於此樣式；
 * 與 y2k 樣式 (2YY) 同時符合時以此樣式優先
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
export function _parseJetbrainsDateTime(version: string): IParseVersionResult<true, true> | null
{
	const dateTimeMatch = version.match(/^(\d{3})\.(\d{4})\.(\d{4})(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層改嘗試其他格式 */
	if (!dateTimeMatch)
	{
		return null;
	}

	const [, yearQuarterStr, monthDayStr, timeStr, increment] = dateTimeMatch;

	/** 首段為「年份後兩位 + 季度」的壓縮編碼，需還原成完整年份與季度 */
	const { year, quarter } = _parseJetbrainsYearQuarter(yearQuarterStr);

	/** 末位非季度 (1-4) 即非 YYQ 編碼，交由 y2k 樣式 (2YY) 嘗試 */
	if (!isValidQuarter(quarter))
	{
		return null;
	}

	/**
	 * 第三段非合法時分時不認定為日期時間樣式，
	 * 讓 YYQ.MD.遞增 與 YYQ.MMDD.HHmm 的重疊格式交給既有樣式解析
	 */
	const time = _parseTimeFromHHmm(timeStr);

	if (!time)
	{
		return null;
	}

	/** 第二段固定為四位月日 (MMDD)，如 1120 表示 11 月 20 日 */
	const { month, day } = _parseMonthDayFromMD(monthDayStr as ITSNumberValue2);

	return {
		year,
		month,
		day,
		dailyVersion: increment ? parseInt(increment, 10) : 1,
		hour: time.hour,
		minute: time.minute,
		isJetbrainsShort: true,
		isMDCombined: true,
		isDateTime: true,
	};
}

/**
 * 解析 y2k 日期時間樣式版本號
 *
 * 格式: 2YY.MMDD.HHmm 或 2YY.MMDD.HHmm-increment
 * 例如: 226.1120.1744-1 表示 2026 年 11 月 20 日 17:44 第一版
 * 首段 226 取自年份 2026 的第一個 2 與年份後兩位，2100 起不支援
 *
 * 與 JetBrains 樣式 (YYQ) 同時符合時由 JetBrains 樣式優先，此樣式只接手末位非季度的編碼
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
export function _parseY2KDateTime(version: string): IParseVersionResult<true, true> | null
{
	const dateTimeMatch = version.match(/^(\d{3})\.(\d{4})\.(\d{4})(?:-(\d+))?$/);

	/** 格式不符即回傳 null，交由上層改嘗試其他格式 */
	if (!dateTimeMatch)
	{
		return null;
	}

	const [, yearCodeStr, monthDayStr, timeStr, increment] = dateTimeMatch;
	const yearCode = parseInt(yearCodeStr, 10);

	/** 年份編碼須落在支援年份範圍推導出的區間內，其餘數值不屬於日期時間樣式 */
	if (yearCode < Y2K_DATETIME_YEAR_CODE_MIN || yearCode > Y2K_DATETIME_YEAR_CODE_MAX)
	{
		return null;
	}

	/**
	 * 第三段非合法時分時不認定為日期時間樣式，
	 * 讓 YYQ.MD.遞增 與 2YY.MMDD.HHmm 的重疊格式交給既有樣式解析
	 */
	const time = _parseTimeFromHHmm(timeStr);

	if (!time)
	{
		return null;
	}

	/** 第二段固定為四位月日 (MMDD)，如 1120 表示 11 月 20 日 */
	const { month, day } = _parseMonthDayFromMD(monthDayStr as ITSNumberValue2);

	return {
		year: _parseY2KDateTimeYear(yearCode),
		month,
		day,
		dailyVersion: increment ? parseInt(increment, 10) : 1,
		hour: time.hour,
		minute: time.minute,
		isJetbrainsShort: true,
		isMDCombined: true,
		isDateTime: true,
		isY2KDateTime: true,
	};
}

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
	 * 先嘗試 JetBrains 日期時間樣式: YYQ.MMDD.HHmm-increment
	 * 與 y2k 樣式同時符合時以此優先
	 */
	let result: IParseVersionResult = _parseJetbrainsDateTime(version);

	/**
	 * 其次嘗試 y2k 日期時間樣式: 2YY.MMDD.HHmm-increment
	 */
	if (!result)
	{
		result = _parseY2KDateTime(version);
	}

	/**
	 * 再嘗試標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
	 */
	if (!result)
	{
		result = _parseStandardFullVersion(version);
	}

	/**
	 * 皆失敗才退回 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
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
	 * 所有格式皆不符：回傳 null 交由呼叫端決定容錯策略
	 */
	return null;
}


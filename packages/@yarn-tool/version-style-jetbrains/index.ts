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
} from './lib/types';
import { _getParsedVersionFromOptions, _getStyleFromFlags, _handleVersionStyleOptions } from './lib/options';
import { _dateToVersionByStyleCore } from './lib/core';
import { _getDateInfoFromDayjs } from './lib/date';
import { _parseJetbrainsVersion, _parseStandardFullVersion } from './lib/helpers';
import { _assertValidDateInfo } from './lib/assert';

export * from './lib/types';

export { _handleVersionStyleOptions } from './lib/options';

/**
 * 解析版本號
 * Parse version string
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export function parseVersion(version: string): IParseVersionResult | null
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
	 * Only fall back to the JetBrains short-year format when the standard one fails:
	 * YY+OFFSET.M.D-increment or YY+OFFSET.MD.increment
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

	/**
	 * 解析失敗時退回「今天的版本」而非拋錯：
	 * 調用方通常只有版本字串可用，讓流程能繼續比中斷更有用
	 *
	 * Fall back to "today's version" instead of throwing when parsing fails:
	 * callers usually only have the version string, so continuing beats aborting
	 */
	if (!parsed)
	{
		return dateToVersion({});
	}

	const { year, month, day, isJetbrainsShort, isMDCombined } = parsed;

	let nextDay = day + 1;
	let nextMonth = month;
	let nextYear = year;

	/**
	 * new Date(year, month, 0) 的 day 為 0 表示「上個月的最後一天」，
	 * 以該值作為當月天數可正確處理閏年二月
	 *
	 * new Date(year, month, 0) with day 0 means "last day of previous month",
	 * which yields the correct length of the current month including leap February
	 */
	const daysInMonth = new Date(year, month, 0).getDate();

	/**
	 * 日期進位需手動處理：先判斷是否超過當月天數，再逐層進位到月、年，
	 * 避免產生例如 1 月 32 日的無效版本號
	 *
	 * Date rollover is handled manually: check day overflow first, then roll
	 * month and year in turn to avoid invalid versions such as Jan 32
	 */
	if (nextDay > daysInMonth)
	{
		nextDay = 1;
		nextMonth = month + 1;

		/**
		 * 巢狀進位：12 月之後回到 1 月並把年份 +1
		 *
		 * Nested rollover: after December return to January and increment the year
		 */
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

	/**
	 * 與 getNextDayVersion 一致的容錯策略：無法解析時改以當天日期產生新版本
	 *
	 * Same tolerance strategy as getNextDayVersion: fall back to a fresh
	 * version generated from today's date when parsing fails
	 */
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

	/**
	 * 無法解析的版本號一律視為「不是今天」，
	 * 比拋錯更適合此類布林判斷 API
	 *
	 * An unparseable version is always treated as "not today";
	 * this suits a boolean-check API better than throwing
	 */
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

	/**
	 * try/catch 而非預先驗證：解析可能同時拋出多種錯誤（RangeError 等），
	 * 統一在此攔截可避免呼叫端需要理解所有內部例外型別
	 *
	 * try/catch instead of pre-validation: parsing may throw several error types
	 * (RangeError etc.); intercepting centrally keeps callers from handling them
	 */
	try
	{
		/**
		 * 解析階段一律允許拋錯，是否對外傳遞交給 catch 依 throwOnError 決定
		 *
		 * Always allow throwing during parsing; whether it propagates is decided
		 * by throwOnError in the catch below
		 */
		processed.throwOnError ??= true;
		parsed = _getParsedVersionFromOptions(processed);
	}
	catch (e)
	{
		/**
		 * 呼叫端若未要求拋錯（預設），解析失敗時退回以當日日期產生版本，
		 * 讓遞增流程不會因輸入的舊版本號損壞而中斷
		 *
		 * When the caller did not opt in to throwing (default), fall back to a
		 * version built from today's date so incrementing never aborts on a
		 * corrupted legacy version string
		 */
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

	/**
	 * 四種樣式共用同一組年月日與遞增號，僅格式不同；
	 * 逐一展開比動態迭代列舉更明確，新增樣式時可在此編譯期被發現
	 *
	 * All four styles share the same date and increment, differing only in format;
	 * explicit entries (vs. dynamic enum iteration) surface new styles at compile time
	 */
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

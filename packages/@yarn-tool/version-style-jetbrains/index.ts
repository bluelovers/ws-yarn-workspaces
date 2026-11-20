/**
 * 基於日期的版本編號生成器核心模組
 *
 * 支援的版本格式:
 * - 261.1.1-1   => 2026年.一月.一號 - 當日第一版 (年=26+235)
 * - 261.101.1  => 2026年.一月一號.當日第一版 (年=26+235, 月日=101)
 * - 2026.101.1 => 2026年.一月一號.當日第一版 (年=2026, 月日=101)
 * - 2026.1.1-1  => 2026年.一月.一號 - 當日第一版 (年=2026, 月=1, 日=1)
 * - 226.1120.1744-1 => 2026年.11月20號.17:44 - 當日第一版 (年=2026 首個 2 + 26, 月日=1120, 時分=1744, 2100 起不支援)
 * - 226.1120.1744   => 同上但停用遞增後綴 (disableDailyVersionSuffix)
 * - 264.1120.1744-1 => 2026年Q4.11月20號.17:44 - 當日第一版 (年=26+季度, 月日=1120, 時分=1744)
 *
 * 時間樣式解析優先序: 與 y2k 格式同時符合時，JetBrains (YYQ) 格式優先
 */
import {
	EnumVersionStyle,
	IDateInput,
	IParseVersionResult,
	IVersionStyleOptions,
	IVersionStyleOptionsWithDateInfo,
} from './lib/types';
import { ISeqVersionAny } from './lib/types-seg';
import { _getParsedVersionFromOptions, _handleVersionStyleOptions } from './lib/options';
import { _dateToVersionByStyleCore } from './lib/core';
import { _getDateInfoFromDayjs } from './lib/date';
import { _assertValidDateInfo } from './lib/assert';
import { _getStyleFromFlags, analyzeVersionStyles, IVersionStyleAnalysisOptions, selectVersionStyles } from './lib/analyze';

export * from './lib/types';
export * from './lib/types-seg';

export { _handleVersionStyleOptions } from './lib/options';
export { analyzeVersionStyles, selectVersionStyles } from './lib/analyze';
export type { IVersionStyleAnalysis, IVersionStyleAnalysisOptions } from './lib/analyze';

/**
 * 解析版本號
 *
 * 以 `analyzeVersionStyles` 的結果經 `selectVersionStyles` 整理後的優先風格為準；
 * 優先序同時符合時的規則由分析核心決定，`prefer` / `exclude` 只重整其結果
 *
 * @param version - 版本號字串
 * @param options - 分析選項（優先選用 / 排除特定風格）
 * @returns 解析結果
 */
export function parseVersion(
	version: ISeqVersionAny,
	options?: IVersionStyleAnalysisOptions,
): IParseVersionResult | null
{
	const { priorityResult } = selectVersionStyles(analyzeVersionStyles(version), options);

	/**
	 * 解析成功仍需驗證日期合法性（如月份 1-12），
	 * 不合法會在此拋出 RangeError 而非回傳錯誤結果
	 */
	if (priorityResult)
	{
		_assertValidDateInfo(priorityResult);
		return priorityResult;
	}

	/**
	 * 所有格式皆不符：回傳 null 交由呼叫端決定容錯策略
	 */
	return null;
}

/**
 * 將日期轉換為版本字串
 *
 * @param options - 選項
 * @returns 版本字串
 */
export function dateToVersion(options?: IVersionStyleOptions): string
{
	const processed = _handleVersionStyleOptions(options);
	const { year, month, day } = _getDateInfoFromDayjs(processed.date);
	const { dailyIncrement, disableDailyVersionSuffix, style, hour, minute } = processed;

	return _dateToVersionByStyleCore(style, {
		year,
		month,
		day,
		dailyIncrement,
		disableDailyVersionSuffix,
		hour,
		minute,
	});
}

/**
 * 根據樣式將日期轉換為版本字串
 *
 * @param style - 版本樣式
 * @param options - 選項
 * @returns 版本字串
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
 *
 * @param currentVersion - 目前版本號
 * @returns 新版本號
 */
export function getNextDayVersion(currentVersion: ISeqVersionAny): string
{
	const parsed = parseVersion(currentVersion);

	/**
	 * 解析失敗時退回「今天的版本」而非拋錯：
	 * 調用方通常只有版本字串可用，讓流程能繼續比中斷更有用
	 */
	if (!parsed)
	{
		return dateToVersion({});
	}

	const { year, month, day, hour, minute } = parsed;

	let nextDay = day + 1;
	let nextMonth = month;
	let nextYear = year;

	/**
	 * new Date(year, month, 0) 的 day 為 0 表示「上個月的最後一天」，
	 * 以該值作為當月天數可正確處理閏年二月
	 */
	const daysInMonth = new Date(year, month, 0).getDate();

	/**
	 * 日期進位需手動處理：先判斷是否超過當月天數，再逐層進位到月、年，
	 * 避免產生例如 1 月 32 日的無效版本號
	 */
	if (nextDay > daysInMonth)
	{
		nextDay = 1;
		nextMonth = month + 1;

		/**
		 * 巢狀進位：12 月之後回到 1 月並把年份 +1
		 */
		if (nextMonth > 12)
		{
			nextMonth = 1;
			nextYear = year + 1;
		}
	}

	const style = _getStyleFromFlags(parsed);

	return _dateToVersionByStyleCore(style, {
		year: nextYear,
		month: nextMonth,
		day: nextDay,
		dailyIncrement: 1,
		hour,
		minute,
	});
}

/**
 * 遞增版本號的當日計數
 *
 * @param currentVersion - 目前版本號
 * @returns 遞增後的版本號
 */
export function incrementVersion(currentVersion: ISeqVersionAny): string
{
	const parsed = parseVersion(currentVersion);

	/**
	 * 與 getNextDayVersion 一致的容錯策略：無法解析時改以當天日期產生新版本
	 */
	if (!parsed)
	{
		return dateToVersion({});
	}

	const { year, month, day, dailyVersion, hour, minute } = parsed;

	const style = _getStyleFromFlags(parsed);

	return _dateToVersionByStyleCore(style, {
		year,
		month,
		day,
		dailyIncrement: dailyVersion + 1,
		hour,
		minute,
	});
}

/**
 * 檢查版本號是否為今天的日期
 *
 * @param version - 版本號
 * @param optionsOrDate - 選項或日期
 * @returns 是否為今天的版本
 */
export function isTodayVersion(version: ISeqVersionAny, optionsOrDate?: IVersionStyleOptions | IDateInput): boolean
{
	const parsed = parseVersion(version);

	/**
	 * 無法解析的版本號一律視為「不是今天」，
	 * 比拋錯更適合此類布林判斷 API
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
 *
 * @param options - 選項
 * @returns 下一個版本號
 */
export function getNextVersion(options?: IVersionStyleOptions): string
{
	const processed = _handleVersionStyleOptions(options);
	const { disableDailyVersionSuffix, style, throwOnError } = processed;

	let parsed: IParseVersionResult;

	/**
	 * try/catch 而非預先驗證：解析可能同時拋出多種錯誤（RangeError 等），
	 * 統一在此攔截可避免呼叫端需要理解所有內部例外型別
	 */
	try
	{
		/**
		 * 解析階段一律允許拋錯，是否對外傳遞交給 catch 依 throwOnError 決定
		 */
		processed.throwOnError ??= true;
		parsed = _getParsedVersionFromOptions(processed);
	}
	catch (e)
	{
		/**
		 * 呼叫端若未要求拋錯（預設），解析失敗時退回以當日日期產生版本，
		 * 讓遞增流程不會因輸入的舊版本號損壞而中斷
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
		/**
		 * 日期時間樣式需時分：既有版本號帶有時分時沿用，
		 * 否則退回 options（已預設為 date 的時分）
		 */
		hour: parsed.hour ?? processed.hour,
		minute: parsed.minute ?? processed.minute,
	});
}

/**
 * 產生所有格式的版本號
 *
 * @param options - 選項
 * @returns 包含所有格式版本號的物件
 */
export function generateAllStyleVersions(options?: IVersionStyleOptions): Record<EnumVersionStyle, string>
{
	const processed = _handleVersionStyleOptions(options);
	const { year, month, day } = _getDateInfoFromDayjs(processed.date);
	const { dailyIncrement, disableDailyVersionSuffix, hour, minute } = processed;

	/**
	 * 各樣式共用同一組年月日與遞增號，僅格式不同；
	 * 逐一展開比動態迭代列舉更明確，新增樣式時可在此編譯期被發現
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
		[EnumVersionStyle.Y2KDateTime]: _dateToVersionByStyleCore(EnumVersionStyle.Y2KDateTime, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
			hour,
			minute,
		}),
		[EnumVersionStyle.JetbrainsDateTime]: _dateToVersionByStyleCore(EnumVersionStyle.JetbrainsDateTime, {
			year,
			month,
			day,
			dailyIncrement,
			disableDailyVersionSuffix,
			hour,
			minute,
		}),
	};
}

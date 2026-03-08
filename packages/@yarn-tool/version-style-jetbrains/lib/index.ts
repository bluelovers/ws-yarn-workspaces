import { ITSOverwrite, ITSPickExtra, ITSRequiredPick, ITSRequiredWith } from 'ts-type/lib/type/record';
import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { IOptionsTzDayjsSafeParse, tzDayjsSafeParse } from 'dayjs-tz-helper';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

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

/**
 * 從月份取得季度
 * Get quarter from month
 *
 * @param month - 月份 (1-12) / Month (1-12)
 * @returns 季度 (1-4) / Quarter (1-4)
 */
export function getQuarterFromMonth(month: number): number
{
	return Math.ceil(month / 3);
}

/**
 * 根據年份和季度取得 JetBrains 風格的年份編碼
 * Get JetBrains style year code from year and quarter
 *
 * @param year - 年份 / Year
 * @param quarter - 季度 (1-4) / Quarter (1-4)
 * @returns 年份編碼 (如 261 表示 2026年Q1) / Year code (e.g., 261 for 2026 Q1)
 */
export function getJetbrainsYearCode(year: number, quarter: number): number
{
	return (year % 100) * 10 + quarter;
}

/**
 * 版本風格類型
 * Version style types
 */
export enum EnumVersionStyle
{
	/**
	 * JetBrains 短年份樣式
	 * JetBrains short year style
	 *
	 * @example 261.1.1-1
	 */
	JetbrainsShort = 'jetbrains-short',
	/**
	 * 標準完整年份樣式
	 * Standard full year style
	 *
	 * @example 2026.1.1-1
	 */
	StandardFull = 'standard-full',
	/**
	 * JetBrains 短年份 + 月日合併樣式
	 * JetBrains short year with combined month-day
	 *
	 * @example 261.101.1
	 */
	JetbrainsShortMD = 'jetbrains-short-md',
	/**
	 * 標準完整年份 + 月日合併樣式
	 * Standard full year with combined month-day
	 *
	 * @example 2026.101.1
	 */
	StandardFullMD = 'standard-full-md',
}

export type IDateInput = Dayjs | Date | number | string | IDateInfo;

/**
 * 版本樣式配置選項
 * Version style configuration options
 */
export interface IVersionStyleOptions
{
	/** 指定日期 (預設為現在) / Specified date (default is now) */
	date?: IDateInput;
	/** 當日版本號遞增 / Daily version increment */
	dailyIncrement?: number;
	/** 是否禁用結尾的 -x dailyVersion (僅對 JetbrainsShort 和 StandardFull 有效) / Whether to disable trailing -x dailyVersion (only effective for JetbrainsShort and StandardFull) */
	disableDailyVersionSuffix?: boolean;
	/** 版本樣式 / Version style (default is JetbrainsShortMD) */
	style?: EnumVersionStyle;
	/** 是否在解析失敗時拋出錯誤 / Whether to throw error when parsing fails */
	throwOnError?: boolean;
	/** 現有版本號 (用於遞增) / Current version (for incrementing) */
	currentVersion?: string;

	dateOptions?: IOptionsTzDayjsSafeParse;
}

export interface IVersionStyleOptionsWithDateInfo extends IVersionStyleOptions, IDateInfo
{

}

export type IOptionsRuntime<T extends Pick<IVersionStyleOptions, 'date'>> = ITSOverwrite<T, {
	date: Dayjs
}>;

export type IRequiredOptionsRuntime<T extends IVersionStyleOptions = IVersionStyleOptions> = Required<IOptionsRuntime<T>>

/**
 * 請注意月份為 Human-readable Month Number
 * 不是 Zero-based Month Number
 */
export interface IDateInfo
{
	/** 年份 / Year */
	year: number;
	/**
	 * 月份 / Human-readable Month Number
	 *
	 * Accepts numbers from 1 to 12
	 */
	month: number;
	/** 日期 / Day */
	day: number;
}

/**
 * 解析現有版本號的回傳結果
 * Result of parsing existing version
 */
export interface IParseVersionResult<T extends boolean = boolean> extends IDateInfo
{
	/** 當日版本號 / Daily version */
	dailyVersion: number;
	/** 是否為 JetBrains 短年份樣式 / Whether it uses JetBrains short year style */
	isJetbrainsShort: T;
	/** 是否使用月日合併格式 / Whether using month-day combined format */
	isMDCombined: boolean;
}

export function getDayjsFromInput(date: IDateInput, opts?: IOptionsTzDayjsSafeParse)
{
	if (typeof date === 'object')
	{
		if (isDayjs(date))
		{
			return tzDayjsSafeParse(date, opts)
		}
		else if (date instanceof Date)
		{
			return tzDayjsSafeParse(date, opts);
		}
		else if (isValidDateInfo(date))
		{
			return tzDayjsSafeParse(`${date.year}-${date.month}-${date.day}`, opts);
		}
	}
	else if (typeof date === 'string' || typeof date === 'number')
	{
		return tzDayjsSafeParse(date, opts);
	}

	return null
}

export function _handleVersionStyleOptionsCore<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput)
{
	// 取得日期
	let date: IDateInput;
	let options: IOptionsRuntime<T> = {} as any;

	if (!optionsOrDate)
	{
		//
	}
	else if (typeof optionsOrDate === 'number' || typeof optionsOrDate === 'string')
	{
		date = optionsOrDate
	}
	else if (optionsOrDate instanceof Date)
	{
		// 已經是 Date 物件
		date = optionsOrDate;
	}
	else if ('date' in optionsOrDate)
	{
		date = optionsOrDate.date as any;
		options = optionsOrDate as any;
	}
	else if (typeof optionsOrDate === 'object')
	{
		options = optionsOrDate as any
	}

	options = {
		...options,
		date: getDayjsFromInput(date ?? new Date(), options.dateOptions),
	};

	return options
}

/**
 * 處理版本樣式選項
 * Handle version style options
 *
 * 將可選的選項轉換為完整的物件，設定預設值
 * 支援接受 Date 或 IVersionStyleOptions
 *
 * @param optionsOrDate - 原始選項或 Date / Original options or Date
 * @returns 處理後的選項 / Processed options
 */
export function _handleVersionStyleOptions<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput): IRequiredOptionsRuntime<T>
{
	const options = _handleVersionStyleOptionsCore<T>(optionsOrDate);

	return {
		...options,
		dailyIncrement: options.dailyIncrement ?? 1,
		disableDailyVersionSuffix: options.disableDailyVersionSuffix ?? false,
		style: options.style ?? EnumVersionStyle.JetbrainsShortMD,
		// throwOnError: options.throwOnError ?? false,
		// currentVersion: options.currentVersion,
	} satisfies IOptionsRuntime<T> as any;
}

/**
 * 驗證日期資訊是否完整
 * Validate date info completeness
 *
 * @param dateInfo - 日期資訊 / Date info
 * @returns 是否有效 / Whether valid
 */
export function isValidDateInfo(dateInfo: Partial<IDateInfo>): dateInfo is IDateInfo
{
	return (
		typeof dateInfo.year === 'number' &&
		typeof dateInfo.month === 'number' &&
		typeof dateInfo.day === 'number' &&
		dateInfo.year > 0 &&
		dateInfo.month >= 1 &&
		dateInfo.month <= 12 &&
		dateInfo.day >= 1 &&
		dateInfo.day <= 31
	);
}

export function assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo
{
	if (!isValidDateInfo(dateInfo)) throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}

/**
 * @deprecated
 */
export function _getDateInfoFromDate(date: Date): IDateInfo
{
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}

export function _getDateInfoFromDayjs(date: Dayjs): IDateInfo
{
	return {
		year: date.year(),
		month: date.month() + 1,
		day: date.date(),
	};
}

/**
 * 從選項取得日期資訊
 * Get date info from options
 *
 * @param options - 選項 / Options
 * @returns 日期資訊 / Date info
 *
 * @deprecated 當 options 確定經過 _handleVersionStyleOptionsCore 或 _handleVersionStyleOptions 處理過時可以直接使用 _getDateInfoFromDayjs
 */
export function _getDateInfoFromOptions(options: IVersionStyleOptions | IDateInput)
{
	let date = _handleVersionStyleOptionsCore((options as IVersionStyleOptions)?.date ?? options).date
	return _getDateInfoFromDayjs(date);
}

/**
 * 從選項取得解析後的版本資訊
 * Get parsed version info from options
 *
 * 優先使用 currentVersion，否則從日期產生版本
 *
 * @param processed - 處理後的選項 / Processed options
 * @returns 解析後的版本資訊 / Parsed version info
 */
export function _getParsedVersionFromOptions(processed: IRequiredOptionsRuntime): IParseVersionResult
{
	// 優先使用 currentVersion
	if (processed.currentVersion)
	{
		const parsed = parseVersion(processed.currentVersion);

		if (parsed)
		{
			return parsed;
		}

		if (processed.throwOnError)
		{
			throw new RangeError(`Failed to parse currentVersion: ${processed.currentVersion}`);
		}
	}

	// 從 processed 取得日期資訊
	const { date, style } = processed;
	const dateInfo = _getDateInfoFromDayjs(date);

	// 產生版本字串後立即解析 - 直接調用核心函數
	const versionString = _dateToVersionByStyleCore(style, {
		...dateInfo,
		dailyIncrement: processed.dailyIncrement,
		disableDailyVersionSuffix: processed.disableDailyVersionSuffix,
	});

	const parsed = parseVersion(versionString);

	if (!parsed)
	{
		throw new Error(`Failed to parse version: ${versionString}`);
	}

	return parsed;
}

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

	if (!standardFullMatch)
	{
		return null;
	}

	const [, yearStr, monthOrMD, dayOrIncrement, increment] = standardFullMatch;
	const year = parseInt(yearStr, 10);

	// 判斷是否為月日合併格式 (MD > 12)
	const monthDay = parseInt(monthOrMD, 10);
	const isMDCombined = monthDay > 12;

	if (isMDCombined)
	{
		// 格式: YYYY.MD.increment
		const month = Math.floor(monthDay / 100);
		const day = monthDay % 100;
		const dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);

		return {
			year,
			month,
			day,
			dailyVersion,
			isJetbrainsShort: false,
			isMDCombined: true,
		};
	}
	else
	{
		// 格式: YYYY.M.D-increment
		const month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
		const day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
		const dailyVersion = increment ? parseInt(increment, 10) : 1;

		return {
			year,
			month,
			day,
			dailyVersion,
			isJetbrainsShort: false,
			isMDCombined: false,
		};
	}
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

	if (!jetbrainsMatch)
	{
		return null;
	}

	const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;
	const yearQuarter = parseInt(yearQuarterStr, 10);

	// 還原完整年份和季度
	// yearQuarter = (year % 100) * 10 + quarter
	// 所以: quarter = yearQuarter % 10, year = 2000 + floor(yearQuarter / 10)
	const quarter = yearQuarter % 10;
	const year = 2000 + Math.floor(yearQuarter / 10);

	// 判斷是否為月日合併格式
	const monthDay = parseInt(monthOrMD, 10);
	const isMDCombined = monthDay > 12;

	if (isMDCombined)
	{
		// 格式: YYQ.MD.increment
		const month = Math.floor(monthDay / 100);
		const day = monthDay % 100;
		const dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);

		return {
			year,
			month,
			day,
			dailyVersion,
			isJetbrainsShort: true,
			isMDCombined: true,
		};
	}
	else
	{
		// 格式: YYQ.M.D-increment
		const month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
		const day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
		const dailyVersion = increment ? parseInt(increment, 10) : 1;

		return {
			year,
			month,
			day,
			dailyVersion,
			isJetbrainsShort: true,
			isMDCombined: false,
		};
	}
}

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
		assertValidDateInfo(result);
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

	// 直接調用核心函數
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

export function _dateToVersionByStyleCore(
	style: EnumVersionStyle,
	options: ITSPickExtra<IVersionStyleOptionsWithDateInfo, 'year' | 'month' | 'day' | 'dailyIncrement', 'disableDailyVersionSuffix'>,
): string
{
	const { year, month, day, dailyIncrement, disableDailyVersionSuffix } = options;
	const quarter = getQuarterFromMonth(month);

	switch (style)
	{
		case EnumVersionStyle.JetbrainsShort:
			// 261.1.1-1 => (year%100)*10+quarter . month . day - increment
			if (disableDailyVersionSuffix)
			{
				return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}`;
			}
			return `${getJetbrainsYearCode(year, quarter)}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.JetbrainsShortMD:
			// 261.101.1 => (year%100)*10+quarter . month*100+day . increment
			// MD 格式沒有 -x 後綴，所以忽略 disableSuffix
			return `${getJetbrainsYearCode(year, quarter)}.${month * 100 + day}.${dailyIncrement}`;

		case EnumVersionStyle.StandardFull:
			// 2026.1.1-1 => year.month.day-increment
			if (disableDailyVersionSuffix)
			{
				return `${year}.${month}.${day}`;
			}
			return `${year}.${month}.${day}-${dailyIncrement}`;

		case EnumVersionStyle.StandardFullMD:
			// 2026.101.1 => year.month*100+day.increment
			// MD 格式沒有 -x 後綴，所以忽略 disableSuffix
			return `${year}.${month * 100 + day}.${dailyIncrement}`;

		default:
			throw new Error(`Unknown version style: ${style}`);
	}
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
		// 無法解析，返回預設版本
		return dateToVersion({});
	}

	const { year, month, day, isJetbrainsShort, isMDCombined } = parsed;

	// 計算下一天
	let nextDay = day + 1;
	let nextMonth = month;
	let nextYear = year;

	// 每月天數 (簡單計算)
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

	const style = isJetbrainsShort
		? (isMDCombined ? EnumVersionStyle.JetbrainsShortMD : EnumVersionStyle.JetbrainsShort)
		: (isMDCombined ? EnumVersionStyle.StandardFullMD : EnumVersionStyle.StandardFull);

	// 直接調用核心函數，避免重複調用 _handleVersionStyleOptions
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
		// 無法解析，返回預設版本
		return dateToVersion({});
	}

	const { year, month, day, dailyVersion, isJetbrainsShort, isMDCombined } = parsed;

	const style = isJetbrainsShort
		? (isMDCombined ? EnumVersionStyle.JetbrainsShortMD : EnumVersionStyle.JetbrainsShort)
		: (isMDCombined ? EnumVersionStyle.StandardFullMD : EnumVersionStyle.StandardFull);

	// 直接調用核心函數，避免重複調用 _handleVersionStyleOptions
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

	// 取得要比對的日期 - 使用 _handleVersionStyleOptions 處理
	const compareDate = _handleVersionStyleOptions(optionsOrDate).date;

	return parsed.year === compareDate.year()
		&& parsed.month === compareDate.month() + 1
		&& parsed.day === compareDate.date();
}

/**
 * 從現有版本號取得下個版本
 * Get next version from existing version
 *
 * 根據選項產生版本號，並遞增當日計數
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

		// 直接從 processed 取得解析後的版本資訊
		parsed = _getParsedVersionFromOptions(processed);
	}
	catch (e)
	{
		if (throwOnError)
		{
			throw e;
		}

		// 解析失敗，返回基本版本
		return dateToVersion(processed);
	}

	// 遞增當日版本號 - 直接調用核心函數
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

	// 直接調用核心函數，避免重複調用 _handleVersionStyleOptions
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

// 調試用 / For debugging
export function _debug(...args: any[])
{
	console.log(`[${'version-style'.padEnd(20)}]`, args);
}

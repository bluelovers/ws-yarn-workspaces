import { ITSOverwrite, ITSPickExtra, ITSRequiredPick, ITSRequiredWith } from 'ts-type/lib/type/record';
import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { IOptionsTzDayjsSafeParse, tzDayjsSafeParse } from 'dayjs-tz-helper';
import { ITSTypeAndStringLiteral } from 'ts-type';
// import isToday from 'dayjs/plugin/isToday';
// dayjs.extend(isToday);

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
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 * Determine if style is JetBrains short year style
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否為 JetBrains 樣式 / Whether it is JetBrains style
 */
export function _isJetbrainsStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShort | EnumVersionStyle.JetbrainsShortMD
{
	return style === EnumVersionStyle.JetbrainsShort || style === EnumVersionStyle.JetbrainsShortMD;
}

/**
 * 從版本樣式判斷是否使用月日合併格式
 * Determine if style uses month-day combined format
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否使用 MD 格式 / Whether using MD format
 */
export function _isMDCombinedFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShortMD | EnumVersionStyle.StandardFullMD
{
	return style === EnumVersionStyle.JetbrainsShortMD || style === EnumVersionStyle.StandardFullMD;
}

/**
 * 從 isJetbrainsShort 和 isMDCombined 取得對應的版本樣式
 * Get version style from isJetbrainsShort and isMDCombined
 *
 * @param isJetbrainsShort - 是否為 JetBrains 樣式 / Whether it is JetBrains style
 * @param isMDCombined - 是否使用月日合併格式 / Whether using MD format
 * @returns 版本樣式 / Version style
 */
export function _getStyleFromFlags(isJetbrainsShort: boolean, isMDCombined: boolean): EnumVersionStyle
{
	if (isJetbrainsShort)
	{
		return isMDCombined ? EnumVersionStyle.JetbrainsShortMD : EnumVersionStyle.JetbrainsShort;
	}
	return isMDCombined ? EnumVersionStyle.StandardFullMD : EnumVersionStyle.StandardFull;
}

export interface IDateInfoMonthDay extends ITSRequiredPick<IDateInfo, 'month' | 'day'>
{

}

/**
 * 從月日合併數字解析月日資訊
 * Parse month-day info from combined number
 *
 * 將三位或四位數的月日合併數字解析為月份和日期
 * 例如: 101 -> month=1, day=1; 615 -> month=6, day=15
 *
 * @param monthDay - 月日合併數字 (如 101, 615, 1231) / Combined month-day number
 * @returns 月日資訊 / Month-day info
 */
export function _parseMonthDayFromMD(monthDay: ITSTypeAndStringLiteral<number>): IDateInfoMonthDay
{
	if (typeof monthDay === 'string')
	{
		monthDay = parseInt(monthDay, 10);
	}

	const month = Math.floor(monthDay / 100);
	const day = monthDay % 100;

	return {
		month,
		day,
	}
}

/**
 * 解析月日資訊的結果
 * Parsed month-day info result
 */
export interface IParseMonthDayResult<MD extends boolean = boolean> extends ITSRequiredPick<IParseVersionResult<boolean, MD>, 'month' | 'day' | 'dailyVersion' | 'isMDCombined'>
{

}

/**
 * 判斷是否為月日合併格式 (MD > 12)
 * Detect if format is month-day combined (MD > 12)
 *
 * 由於月日合併格式中，月日數值必須大於 12 才能與標準格式區分
 * 例如: 101 表示 1月1日，而 115 表示 1月15日
 * Because in MD combined format, monthDay must be > 12 to distinguish from standard format
 *
 * @param monthOrMD - 月份或月日合併字串 / Month or month-day combined string
 * @returns 檢測結果 { monthDay, isMDCombined } / Detection result
 */
export function _detectIsMDCombined(monthOrMD: string)
{
	// 判斷是否為月日合併格式 (MD > 12)
	const monthDay = parseInt(monthOrMD, 10);
	const isMDCombined = monthDay > 12;

	return {
		monthDay,
		isMDCombined,
	}
}

/**
 * 從版本字串的月份/日部分解析月日資訊
 * Parse month-day info from version string's month/day part
 *
 * @param monthOrMD - 月份或月日合併字串 / Month or month-day combined string
 * @param dayOrIncrement - 日或遞增部分 / Day or increment part
 * @param increment - 遞增部分（可選）/ Increment part (optional)
 * @returns 解析後的月日資訊 / Parsed month-day info
 */
export function _parseMonthDayInfo(monthOrMD: string, dayOrIncrement: string, increment?: string): IParseMonthDayResult
{
	const { monthDay, isMDCombined } = _detectIsMDCombined(monthOrMD);

	let month: number;
	let day: number;
	let dailyVersion: number;

	if (isMDCombined)
	{
		// 格式: YYYY.MD.increment 或 YYQ.MD.increment
		({ month, day } = _parseMonthDayFromMD(monthDay));

		dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);
	}
	else
	{
		// 格式: YYYY.M.D-increment 或 YYQ.M.D-increment
		month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
		day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
		dailyVersion = increment ? parseInt(increment, 10) : 1;
	}

	return { month, day, dailyVersion, isMDCombined };
}

/**
 * JetBrains 年份解析結果
 * JetBrains year parsing result
 */
export interface IParseJetbrainsYearResult
{
	year: number;
	quarter: number;
}

/**
 * 從版本字串解析 JetBrains 年份和季度
 * Parse JetBrains year and quarter from version string
 *
 * yearQuarter = (year % 100) * 10 + quarter
 * 所以: quarter = yearQuarter % 10, year = 2000 + floor(yearQuarter / 10)
 *
 * @param yearQuarterStr - 年份季度字串 / Year-quarter string (e.g., "261")
 * @returns 解析後的年份和季度 / Parsed year and quarter
 */
export function _parseJetbrainsYearQuarter(yearQuarterStr: string): IParseJetbrainsYearResult
{
	const yearQuarter = parseInt(yearQuarterStr, 10);
	const quarter = yearQuarter % 10;
	const year = 2000 + Math.floor(yearQuarter / 10);

	return { year, quarter };
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

export interface IParseVersionResultCore<JS extends boolean = boolean, MD extends boolean = boolean>
{
	/** 是否為 JetBrains 短年份樣式 / Whether it uses JetBrains short year style */
	isJetbrainsShort: JS;
	/** 是否使用月日合併格式 / Whether using month-day combined format */
	isMDCombined: MD;
}

/**
 * 解析現有版本號的回傳結果
 * Result of parsing existing version
 */
export interface IParseVersionResult<JS extends boolean = boolean, MD extends boolean = boolean> extends IDateInfo, IParseVersionResultCore<JS, MD>
{
	/** 當日版本號 / Daily version */
	dailyVersion: number;
}

/**
 * 從輸入取得 dayjs 物件
 * Get dayjs object from input
 *
 * 支援從多种输入类型转换为 dayjs 对象
 * Supports converting from multiple input types to dayjs object
 *
 * @param date - 日期輸入 / Date input (Dayjs | Date | number | string | IDateInfo)
 * @param opts - dayjs 選項 / dayjs options
 * @returns dayjs 物件 / dayjs object
 */
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

/**
 * 處理版本樣式選項（核心函數）
 * Handle version style options (core function)
 *
 * 內部核心函數，處理各種輸入類型並轉換為 dayjs 日期物件
 * Internal core function that handles various input types and converts to dayjs date object
 *
 * @param optionsOrDate - 選項或日期 / Options or date
 * @returns 處理後的選項 / Processed options
 */
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

/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
export function assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo
{
	if (!isValidDateInfo(dateInfo)) throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}

/**
 * 驗證季度是否有效
 * Validate quarter is valid
 *
 * @param quarter - 季度 / Quarter
 * @returns 是否有效 / Whether valid
 */
export function isValidQuarter(quarter: unknown): quarter is number
{
	return typeof quarter === 'number' && quarter >= 1 && quarter <= 4;
}

/**
 * 驗證季度是否有效，若無效則拋出錯誤
 * Assert quarter is valid, throw error if invalid
 *
 * @param quarter - 季度 / Quarter
 */
export function assertValidQuarter(quarter: unknown): asserts quarter is number
{
	if (!isValidQuarter(quarter))
	{
		throw new RangeError(`Invalid Quarter: quarter(1-4)=${quarter} must be a valid number.`);
	}
}

/**
 * 從 Date 物件取得日期資訊
 * Get date info from Date object
 *
 * 將 JavaScript Date 物件轉換為 IDateInfo 格式
 * Convert JavaScript Date object to IDateInfo format
 *
 * @param date - Date 物件 / Date object
 * @returns 日期資訊 / Date info
 *
 * @deprecated 建議使用 _getDateInfoFromDayjs
 * @deprecated Recommend using _getDateInfoFromDayjs
 */
export function _getDateInfoFromDate(date: Date): IDateInfo
{
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}

/**
 * 從 dayjs 物件取得日期資訊
 * Get date info from dayjs object
 *
 * 將 dayjs 物件轉換為 IDateInfo 格式
 * 注意: dayjs 的月份是 0-based，需要轉換為 1-based
 *
 * @param date - dayjs 物件 / dayjs object
 * @returns 日期資訊 / Date info
 */
export function _getDateInfoFromDayjs(date: Dayjs): IDateInfo
{
	return {
		year: date.year(),
		month: date.month() + 1, // dayjs 使用 0-based 月份 / dayjs uses 0-based month
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

	// 沒有 currentVersion 時，直接從 dateInfo 和 style 建構結果
	// dailyVersion 預設為 1（新版本的初始值）
	// isJetbrainsShort 和 isMDCombined 可從 style 推斷
	return {
		...dateInfo,
		dailyVersion: processed.dailyIncrement,
		isJetbrainsShort: _isJetbrainsStyleFromStyle(style),
		isMDCombined: _isMDCombinedFromStyle(style),
	};
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

	// 使用輔助函數解析月日資訊
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

	if (!jetbrainsMatch)
	{
		return null;
	}

	const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;

	// 使用輔助函數解析 JetBrains 年份和季度
	const { year } = _parseJetbrainsYearQuarter(yearQuarterStr);

	// 使用輔助函數解析月日資訊
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

/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 * Convert date to version string by style (core function)
 *
 * 內部核心函數，根據版本樣式將日期資訊轉換為版本字串
 * Internal core function that converts date info to version string based on style
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options (year, month, day, dailyIncrement, disableDailyVersionSuffix)
 * @returns 版本字串 / Version string
 */
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

	// 使用輔助函數取得 style
	const style = _getStyleFromFlags(isJetbrainsShort, isMDCombined);

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

	// 使用輔助函數取得 style
	const style = _getStyleFromFlags(isJetbrainsShort, isMDCombined);

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

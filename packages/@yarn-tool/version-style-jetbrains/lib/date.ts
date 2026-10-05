/**
 * 季度計算輔助函數
 * Quarter calculation helper functions
 */

import { Dayjs, isDayjs } from 'dayjs';
import {
	IDateInfo,
	IDateInfoMonthDay,
	IDateInput,
	IParseJetbrainsYearResult,
	IParseMonthDayResult,
	IVersionStyleOptions,
} from './types';
import { ITSTypeAndStringLiteral } from 'ts-type';
import { IOptionsTzDayjsSafeParse, tzDayjsSafeParse } from 'dayjs-tz-helper';
import { isValidDateInfo } from './assert';
import { _handleVersionStyleOptionsCore } from './options';

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
	/** 調用端可能傳入字串（如 regex 捕獲組），先統一轉為數字 / Callers may pass a string (e.g. a regex capture group); normalize to number first */
	if (typeof monthDay === 'string')
	{
		monthDay = parseInt(monthDay, 10);
	}

	/** 以百位切分月與日：101 -> 1 月 1 日、615 -> 6 月 15 日 / Split at the hundreds place: 101 -> Jan 1, 615 -> Jun 15 */
	const month = Math.floor(monthDay / 100);
	const day = monthDay % 100;

	return {
		month,
		day,
	}
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
	/**
	 * 判斷是否為月日合併格式 (MD > 12)：
	 * 標準格式的「月」最多 12，因此大於 12 必為合併數字（如 101 = 1月1日）
	 *
	 * Detect month-day combined format (MD > 12): a plain month never exceeds
	 * 12, so any larger value must be combined (e.g. 101 = Jan 1)
	 */
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
		/** 格式: YYYY.MD.increment 或 YYQ.MD.increment，第三段才是遞增號 / Format YYYY.MD.increment or YYQ.MD.increment: the third segment is the increment */
		({ month, day } = _parseMonthDayFromMD(monthDay));

		dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);
	}
	else
	{
		/**
		 * 格式: YYYY.M.D-increment 或 YYQ.M.D-increment；
		 * 缺少日或遞增段時回退到 1，視為最小合法版本
		 *
		 * Format YYYY.M.D-increment or YYQ.M.D-increment; missing day or
		 * increment segments fall back to 1 as the minimal valid version
		 */
		month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
		day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
		dailyVersion = increment ? parseInt(increment, 10) : 1;
	}

	return { month, day, dailyVersion, isMDCombined };
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
	/** 末位為季度、其餘為年份後兩位，故以 % 10 取季度 / The last digit is the quarter, so take it with % 10 */
	const quarter = yearQuarter % 10;
	/** 年份固定補回 2000 年代：JetBrains 短格式只存兩位年 / Anchor the year to the 2000s: the short format only stores two digits */
	const year = 2000 + Math.floor(yearQuarter / 10);

	return { year, quarter };
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
	/**
	 * 物件型別需再細分：Dayjs、Date、IDateInfo 三者的解析方式不同，
	 * 統一交給 tzDayjsSafeParse 可保留時區 (Timezone) 資訊
	 *
	 * Object inputs need further discrimination: Dayjs, Date and IDateInfo each
	 * parse differently; routing through tzDayjsSafeParse preserves timezone info
	 */
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
			/** IDateInfo 沒有時區資訊，以字串組合後交由 safeParse 處理 / IDateInfo carries no timezone, so compose a string and let safeParse handle it */
			return tzDayjsSafeParse(`${date.year}-${date.month}-${date.day}`, opts);
		}
	}
	else if (typeof date === 'string' || typeof date === 'number')
	{
		/** 字串或 timestamp：交給 safeParse 嘗試多種格式 / String or timestamp: let safeParse try its supported formats */
		return tzDayjsSafeParse(date, opts);
	}

	/**
	 * 未知或無效輸入回傳 null（而非拋錯），
	 * 由 _handleVersionStyleOptionsCore 以 new Date() 取代
	 *
	 * Unknown or invalid input returns null (instead of throwing);
	 * _handleVersionStyleOptionsCore substitutes new Date() for it
	 */
	return null
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
	/**
	 * 相容兩種呼叫方式：傳整個 options 時取其 .date，
	 * 傳純日期時直接當日期使用，最後統一經 _getDateInfoFromDayjs 取年月日
	 *
	 * Accepts both call styles: use .date when a full options object is passed,
	 * or treat the value itself as the date, both ending at _getDateInfoFromDayjs
	 */
	let date = _handleVersionStyleOptionsCore((options as IVersionStyleOptions)?.date ?? options).date
	return _getDateInfoFromDayjs(date);
}

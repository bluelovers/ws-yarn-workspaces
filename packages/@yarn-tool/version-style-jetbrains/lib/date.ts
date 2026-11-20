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
 *
 * @param month - 月份 (1-12)
 * @returns 季度 (1-4)
 */
export function getQuarterFromMonth(month: number): number
{
	return Math.ceil(month / 3);
}

/**
 * 根據年份和季度取得 JetBrains 風格的年份編碼
 *
 * @param year - 年份
 * @param quarter - 季度 (1-4)
 * @returns 年份編碼 (如 261 表示 2026年Q1)
 */
export function getJetbrainsYearCode(year: number, quarter: number): number
{
	return (year % 100) * 10 + quarter;
}

/**
 * 從月日合併數字解析月日資訊
 *
 * 將三位或四位數的月日合併數字解析為月份和日期
 * 例如: 101 -> month=1, day=1; 615 -> month=6, day=15
 *
 * @param monthDay - 月日合併數字 (如 101, 615, 1231)
 * @returns 月日資訊
 */
export function _parseMonthDayFromMD(monthDay: ITSTypeAndStringLiteral<number>): IDateInfoMonthDay
{
	/** 調用端可能傳入字串（如 regex 捕獲組），先統一轉為數字 */
	if (typeof monthDay === 'string')
	{
		monthDay = parseInt(monthDay, 10);
	}

	/** 以百位切分月與日：101 -> 1 月 1 日、615 -> 6 月 15 日 */
	const month = Math.floor(monthDay / 100);
	const day = monthDay % 100;

	return {
		month,
		day,
	}
}

/**
 * 判斷是否為月日合併格式 (MD > 12)
 *
 * 由於月日合併格式中，月日數值必須大於 12 才能與標準格式區分
 * 例如: 101 表示 1月1日，而 115 表示 1月15日
 *
 * @param monthOrMD - 月份或月日合併字串
 * @returns 檢測結果
 */
export function _detectIsMDCombined(monthOrMD: string)
{
	/**
	 * 判斷是否為月日合併格式 (MD > 12)：
	 * 標準格式的「月」最多 12，因此大於 12 必為合併數字（如 101 = 1月1日）
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
 *
 * @param monthOrMD - 月份或月日合併字串
 * @param dayOrIncrement - 日或遞增部分
 * @param increment - 遞增部分（可選）
 * @returns 解析後的月日資訊
 */
export function _parseMonthDayInfo(monthOrMD: string, dayOrIncrement: string, increment?: string): IParseMonthDayResult
{
	const { monthDay, isMDCombined } = _detectIsMDCombined(monthOrMD);

	let month: number;
	let day: number;
	let dailyVersion: number;

	if (isMDCombined)
	{
		/** 格式: YYYY.MD.increment 或 YYQ.MD.increment，第三段才是遞增號 */
		({ month, day } = _parseMonthDayFromMD(monthDay));

		dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);
	}
	else
	{
		/**
		 * 格式: YYYY.M.D-increment 或 YYQ.M.D-increment；
		 * 缺少日或遞增段時回退到 1，視為最小合法版本
		 */
		month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
		day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
		dailyVersion = increment ? parseInt(increment, 10) : 1;
	}

	return { month, day, dailyVersion, isMDCombined };
}

/**
 * 從版本字串解析 JetBrains 年份和季度
 *
 * yearQuarter = (year % 100) * 10 + quarter
 * 所以: quarter = yearQuarter % 10, year = 2000 + floor(yearQuarter / 10)
 *
 * @param yearQuarterStr - 年份季度字串 (e.g., "261")
 * @returns 解析後的年份和季度
 */
export function _parseJetbrainsYearQuarter(yearQuarterStr: string): IParseJetbrainsYearResult
{
	const yearQuarter = parseInt(yearQuarterStr, 10);
	/** 末位為季度、其餘為年份後兩位，故以 % 10 取季度 */
	const quarter = yearQuarter % 10;
	/** 年份固定補回 2000 年代：JetBrains 短格式只存兩位年 */
	const year = 2000 + Math.floor(yearQuarter / 10);

	return { year, quarter };
}

/**
 * 從輸入取得 dayjs 物件
 *
 * 支援從多种输入类型转换为 dayjs 对象
 *
 * @param date - 日期輸入 (Dayjs | Date | number | string | IDateInfo)
 * @param opts - dayjs 選項
 * @returns dayjs 物件
 */
export function getDayjsFromInput(date: IDateInput, opts?: IOptionsTzDayjsSafeParse)
{
	/**
	 * 物件型別需再細分：Dayjs、Date、IDateInfo 三者的解析方式不同，
	 * 統一交給 tzDayjsSafeParse 可保留時區 (Timezone) 資訊
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
			/** IDateInfo 沒有時區資訊，以字串組合後交由 safeParse 處理 */
			return tzDayjsSafeParse(`${date.year}-${date.month}-${date.day}`, opts);
		}
	}
	else if (typeof date === 'string' || typeof date === 'number')
	{
		/** 字串或 timestamp：交給 safeParse 嘗試多種格式 */
		return tzDayjsSafeParse(date, opts);
	}

	/**
	 * 未知或無效輸入回傳 null（而非拋錯），
	 * 由 _handleVersionStyleOptionsCore 以 new Date() 取代
	 */
	return null
}

/**
 * 從 Date 物件取得日期資訊
 *
 * 將 JavaScript Date 物件轉換為 IDateInfo 格式
 *
 * @param date - Date 物件
 * @returns 日期資訊
 *
 * @deprecated 建議使用 _getDateInfoFromDayjs
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
 *
 * 將 dayjs 物件轉換為 IDateInfo 格式
 * 注意: dayjs 的月份是 0-based，需要轉換為 1-based
 *
 * @param date - dayjs 物件
 * @returns 日期資訊
 */
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
 *
 * @param options - 選項
 * @returns 日期資訊
 *
 * @deprecated 當 options 確定經過 _handleVersionStyleOptionsCore 或 _handleVersionStyleOptions 處理過時可以直接使用 _getDateInfoFromDayjs
 */
export function _getDateInfoFromOptions(options: IVersionStyleOptions | IDateInput)
{
	/**
	 * 相容兩種呼叫方式：傳整個 options 時取其 .date，
	 * 傳純日期時直接當日期使用，最後統一經 _getDateInfoFromDayjs 取年月日
	 */
	let date = _handleVersionStyleOptionsCore((options as IVersionStyleOptions)?.date ?? options).date
	return _getDateInfoFromDayjs(date);
}

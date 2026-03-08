/**
 * 版本樣式類型定義
 * Version style type definitions
 */

import { ITSOverwrite, ITSPickExtra, ITSRequiredPick, ITSRequiredWith } from 'ts-type/lib/type/record';
import { Dayjs } from 'dayjs';
import { IOptionsTzDayjsSafeParse } from 'dayjs-tz-helper';
import { ITSTypeAndStringLiteral } from 'ts-type';

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

/**
 * 日期輸入類型
 * Date input types
 */
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

	/** 日期選項 / Date options */
	dateOptions?: IOptionsTzDayjsSafeParse;
}

/**
 * 帶日期資訊的版本樣式選項
 * Version style options with date info
 */
export interface IVersionStyleOptionsWithDateInfo extends IVersionStyleOptions, IDateInfo
{

}

/**
 * 運行時選項類型
 * Runtime options type
 */
export type IOptionsRuntime<T extends Pick<IVersionStyleOptions, 'date'>> = ITSOverwrite<T, {
	date: Dayjs
}>;

/**
 * 必需運行時選項類型
 * Required runtime options type
 */
export type IRequiredOptionsRuntime<T extends IVersionStyleOptions = IVersionStyleOptions> = Required<IOptionsRuntime<T>>

/**
 * 請注意月份為 Human-readable Month Number
 * 不是 Zero-based Month Number
 *
 * Note: month is Human-readable Month Number (1-12), not Zero-based Month Number (0-11)
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
 * 解析版本結果核心類型
 * Parse version result core type
 */
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
 * 月日資訊類型
 * Month-day info type
 */
export interface IDateInfoMonthDay extends ITSRequiredPick<IDateInfo, 'month' | 'day'>
{

}

/**
 * 解析月日資訊的結果
 * Parsed month-day info result
 */
export interface IParseMonthDayResult<MD extends boolean = boolean> extends ITSRequiredPick<IParseVersionResult<boolean, MD>, 'month' | 'day' | 'dailyVersion' | 'isMDCombined'>
{

}

/**
 * JetBrains 年份解析結果
 * JetBrains year parsing result
 */
export interface IParseJetbrainsYearResult
{
	/** 年份 / Year */
	year: number;
	/** 季度 / Quarter (1-4) */
	quarter: number;
}

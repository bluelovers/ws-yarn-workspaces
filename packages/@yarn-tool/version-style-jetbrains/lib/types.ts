import { ITSOverwrite, ITSPickExtra, ITSRequiredPick, ITSRequiredWith } from 'ts-type/lib/type/record';
import { Dayjs } from 'dayjs';
import { IOptionsTzDayjsSafeParse } from 'dayjs-tz-helper';
import { ITSTypeAndStringLiteral, ITSNumberValue2 } from 'ts-type';
import {
	ISegVerDailyVersionIncrementNumber,
	ISegDayNumber,
	ISegMonthNumber,
	ISegQuarterNumber,
	ISegTimeHourNumber,
	ISegTimeMinuteNumber,
	ISegYearNumber,
	ISeqVersionAny,
} from './types-seg';

/**
 * 版本風格類型
 */
export enum EnumVersionStyle
{
	/**
	 * JetBrains 短年份樣式
	 *
	 * @example 261.1.1-1
	 */
	JetbrainsShort = 'jetbrains-short',
	/**
	 * 標準完整年份樣式
	 *
	 * @example 2026.1.1-1
	 */
	StandardFull = 'standard-full',
	/**
	 * JetBrains 短年份 + 月日合併樣式
	 *
	 * @example 261.101.1
	 */
	JetbrainsShortMD = 'jetbrains-short-md',
	/**
	 * 標準完整年份 + 月日合併樣式
	 *
	 * @example 2026.101.1
	 */
	StandardFullMD = 'standard-full-md',
	/**
	 * y2k 年份 + 月日 + 時間樣式
	 *
	 * 首段取年份 (2026) 的第一個 2 與年份後兩位，第二段為月日 (MMDD)，第三段為時分 (HHmm)
	 * 2100 起不支援
	 *
	 * @example 226.1120.1744-1
	 * @example 226.1120.1744 (disableDailyVersionSuffix)
	 */
	Y2KDateTime = 'y2k-date-time',
	/**
	 * JetBrains 年份季度 + 月日 + 時間樣式
	 *
	 * 首段為 YYQ (如 264 = 2026年Q4)，第二段為月日 (MMDD)，第三段為時分 (HHmm)
	 *
	 * @example 264.1120.1744-1
	 * @example 264.1120.1744 (disableDailyVersionSuffix)
	 */
	JetbrainsDateTime = 'jetbrains-date-time',
}

/**
 * 日期輸入類型
 */
export type IDateInput = Dayjs | Date | number | string | IDateInfo;

/**
 * 版本樣式配置選項
 */
export interface IVersionStyleOptions
{
	/** 指定日期 (預設為現在) */
	date?: IDateInput;
	/** 當日版本號遞增 */
	dailyIncrement?: ISegVerDailyVersionIncrementNumber;
	/** 小時 (0-23)，僅 Y2KDateTime 樣式使用，預設取自 date */
	hour?: ISegTimeHourNumber;
	/** 分鐘 (0-59)，僅 Y2KDateTime 樣式使用，預設取自 date */
	minute?: ISegTimeMinuteNumber;
	/** 是否禁用結尾的 -x dailyVersion (對 JetbrainsShort / StandardFull / Y2KDateTime 有效) */
	disableDailyVersionSuffix?: boolean;
	/** 版本樣式 (default is JetbrainsShortMD) */
	style?: EnumVersionStyle;
	/** 是否在解析失敗時拋出錯誤 */
	throwOnError?: boolean;
	/** 現有版本號 (用於遞增) */
	currentVersion?: ISeqVersionAny;

	/** 日期選項 */
	dateOptions?: IOptionsTzDayjsSafeParse;
}

/**
 * 帶日期資訊的版本樣式選項
 */
export interface IVersionStyleOptionsWithDateInfo extends IVersionStyleOptions, IDateInfo
{

}

/**
 * 運行時選項類型
 */
export type IOptionsRuntime<T extends Pick<IVersionStyleOptions, 'date'>> = ITSOverwrite<T, {
	date: Dayjs
}>;

/**
 * 必需運行時選項類型
 */
export type IRequiredOptionsRuntime<T extends IVersionStyleOptions = IVersionStyleOptions> = Required<IOptionsRuntime<T>>

/**
 * 請注意月份為 Human-readable Month Number (1-12)
 * 不是 Zero-based Month Number (0-11)
 */
export interface IDateInfo
{
	year: ISegYearNumber;
	/** Human-readable Month Number (1-12) */
	month: ISegMonthNumber;
	day: ISegDayNumber;
}

/**
 * 解析版本結果核心類型
 */
export interface IParseVersionResultCore<JS extends boolean = boolean, MD extends boolean = boolean>
{
	/** 是否為 JetBrains 短年份樣式 */
	isJetbrainsShort: JS;
	/** 是否使用月日合併格式 */
	isMDCombined: MD;
	/**
	 * 是否為日期時間樣式 (264.1120.1744 / 226.1120.1744)
	 *
	 * 僅日期時間樣式會帶此欄位，其餘樣式省略以維持既有解析結果形狀
	 */
	isDateTime?: boolean;
	/**
	 * 是否為 y2k 日期時間樣式 (226.1120.1744)
	 *
	 * 僅 y2k 樣式會帶此欄位；缺此欄位的時間樣式即 JetBrains 樣式 (264.1120.1744)
	 */
	isY2KDateTime?: boolean;
	/** 小時 (0-23)，僅日期時間樣式提供 */
	hour?: ISegTimeHourNumber;
	/** 分鐘 (0-59)，僅日期時間樣式提供 */
	minute?: ISegTimeMinuteNumber;
}

/**
 * 解析現有版本號的回傳結果
 */
export interface IParseVersionResult<JS extends boolean = boolean, MD extends boolean = boolean> extends IDateInfo, IParseVersionResultCore<JS, MD>
{
	/** 當日版本號 */
	dailyVersion: ISegVerDailyVersionIncrementNumber;
}

/**
 * 判斷版本樣式所需的旗標
 *
 * 由解析結果提供，以單一物件傳遞避免位置參數持續增加
 */
export type IVersionStyleFlags = Pick<IParseVersionResult, 'isJetbrainsShort' | 'isMDCombined' | 'isDateTime' | 'isY2KDateTime'>;

/**
 * 月日資訊類型
 */
export interface IDateInfoMonthDay extends ITSRequiredPick<IDateInfo, 'month' | 'day'>
{

}

/**
 * 解析月日資訊的結果
 */
export interface IParseMonthDayResult<MD extends boolean = boolean> extends ITSRequiredPick<IParseVersionResult<boolean, MD>, 'month' | 'day' | 'dailyVersion' | 'isMDCombined'>
{

}

/**
 * JetBrains 年份解析結果
 */
export interface IParseJetbrainsYearResult
{
	/** 年份 */
	year: ISegYearNumber;
	/** 季度 (1-4) */
	quarter: ISegQuarterNumber;
}

export interface IHourAndMinute
{
	/** 小時 (0-23) */
	hour: ISegTimeHourNumber;
	/** 分鐘 (0-59) */
	minute: ISegTimeMinuteNumber;
}

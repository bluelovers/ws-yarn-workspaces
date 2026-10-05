import {
	EnumVersionStyle,
	IDateInput,
	IOptionsRuntime,
	IParseVersionResult,
	IRequiredOptionsRuntime,
	IVersionStyleOptions,
} from './types';
import { _getDateInfoFromDayjs, getDayjsFromInput } from './date';
import { _isJetbrainsStyleFromStyle, _isMDCombinedFromStyle } from './assert';
import { _parseVersion } from './helpers';

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
	/**
	 * 兩個布林旗標組成 2x2 矩陣，先判斷年份格式再判斷月日格式，
	 * 可避免四種樣式各寫一個條件
	 *
	 * The two flags form a 2x2 matrix; branching on year format first, then
	 * month-day format, avoids writing one condition per style
	 */
	if (isJetbrainsShort)
	{
		return isMDCombined ? EnumVersionStyle.JetbrainsShortMD : EnumVersionStyle.JetbrainsShort;
	}
	return isMDCombined ? EnumVersionStyle.StandardFullMD : EnumVersionStyle.StandardFull;
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
	/** 輸入日期：可能是原始型別，稍後統一轉為 dayjs / Input date: may be a raw type, converted to dayjs below */
	let date: IDateInput;
	/** 傳入的選項物件，預設為空 / Incoming options object, defaults to empty */
	let options: IOptionsRuntime<T> = {} as any;

	/**
	 * 未指定任何輸入時保持 options 為空物件，
	 * 日期交給後方統一以 new Date() 補上預設值
	 *
	 * With no input at all, keep options empty and let the code below
	 * fill in the date with the shared new Date() default
	 */
	if (!optionsOrDate)
	{
		//
	}
	else if (typeof optionsOrDate === 'number' || typeof optionsOrDate === 'string')
	{
		/**
		 * 純日期輸入（timestamp / 日期字串）：整筆就是日期，沒有選項物件
		 *
		 * Bare date input (timestamp / date string): the whole value is the
		 * date, with no options object involved
		 */
		date = optionsOrDate
	}
	else if (optionsOrDate instanceof Date)
	{
		/**
		 * 已經是 Date 物件，無需再解析
		 *
		 * Already a Date instance, so no parsing is needed
		 */
		date = optionsOrDate;
	}
	else if ('date' in optionsOrDate)
	{
		/**
		 * 同時帶有 date 與其他選項：兩者都要保留，
		 * 注意 date 可能仍是原始輸入型別，交由 getDayjsFromInput 轉換
		 *
		 * Both date and other options are present and must be kept;
		 * note date may still be a raw input type, converted later by getDayjsFromInput
		 */
		date = optionsOrDate.date as any;
		options = optionsOrDate as any;
	}
	else if (typeof optionsOrDate === 'object')
	{
		/**
		 * 只有選項沒有日期：日期交給後方預設值
		 *
		 * Options without a date: the date comes from the default below
		 */
		options = optionsOrDate as any
	}

	/**
	 * 統一在此把日期轉為 dayjs 並強制寫回 options.date，
	 * 讓下游一律拿到可預期的 Dayjs 型別
	 *
	 * Convert the date to dayjs and always write it back into options.date here,
	 * so every caller downstream sees a predictable Dayjs type
	 */
	options = {
		...options,
		date: getDayjsFromInput(date ?? new Date(), options.dateOptions),
	};

	return options
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
	/**
	 * 優先使用 currentVersion：它代表「要遞增的基準版本」，
	 * 比從日期重新生成更貼近呼叫端意圖
	 *
	 * Prefer currentVersion: it is the baseline to increment from,
	 * closer to caller intent than regenerating from the date
	 */
	if (processed.currentVersion)
	{
		const parsed = _parseVersion(processed.currentVersion);

		/** 解析成功即為最終結果，無需再走日期推導路徑 / Parsed successfully: no need to derive from the date */
		if (parsed)
		{
			return parsed;
		}

		/**
		 * 解析失敗：只有呼叫端明確要求拋錯時才中斷，
		 * 否則靜默忽略並退回由日期建構（容錯預設）
		 *
		 * Parse failed: only abort when the caller explicitly asked for errors,
		 * otherwise fall back to date-derived construction (tolerant default)
		 */
		if (processed.throwOnError)
		{
			throw new RangeError(`Failed to parse currentVersion: ${processed.currentVersion}`);
		}
	}

	/** 從已轉換完成的 dayjs 日期取出年月日 / Extract year/month/day from the already-converted dayjs date */
	const { date, style } = processed;
	const dateInfo = _getDateInfoFromDayjs(date);

	/**
	 * 沒有 currentVersion（或解析失敗被忽略）時，直接從 dateInfo 和 style 建構結果
	 * dailyVersion 預設為 1（新版本的初始值）
	 * isJetbrainsShort 和 isMDCombined 可從 style 推斷
	 *
	 * Without currentVersion (or when a parse failure was ignored), build the result
	 * from dateInfo and style; dailyVersion starts at 1 (initial value of a new version),
	 * and isJetbrainsShort / isMDCombined are inferred from style
	 */
	return {
		...dateInfo,
		dailyVersion: processed.dailyIncrement,
		isJetbrainsShort: _isJetbrainsStyleFromStyle(style),
		isMDCombined: _isMDCombinedFromStyle(style),
	};
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

	/**
	 * 補上各選項的預設值：遞增號從 1 起算、預設不禁用後綴、
	 * 樣式預設 JetbrainsShortMD（年份兩位 + 月日合併，最為緊湊）
	 *
	 * Fill in defaults: increment starts at 1, suffix stays enabled, and the
	 * default style is JetbrainsShortMD (two-digit year + combined month-day,
	 * the most compact form)
	 */
	return {
		...options,
		dailyIncrement: options.dailyIncrement ?? 1,
		disableDailyVersionSuffix: options.disableDailyVersionSuffix ?? false,
		style: options.style ?? EnumVersionStyle.JetbrainsShortMD,
	} as IRequiredOptionsRuntime<T>;
}

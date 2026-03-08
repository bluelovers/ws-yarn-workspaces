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
		const parsed = _parseVersion(processed.currentVersion);

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
	} as IRequiredOptionsRuntime<T>;
}

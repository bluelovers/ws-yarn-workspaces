import {
	EnumVersionStyle,
	IDateInput,
	IOptionsRuntime,
	IParseVersionResult,
	IRequiredOptionsRuntime,
	IVersionStyleOptions,
} from './types';
import { _getDateInfoFromDayjs, getDayjsFromInput } from './date';
import {
	_isDateTimeStyleFromStyle,
	_isJetbrainsStyleFromStyle,
	_isMDCombinedFromStyle,
	_isY2KDateTimeStyleFromStyle,
} from './assert';
import { analyzeVersionStyles } from './analyze';

/**
 * 處理版本樣式選項（核心函數）
 *
 * 內部核心函數，處理各種輸入類型並轉換為 dayjs 日期物件
 *
 * @param optionsOrDate - 選項或日期
 * @returns 處理後的選項
 */
export function _handleVersionStyleOptionsCore<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput)
{
	/** 輸入日期：可能是原始型別，稍後統一轉為 dayjs */
	let date: IDateInput;
	/** 傳入的選項物件，預設為空 */
	let options: IOptionsRuntime<T> = {} as any;

	/**
	 * 未指定任何輸入時保持 options 為空物件，
	 * 日期交給後方統一以 new Date() 補上預設值
	 */
	if (!optionsOrDate)
	{
		//
	}
	else if (typeof optionsOrDate === 'number' || typeof optionsOrDate === 'string')
	{
		/**
		 * 純日期輸入（timestamp / 日期字串）：整筆就是日期，沒有選項物件
		 */
		date = optionsOrDate
	}
	else if (optionsOrDate instanceof Date)
	{
		/**
		 * 已經是 Date 物件，無需再解析
		 */
		date = optionsOrDate;
	}
	else if ('date' in optionsOrDate)
	{
		/**
		 * 同時帶有 date 與其他選項：兩者都要保留，
		 * 注意 date 可能仍是原始輸入型別，交由 getDayjsFromInput 轉換
		 */
		date = optionsOrDate.date as any;
		options = optionsOrDate as any;
	}
	else if (typeof optionsOrDate === 'object')
	{
		/**
		 * 只有選項沒有日期：日期交給後方預設值
		 */
		options = optionsOrDate as any
	}

	/**
	 * 統一在此把日期轉為 dayjs 並強制寫回 options.date，
	 * 讓下游一律拿到可預期的 Dayjs 型別
	 */
	options = {
		...options,
		date: getDayjsFromInput(date ?? new Date(), options.dateOptions),
	};

	return options
}

/**
 * 從選項取得解析後的版本資訊
 *
 * 優先使用 currentVersion，否則從日期產生版本
 *
 * @param processed - 處理後的選項
 * @returns 解析後的版本資訊
 */
export function _getParsedVersionFromOptions(processed: IRequiredOptionsRuntime): IParseVersionResult
{
	/**
	 * 優先使用 currentVersion：它代表「要遞增的基準版本」，
	 * 比從日期重新生成更貼近呼叫端意圖
	 */
	if (processed.currentVersion)
	{
		const parsed = analyzeVersionStyles(processed.currentVersion).priorityResult;

		/** 解析成功即為最終結果，無需再走日期推導路徑 */
		if (parsed)
		{
			return parsed;
		}

		/**
		 * 解析失敗：只有呼叫端明確要求拋錯時才中斷，
		 * 否則靜默忽略並退回由日期建構（容錯預設）
		 */
		if (processed.throwOnError)
		{
			throw new RangeError(`Failed to parse currentVersion: ${processed.currentVersion}`);
		}
	}

	/** 從已轉換完成的 dayjs 日期取出年月日 */
	const { date, style } = processed;
	const dateInfo = _getDateInfoFromDayjs(date);

	/**
	 * 沒有 currentVersion（或解析失敗被忽略）時，直接從 dateInfo 和 style 建構結果
	 * dailyVersion 預設為 1（新版本的初始值）
	 * isJetbrainsShort 和 isMDCombined 可從 style 推斷
	 */
	return {
		...dateInfo,
		dailyVersion: processed.dailyIncrement,
		hour: processed.hour,
		minute: processed.minute,
		isJetbrainsShort: _isJetbrainsStyleFromStyle(style),
		isMDCombined: _isMDCombinedFromStyle(style),
		isDateTime: _isDateTimeStyleFromStyle(style),
		isY2KDateTime: _isY2KDateTimeStyleFromStyle(style),
	};
}

/**
 * 處理版本樣式選項
 *
 * 將可選的選項轉換為完整的物件，設定預設值
 * 支援接受 Date 或 IVersionStyleOptions
 *
 * @param optionsOrDate - 原始選項或 Date
 * @returns 處理後的選項
 */
export function _handleVersionStyleOptions<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput): IRequiredOptionsRuntime<T>
{
	const options = _handleVersionStyleOptionsCore<T>(optionsOrDate);

	/**
	 * 補上各選項的預設值：遞增號從 1 起算、預設不禁用後綴、
	 * 樣式預設 JetbrainsShortMD（年份兩位 + 月日合併，最為緊湊）、
	 * 時分取自 date（僅日期時間樣式會用到）
	 */
	return {
		...options,
		dailyIncrement: options.dailyIncrement ?? 1,
		disableDailyVersionSuffix: options.disableDailyVersionSuffix ?? false,
		style: options.style ?? EnumVersionStyle.JetbrainsShortMD,
		hour: options.hour ?? options.date.hour(),
		minute: options.minute ?? options.date.minute(),
	} as IRequiredOptionsRuntime<T>;
}

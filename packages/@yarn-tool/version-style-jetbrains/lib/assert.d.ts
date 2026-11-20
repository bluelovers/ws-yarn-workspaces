import { EnumVersionStyle, IDateInfo } from './types';
/**
 * 驗證日期資訊是否完整
 *
 * @param dateInfo - 日期資訊
 * @returns 是否有效
 */
export declare function isValidDateInfo(dateInfo: Partial<IDateInfo>): dateInfo is IDateInfo;
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 *
 * @param dateInfo - 日期資訊
 * @throws RangeError 當日期資訊無效時
 */
export declare function _assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo;
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 *
 * @param dateInfo - 日期資訊
 * @throws RangeError 當日期資訊無效時
 */
export declare function assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo;
/**
 * 驗證季度是否有效
 *
 * @param quarter - 季度
 * @returns 是否有效
 */
export declare function isValidQuarter(quarter: unknown): quarter is number;
/**
 * 驗證季度是否有效，若無效則拋出錯誤
 *
 * @param quarter - 季度
 */
export declare function assertValidQuarter(quarter: unknown): asserts quarter is number;
/**
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 JetBrains 樣式
 */
export declare function _isJetbrainsStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShort | EnumVersionStyle.JetbrainsShortMD | EnumVersionStyle.Y2KDateTime | EnumVersionStyle.JetbrainsDateTime;
/**
 * 從版本樣式判斷是否使用月日合併格式
 *
 * @param style - 版本樣式
 * @returns 是否使用 MD 格式
 */
export declare function _isMDCombinedFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShortMD | EnumVersionStyle.StandardFullMD | EnumVersionStyle.Y2KDateTime | EnumVersionStyle.JetbrainsDateTime;
/**
 * 從版本樣式判斷是否為日期時間樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 JetbrainsDateTime 或 Y2KDateTime 樣式
 */
export declare function _isDateTimeStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.Y2KDateTime | EnumVersionStyle.JetbrainsDateTime;
/**
 * 從版本樣式判斷是否為 y2k 日期時間樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 Y2KDateTime 樣式
 */
export declare function _isY2KDateTimeStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.Y2KDateTime;

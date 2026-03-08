import { EnumVersionStyle, IDateInfo } from './types';
/**
 * 驗證日期資訊是否完整
 * Validate date info completeness
 *
 * @param dateInfo - 日期資訊 / Date info
 * @returns 是否有效 / Whether valid
 */
export declare function isValidDateInfo(dateInfo: Partial<IDateInfo>): dateInfo is IDateInfo;
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
export declare function _assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo;
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
export declare function assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo;
/**
 * 驗證季度是否有效
 * Validate quarter is valid
 *
 * @param quarter - 季度 / Quarter
 * @returns 是否有效 / Whether valid
 */
export declare function isValidQuarter(quarter: unknown): quarter is number;
/**
 * 驗證季度是否有效，若無效則拋出錯誤
 * Assert quarter is valid, throw error if invalid
 *
 * @param quarter - 季度 / Quarter
 */
export declare function assertValidQuarter(quarter: unknown): asserts quarter is number;
/**
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 * Determine if style is JetBrains short year style
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否為 JetBrains 樣式 / Whether it is JetBrains style
 */
export declare function _isJetbrainsStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShort | EnumVersionStyle.JetbrainsShortMD;
/**
 * 從版本樣式判斷是否使用月日合併格式
 * Determine if style uses month-day combined format
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否使用 MD 格式 / Whether using MD format
 */
export declare function _isMDCombinedFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShortMD | EnumVersionStyle.StandardFullMD;

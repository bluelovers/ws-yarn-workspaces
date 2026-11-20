"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDateInfo = isValidDateInfo;
exports._assertValidDateInfo = _assertValidDateInfo;
exports.assertValidDateInfo = assertValidDateInfo;
exports.isValidQuarter = isValidQuarter;
exports.assertValidQuarter = assertValidQuarter;
exports._isJetbrainsStyleFromStyle = _isJetbrainsStyleFromStyle;
exports._isMDCombinedFromStyle = _isMDCombinedFromStyle;
exports._isDateTimeStyleFromStyle = _isDateTimeStyleFromStyle;
exports._isY2KDateTimeStyleFromStyle = _isY2KDateTimeStyleFromStyle;
const types_1 = require("./types");
/**
 * 驗證日期資訊是否完整
 *
 * @param dateInfo - 日期資訊
 * @returns 是否有效
 */
function isValidDateInfo(dateInfo) {
    /**
     * 逐欄位檢查而非僅檢查存在：month 限 1-12、day 限 1-31，
     * 可在解析階段就攔下如「13 月」「0 日」這類格式正確但語意錯誤的輸入
     */
    return (typeof dateInfo.year === 'number' &&
        typeof dateInfo.month === 'number' &&
        typeof dateInfo.day === 'number' &&
        dateInfo.year > 0 &&
        dateInfo.month >= 1 &&
        dateInfo.month <= 12 &&
        dateInfo.day >= 1 &&
        dateInfo.day <= 31);
}
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 *
 * @param dateInfo - 日期資訊
 * @throws RangeError 當日期資訊無效時
 */
function _assertValidDateInfo(dateInfo) {
    /**
     * 以例外中止而非回傳 false：此函式用於 parsed result 的驗證，
     * 失敗代表內部解析已出錯，靜默通過會產生錯誤版本號
     */
    if (!isValidDateInfo(dateInfo))
        throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 *
 * @param dateInfo - 日期資訊
 * @throws RangeError 當日期資訊無效時
 */
function assertValidDateInfo(dateInfo) {
    /**
     * 與 _assertValidDateInfo 行為相同，公開版本供外部使用；
     * 失敗時以例外中止，避免錯誤日期流入版本號產生流程
     */
    if (!isValidDateInfo(dateInfo))
        throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}
/**
 * 驗證季度是否有效
 *
 * @param quarter - 季度
 * @returns 是否有效
 */
function isValidQuarter(quarter) {
    return typeof quarter === 'number' && quarter >= 1 && quarter <= 4;
}
/**
 * 驗證季度是否有效，若無效則拋出錯誤
 *
 * @param quarter - 季度
 */
function assertValidQuarter(quarter) {
    /**
     * 季度只允許整數 1-4；超出範圍通常代表年份編碼解析錯誤（末位非季度）
     */
    if (!isValidQuarter(quarter)) {
        throw new RangeError(`Invalid Quarter: quarter(1-4)=${quarter} must be a valid number.`);
    }
}
/**
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 JetBrains 樣式
 */
function _isJetbrainsStyleFromStyle(style) {
    return style === types_1.EnumVersionStyle.JetbrainsShort
        || style === types_1.EnumVersionStyle.JetbrainsShortMD
        || style === types_1.EnumVersionStyle.Y2KDateTime
        || style === types_1.EnumVersionStyle.JetbrainsDateTime;
}
/**
 * 從版本樣式判斷是否使用月日合併格式
 *
 * @param style - 版本樣式
 * @returns 是否使用 MD 格式
 */
function _isMDCombinedFromStyle(style) {
    return style === types_1.EnumVersionStyle.JetbrainsShortMD
        || style === types_1.EnumVersionStyle.StandardFullMD
        || style === types_1.EnumVersionStyle.Y2KDateTime
        || style === types_1.EnumVersionStyle.JetbrainsDateTime;
}
/**
 * 從版本樣式判斷是否為日期時間樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 JetbrainsDateTime 或 Y2KDateTime 樣式
 */
function _isDateTimeStyleFromStyle(style) {
    return style === types_1.EnumVersionStyle.Y2KDateTime
        || style === types_1.EnumVersionStyle.JetbrainsDateTime;
}
/**
 * 從版本樣式判斷是否為 y2k 日期時間樣式
 *
 * @param style - 版本樣式
 * @returns 是否為 Y2KDateTime 樣式
 */
function _isY2KDateTimeStyleFromStyle(style) {
    return style === types_1.EnumVersionStyle.Y2KDateTime;
}
//# sourceMappingURL=assert.js.map
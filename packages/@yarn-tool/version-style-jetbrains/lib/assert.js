"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDateInfo = isValidDateInfo;
exports._assertValidDateInfo = _assertValidDateInfo;
exports.assertValidDateInfo = assertValidDateInfo;
exports.isValidQuarter = isValidQuarter;
exports.assertValidQuarter = assertValidQuarter;
exports._isJetbrainsStyleFromStyle = _isJetbrainsStyleFromStyle;
exports._isMDCombinedFromStyle = _isMDCombinedFromStyle;
const types_1 = require("./types");
/**
 * 驗證日期資訊是否完整
 * Validate date info completeness
 *
 * @param dateInfo - 日期資訊 / Date info
 * @returns 是否有效 / Whether valid
 */
function isValidDateInfo(dateInfo) {
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
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
function _assertValidDateInfo(dateInfo) {
    if (!isValidDateInfo(dateInfo))
        throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}
/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
function assertValidDateInfo(dateInfo) {
    if (!isValidDateInfo(dateInfo))
        throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}
/**
 * 驗證季度是否有效
 * Validate quarter is valid
 *
 * @param quarter - 季度 / Quarter
 * @returns 是否有效 / Whether valid
 */
function isValidQuarter(quarter) {
    return typeof quarter === 'number' && quarter >= 1 && quarter <= 4;
}
/**
 * 驗證季度是否有效，若無效則拋出錯誤
 * Assert quarter is valid, throw error if invalid
 *
 * @param quarter - 季度 / Quarter
 */
function assertValidQuarter(quarter) {
    if (!isValidQuarter(quarter)) {
        throw new RangeError(`Invalid Quarter: quarter(1-4)=${quarter} must be a valid number.`);
    }
}
/**
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 * Determine if style is JetBrains short year style
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否為 JetBrains 樣式 / Whether it is JetBrains style
 */
function _isJetbrainsStyleFromStyle(style) {
    return style === types_1.EnumVersionStyle.JetbrainsShort || style === types_1.EnumVersionStyle.JetbrainsShortMD;
}
/**
 * 從版本樣式判斷是否使用月日合併格式
 * Determine if style uses month-day combined format
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否使用 MD 格式 / Whether using MD format
 */
function _isMDCombinedFromStyle(style) {
    return style === types_1.EnumVersionStyle.JetbrainsShortMD || style === types_1.EnumVersionStyle.StandardFullMD;
}
//# sourceMappingURL=assert.js.map
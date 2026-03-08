"use strict";
/**
 * 版本樣式輔助函數
 * Version style helper functions
 *
 * 內部使用的輔助函數
 * Internal helper functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseStandardFullVersion = _parseStandardFullVersion;
exports._parseJetbrainsVersion = _parseJetbrainsVersion;
exports._parseVersion = _parseVersion;
const assert_1 = require("./assert");
const date_1 = require("./date");
/**
 * 解析標準完整年份格式版本號
 * Parse standard full year format version
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
function _parseStandardFullVersion(version) {
    const standardFullMatch = version.match(/^(\d{4})\.(\d+)\.(\d+)(?:-(\d+))?$/);
    if (!standardFullMatch) {
        return null;
    }
    const [, yearStr, monthOrMD, dayOrIncrement, increment] = standardFullMatch;
    const year = parseInt(yearStr, 10);
    // 使用輔助函數解析月日資訊
    const { month, day, dailyVersion, isMDCombined } = (0, date_1._parseMonthDayInfo)(monthOrMD, dayOrIncrement, increment);
    return {
        year,
        month,
        day,
        dailyVersion,
        isJetbrainsShort: false,
        isMDCombined,
    };
}
/**
 * 解析 JetBrains 短年份格式版本號
 * Parse JetBrains short year format version
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
function _parseJetbrainsVersion(version) {
    const jetbrainsMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);
    if (!jetbrainsMatch) {
        return null;
    }
    const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;
    // 使用輔助函數解析 JetBrains 年份和季度
    const { year } = (0, date_1._parseJetbrainsYearQuarter)(yearQuarterStr);
    // 使用輔助函數解析月日資訊
    const { month, day, dailyVersion, isMDCombined } = (0, date_1._parseMonthDayInfo)(monthOrMD, dayOrIncrement, increment);
    return {
        year,
        month,
        day,
        dailyVersion,
        isJetbrainsShort: true,
        isMDCombined,
    };
}
/**
 * 解析版本號（內部函數）
 * Parse version string (internal function)
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
function _parseVersion(version) {
    // 嘗試解析標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
    let result = _parseStandardFullVersion(version);
    if (!result) {
        // 嘗試解析 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
        result = _parseJetbrainsVersion(version);
    }
    if (result) {
        (0, assert_1._assertValidDateInfo)(result);
        return result;
    }
    return null;
}
//# sourceMappingURL=helpers.js.map
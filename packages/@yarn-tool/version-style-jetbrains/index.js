"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleVersionStyleOptions = void 0;
exports.parseVersion = parseVersion;
exports.dateToVersion = dateToVersion;
exports.dateToVersionByStyle = dateToVersionByStyle;
exports.getNextDayVersion = getNextDayVersion;
exports.incrementVersion = incrementVersion;
exports.isTodayVersion = isTodayVersion;
exports.getNextVersion = getNextVersion;
exports.generateAllStyleVersions = generateAllStyleVersions;
const tslib_1 = require("tslib");
/**
 * 基於日期的版本編號生成器核心模組
 * Date-based version style generator core module
 *
 * 支援的版本格式:
 * - 261.1.1-1   => 2026年.一月.一號 - 當日第一版 (年=26+235)
 * - 261.101.1  => 2026年.一月一號.當日第一版 (年=26+235, 月日=101)
 * - 2026.101.1 => 2026年.一月一號.當日第一版 (年=2026, 月日=101)
 * - 2026.1.1-1  => 2026年.一月.一號 - 當日第一版 (年=2026, 月=1, 日=1)
 */
const types_1 = require("./lib/types");
const options_1 = require("./lib/options");
const core_1 = require("./lib/core");
const date_1 = require("./lib/date");
const helpers_1 = require("./lib/helpers");
const assert_1 = require("./lib/assert");
tslib_1.__exportStar(require("./lib/types"), exports);
var options_2 = require("./lib/options");
Object.defineProperty(exports, "_handleVersionStyleOptions", { enumerable: true, get: function () { return options_2._handleVersionStyleOptions; } });
/**
 * 解析版本號
 * Parse version string
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
function parseVersion(version) {
    // 嘗試解析標準格式: YYYY.M.D-increment 或 YYYY.MD.increment
    let result = (0, helpers_1._parseStandardFullVersion)(version);
    if (!result) {
        // 嘗試解析 JetBrains 短年份格式: YY+OFFSET.M.D-increment 或 YY+OFFSET.MD.increment
        result = (0, helpers_1._parseJetbrainsVersion)(version);
    }
    if (result) {
        (0, assert_1._assertValidDateInfo)(result);
        return result;
    }
    return null;
}
/**
 * 將日期轉換為版本字串
 * Convert date to version string
 *
 * @param options - 選項 / Options
 * @returns 版本字串 / Version string
 */
function dateToVersion(options) {
    const processed = (0, options_1._handleVersionStyleOptions)(options);
    const { year, month, day } = (0, date_1._getDateInfoFromDayjs)(processed.date);
    const { dailyIncrement, disableDailyVersionSuffix, style } = processed;
    return (0, core_1._dateToVersionByStyleCore)(style, {
        year,
        month,
        day,
        dailyIncrement,
        disableDailyVersionSuffix,
    });
}
/**
 * 根據樣式將日期轉換為版本字串
 * Convert date to version string by style
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options
 * @returns 版本字串 / Version string
 */
function dateToVersionByStyle(style, options) {
    const processed = (0, options_1._handleVersionStyleOptions)(options);
    return (0, core_1._dateToVersionByStyleCore)(style, processed);
}
/**
 * 取得下一天版本號
 * Get next day version
 *
 * @param currentVersion - 目前版本號 / Current version
 * @returns 新版本號 / New version
 */
function getNextDayVersion(currentVersion) {
    const parsed = parseVersion(currentVersion);
    if (!parsed) {
        return dateToVersion({});
    }
    const { year, month, day, isJetbrainsShort, isMDCombined } = parsed;
    let nextDay = day + 1;
    let nextMonth = month;
    let nextYear = year;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (nextDay > daysInMonth) {
        nextDay = 1;
        nextMonth = month + 1;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear = year + 1;
        }
    }
    const style = (0, options_1._getStyleFromFlags)(isJetbrainsShort, isMDCombined);
    return (0, core_1._dateToVersionByStyleCore)(style, {
        year: nextYear,
        month: nextMonth,
        day: nextDay,
        dailyIncrement: 1,
    });
}
/**
 * 遞增版本號的當日計數
 * Increment daily version count
 *
 * @param currentVersion - 目前版本號 / Current version
 * @returns 遞增後的版本號 / Incremented version
 */
function incrementVersion(currentVersion) {
    const parsed = parseVersion(currentVersion);
    if (!parsed) {
        return dateToVersion({});
    }
    const { year, month, day, dailyVersion, isJetbrainsShort, isMDCombined } = parsed;
    const style = (0, options_1._getStyleFromFlags)(isJetbrainsShort, isMDCombined);
    return (0, core_1._dateToVersionByStyleCore)(style, {
        year,
        month,
        day,
        dailyIncrement: dailyVersion + 1,
    });
}
/**
 * 檢查版本號是否為今天的日期
 * Check if version is today's date
 *
 * @param version - 版本號 / Version
 * @param optionsOrDate - 選項或日期 / Options or Date
 * @returns 是否為今天的版本 / Whether it's today's version
 */
function isTodayVersion(version, optionsOrDate) {
    const parsed = parseVersion(version);
    if (!parsed) {
        return false;
    }
    const compareDate = (0, options_1._handleVersionStyleOptions)(optionsOrDate).date;
    return parsed.year === compareDate.year()
        && parsed.month === compareDate.month() + 1
        && parsed.day === compareDate.date();
}
/**
 * 從現有版本號取得下個版本
 * Get next version from existing version
 *
 * @param options - 選項 / Options
 * @returns 下一個版本號 / Next version
 */
function getNextVersion(options) {
    var _a;
    const processed = (0, options_1._handleVersionStyleOptions)(options);
    const { disableDailyVersionSuffix, style, throwOnError } = processed;
    let parsed;
    try {
        (_a = processed.throwOnError) !== null && _a !== void 0 ? _a : (processed.throwOnError = true);
        parsed = (0, options_1._getParsedVersionFromOptions)(processed);
    }
    catch (e) {
        if (throwOnError) {
            throw e;
        }
        return dateToVersion(processed);
    }
    return (0, core_1._dateToVersionByStyleCore)(style, {
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        dailyIncrement: parsed.dailyVersion + 1,
        disableDailyVersionSuffix,
    });
}
/**
 * 產生所有格式的版本號
 * Generate version in all formats
 *
 * @param options - 選項 / Options
 * @returns 包含所有格式版本號的物件 / Object with all format versions
 */
function generateAllStyleVersions(options) {
    const processed = (0, options_1._handleVersionStyleOptions)(options);
    const { year, month, day } = (0, date_1._getDateInfoFromDayjs)(processed.date);
    const { dailyIncrement, disableDailyVersionSuffix } = processed;
    return {
        [types_1.EnumVersionStyle.JetbrainsShort]: (0, core_1._dateToVersionByStyleCore)(types_1.EnumVersionStyle.JetbrainsShort, {
            year,
            month,
            day,
            dailyIncrement,
            disableDailyVersionSuffix,
        }),
        [types_1.EnumVersionStyle.JetbrainsShortMD]: (0, core_1._dateToVersionByStyleCore)(types_1.EnumVersionStyle.JetbrainsShortMD, {
            year,
            month,
            day,
            dailyIncrement,
            disableDailyVersionSuffix,
        }),
        [types_1.EnumVersionStyle.StandardFull]: (0, core_1._dateToVersionByStyleCore)(types_1.EnumVersionStyle.StandardFull, {
            year,
            month,
            day,
            dailyIncrement,
            disableDailyVersionSuffix,
        }),
        [types_1.EnumVersionStyle.StandardFullMD]: (0, core_1._dateToVersionByStyleCore)(types_1.EnumVersionStyle.StandardFullMD, {
            year,
            month,
            day,
            dailyIncrement,
            disableDailyVersionSuffix,
        }),
    };
}
//# sourceMappingURL=index.js.map
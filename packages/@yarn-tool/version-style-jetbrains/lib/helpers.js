"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseJetbrainsDateTime = _parseJetbrainsDateTime;
exports._parseY2KDateTime = _parseY2KDateTime;
exports._parseStandardFullVersion = _parseStandardFullVersion;
exports._parseJetbrainsVersion = _parseJetbrainsVersion;
exports._parseJetbrainsShort = _parseJetbrainsShort;
const assert_1 = require("./assert");
const date_1 = require("./date");
/**
 * 解析 JetBrains 日期時間樣式版本號
 *
 * 格式: YYQ.MMDD.HHmm 或 YYQ.MMDD.HHmm-increment
 * 例如: 264.1120.1744-1 表示 2026年Q4 11 月 20 日 17:44 第一版
 *
 * 首段末位須為合法季度 (1-4) 才屬於此樣式；
 * 與 y2k 樣式 (2YY) 同時符合時以此樣式優先
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
function _parseJetbrainsDateTime(version) {
    const dateTimeMatch = version.match(/^(\d{3})\.(\d{3,4})\.(\d{4})(?:-(\d+))?$/);
    /** 格式不符即回傳 null，交由上層改嘗試其他格式 */
    if (!dateTimeMatch) {
        return null;
    }
    const [, yearQuarterStr, monthDayStr, timeStr, increment] = dateTimeMatch;
    /** 首段為「年份後兩位 + 季度」的壓縮編碼，需還原成完整年份與季度 */
    const { year, quarter } = (0, date_1._parseJetbrainsYearQuarter)(yearQuarterStr);
    /** 末位非季度 (1-4) 即非 YYQ 編碼，交由 y2k 樣式 (2YY) 嘗試 */
    if (!(0, assert_1.isValidQuarter)(quarter)) {
        return null;
    }
    /**
     * 第三段非合法時分時不認定為日期時間樣式，
     * 讓 YYQ.MD.遞增 與 YYQ.MMDD.HHmm 的重疊格式交給既有樣式解析
     */
    const time = (0, date_1._parseTimeFromHHmm)(timeStr);
    if (!time) {
        return null;
    }
    /** 第二段為月日合併 (月*100+日)：1120 表示 11 月 20 日、101 表示 1 月 1 日 */
    const { month, day } = (0, date_1._parseMonthDayFromMD)(monthDayStr);
    return {
        year,
        month,
        day,
        dailyVersion: increment ? parseInt(increment, 10) : 1,
        hour: time.hour,
        minute: time.minute,
        isJetbrainsShort: true,
        isMDCombined: true,
        isDateTime: true,
    };
}
/**
 * 解析 y2k 日期時間樣式版本號
 *
 * 格式: 2YY.MMDD.HHmm 或 2YY.MMDD.HHmm-increment
 * 例如: 226.1120.1744-1 表示 2026 年 11 月 20 日 17:44 第一版
 * 首段 226 取自年份 2026 的第一個 2 與年份後兩位，2100 起不支援
 *
 * 與 JetBrains 樣式 (YYQ) 同時符合時由 JetBrains 樣式優先，此樣式只接手末位非季度的編碼
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
function _parseY2KDateTime(version) {
    const dateTimeMatch = version.match(/^(\d{3})\.(\d{3,4})\.(\d{4})(?:-(\d+))?$/);
    /** 格式不符即回傳 null，交由上層改嘗試其他格式 */
    if (!dateTimeMatch) {
        return null;
    }
    const [, yearCodeStr, monthDayStr, timeStr, increment] = dateTimeMatch;
    const yearCode = parseInt(yearCodeStr, 10);
    /** 年份編碼須落在支援年份範圍推導出的區間內，其餘數值不屬於日期時間樣式 */
    if (yearCode < date_1.Y2K_DATETIME_YEAR_CODE_MIN || yearCode > date_1.Y2K_DATETIME_YEAR_CODE_MAX) {
        return null;
    }
    /**
     * 第三段非合法時分時不認定為日期時間樣式，
     * 讓 YYQ.MD.遞增 與 2YY.MMDD.HHmm 的重疊格式交給既有樣式解析
     */
    const time = (0, date_1._parseTimeFromHHmm)(timeStr);
    if (!time) {
        return null;
    }
    /** 第二段為月日合併 (月*100+日)：1120 表示 11 月 20 日、101 表示 1 月 1 日 */
    const { month, day } = (0, date_1._parseMonthDayFromMD)(monthDayStr);
    return {
        year: (0, date_1._parseY2KDateTimeYear)(yearCode),
        month,
        day,
        dailyVersion: increment ? parseInt(increment, 10) : 1,
        hour: time.hour,
        minute: time.minute,
        isJetbrainsShort: true,
        isMDCombined: true,
        isDateTime: true,
        isY2KDateTime: true,
    };
}
/**
 * 解析標準完整年份格式版本號
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
function _parseStandardFullVersion(version) {
    const standardFullMatch = version.match(/^(\d{4})\.(\d+)\.(\d+)(?:-(\d+))?$/);
    /** 格式不符即回傳 null，交由上層改嘗試其他格式 */
    if (!standardFullMatch) {
        return null;
    }
    const [, yearStr, monthOrMD, dayOrIncrement, increment] = standardFullMatch;
    const year = parseInt(yearStr, 10);
    /** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 */
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
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
function _parseJetbrainsVersion(version) {
    const jetbrainsMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);
    /** 格式不符即回傳 null，交由上層決定是否改用其他格式 */
    if (!jetbrainsMatch) {
        return null;
    }
    const [, yearQuarterStr, monthOrMD, dayOrIncrement, increment] = jetbrainsMatch;
    /** 首段為「年份後兩位 + 季度」的壓縮編碼，需還原成完整年份 */
    const { year } = (0, date_1._parseJetbrainsYearQuarter)(yearQuarterStr);
    /** 月日部分可能是「月.日」或合併的「月日」數字，交給共用輔助函式判定 */
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
 * 解析 JetBrains 短樣式，並要求首段為合法 YYQ 編碼
 *
 * `_parseJetbrainsVersion` 的正則允許任意位數首段，4 位年份 (2026.101.1)
 * 與非季度末碼 (266.1.1-1) 會被誤判成短樣式，分析時先擋下才能給出正確的符合風格
 *
 * @param version - 版本號字串
 * @returns 解析結果，首段非合法 YYQ 編碼時回傳 null
 */
function _parseJetbrainsShort(version) {
    const yearQuarterMatch = version.match(/^(\d+)\./);
    /** 首段不存在即非三段式版本 */
    if (!yearQuarterMatch) {
        return null;
    }
    const { quarter } = (0, date_1._parseJetbrainsYearQuarter)(yearQuarterMatch[1]);
    /** 末位非季度 (1-4) 即非 YYQ 編碼，交由其他風格接手 */
    if (!(0, assert_1.isValidQuarter)(quarter)) {
        return null;
    }
    return _parseJetbrainsVersion(version);
}
//# sourceMappingURL=helpers.js.map
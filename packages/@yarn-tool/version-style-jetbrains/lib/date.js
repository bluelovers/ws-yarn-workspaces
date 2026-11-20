"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Y2K_DATETIME_YEAR_CODE_MAX = exports.Y2K_DATETIME_YEAR_CODE_MIN = exports.JETBRAINS_DATETIME_YEAR_MAX = exports.JETBRAINS_DATETIME_YEAR_MIN = void 0;
exports.getQuarterFromMonth = getQuarterFromMonth;
exports.getJetbrainsYearCode = getJetbrainsYearCode;
exports.getY2KDateTimeYearCode = getY2KDateTimeYearCode;
exports._parseY2KDateTimeYear = _parseY2KDateTimeYear;
exports._parseTimeFromHHmm = _parseTimeFromHHmm;
exports._formatTimeToHHmm = _formatTimeToHHmm;
exports.getMonthCode = getMonthCode;
exports.getMonthDayCode = getMonthDayCode;
exports._parseMonthDayFromMD = _parseMonthDayFromMD;
exports._detectIsMDCombined = _detectIsMDCombined;
exports._parseMonthDayInfo = _parseMonthDayInfo;
exports._parseJetbrainsYearQuarter = _parseJetbrainsYearQuarter;
exports.getDayjsFromInput = getDayjsFromInput;
exports._getDateInfoFromDate = _getDateInfoFromDate;
exports._getDateInfoFromDayjs = _getDateInfoFromDayjs;
exports._getDateInfoFromOptions = _getDateInfoFromOptions;
const dayjs_1 = require("dayjs");
const dayjs_tz_helper_1 = require("dayjs-tz-helper");
const assert_1 = require("./assert");
const options_1 = require("./options");
/**
 * 從月份取得季度
 *
 * @param month - 月份 (1-12)
 * @returns 季度 (1-4)
 */
function getQuarterFromMonth(month) {
    return Math.ceil(month / 3);
}
/**
 * 根據年份和季度取得 JetBrains 風格的年份編碼
 *
 * @param year - 年份
 * @param quarter - 季度 (1-4)
 * @returns 年份編碼 (如 261 表示 2026年Q1)
 */
function getJetbrainsYearCode(year, quarter) {
    return (year % 100) * 10 + quarter;
}
/** 此模式僅支援的年份下界 */
exports.JETBRAINS_DATETIME_YEAR_MIN = 2000;
/**
 * 此模式僅支援的年份上界
 *
 * 編碼只保留年份後兩位，2100 年代會與 2000 年代產生相同編碼，故止於 2099
 */
exports.JETBRAINS_DATETIME_YEAR_MAX = 2099;
/** 四位年份的千位權重，用於取出年份首位數字 */
const YEAR_THOUSANDS = 1000;
/** 年份編碼的百位權重，編碼由年份首位數字與年份後兩位組成 */
const DATETIME_YEAR_CODE_HUNDREDS = 100;
/**
 * 取出四位年份的首位數字 (2026 -> 2)
 *
 * @param year - 年份
 * @returns 年份首位數字
 */
function _getYearLeadingDigit(year) {
    return Math.floor(year / YEAR_THOUSANDS);
}
/**
 * 根據年份取得日期時間樣式的年份編碼
 *
 * 編碼由年份首位數字 (2026 的 2) 與年份後兩位組成，故 2026 -> 226；
 * 與 YYQ 季度編碼 (261) 分開，因為此樣式第三段已是時間，不再需要季度資訊
 *
 * @param year - 年份
 * @returns 年份編碼 (如 226 表示 2026 年)
 */
function getY2KDateTimeYearCode(year) {
    return _getYearLeadingDigit(year) * DATETIME_YEAR_CODE_HUNDREDS + (year % DATETIME_YEAR_CODE_HUNDREDS);
}
/**
 * 從年份編碼還原日期時間樣式的年份
 *
 * 組碼時被捨棄的百位數以 0 還原 (226 -> 2026)，故僅於支援年份範圍內成立
 *
 * @param yearCode - 年份編碼 (200-299)
 * @returns 年份 (2000-2099)
 */
function _parseY2KDateTimeYear(yearCode) {
    return Math.floor(yearCode / DATETIME_YEAR_CODE_HUNDREDS) * YEAR_THOUSANDS + (yearCode % DATETIME_YEAR_CODE_HUNDREDS);
}
/** 支援年份範圍對應的年份編碼下界 (200)，由年份規則推導而非寫死 */
exports.Y2K_DATETIME_YEAR_CODE_MIN = getY2KDateTimeYearCode(exports.JETBRAINS_DATETIME_YEAR_MIN);
/** 支援年份範圍對應的年份編碼上界 (299)，由年份規則推導而非寫死 */
exports.Y2K_DATETIME_YEAR_CODE_MAX = getY2KDateTimeYearCode(exports.JETBRAINS_DATETIME_YEAR_MAX);
/**
 * 從 HHmm 四位數字解析時分
 *
 * 例如: 1744 -> hour=17, minute=44; 0005 -> hour=0, minute=5
 *
 * @param timeStr - 時間字串 (HHmm)
 * @returns 時分資訊，格式不合法時回傳 null
 */
function _parseTimeFromHHmm(timeStr) {
    /** 嚴格限四碼，避免 "174" 這類殘缺數字被當成時間 */
    if (!/^\d{4}$/.test(timeStr)) {
        return null;
    }
    const hour = Math.floor(parseInt(timeStr, 10) / 100);
    const minute = parseInt(timeStr, 10) % 100;
    /** 時分超出範圍即非時間格式，交由呼叫端決定是否改用其他樣式解析 */
    if (hour > 23 || minute > 59) {
        return null;
    }
    return { hour, minute };
}
/**
 * 以兩位數補零格式化時分
 *
 * @param hour - 小時 (0-23)
 * @param minute - 分鐘 (0-59)
 * @returns HHmm 字串 (如 "1744")
 */
function _formatTimeToHHmm(hour, minute) {
    return `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
}
/** 月日合併編碼的百位權重：月 * 100 + 日 */
const MONTH_DAY_HUNDREDS = 100;
/**
 * 取得月份區段編碼
 *
 * 為月日合併編碼的高位部分，供組合月日編碼時使用 (11 -> 1100)
 *
 * @param month - 月份 (1-12)
 * @returns 月份區段編碼
 */
function getMonthCode(month) {
    return month * MONTH_DAY_HUNDREDS;
}
/**
 * 取得月日合併編碼
 *
 * 以「月 * 100 + 日」壓縮月日 (11, 20 -> 1120)，與 _parseMonthDayFromMD 互為反運算
 *
 * @param month - 月份 (1-12)
 * @param day - 日期 (1-31)
 * @returns 月日合併編碼
 */
function getMonthDayCode(month, day) {
    return getMonthCode(month) + day;
}
/**
 * 從月日合併數字解析月日資訊
 *
 * 將三位或四位數的月日合併數字解析為月份和日期
 * 例如: 101 -> month=1, day=1; 615 -> month=6, day=15
 *
 * @param monthDay - 月日合併數字 (如 101, 615, 1231)
 * @returns 月日資訊
 */
function _parseMonthDayFromMD(monthDay) {
    /** 調用端可能傳入字串（如 regex 捕獲組），先統一轉為數字 */
    if (typeof monthDay === 'string') {
        monthDay = parseInt(monthDay, 10);
    }
    /** 以百位切分月與日：101 -> 1 月 1 日、615 -> 6 月 15 日 */
    const month = Math.floor(monthDay / MONTH_DAY_HUNDREDS);
    const day = monthDay % MONTH_DAY_HUNDREDS;
    return {
        month,
        day,
    };
}
/**
 * 判斷是否為月日合併格式 (MD > 12)
 *
 * 由於月日合併格式中，月日數值必須大於 12 才能與標準格式區分
 * 例如: 101 表示 1月1日，而 115 表示 1月15日
 *
 * @param monthOrMD - 月份或月日合併字串
 * @returns 檢測結果
 */
function _detectIsMDCombined(monthOrMD) {
    /**
     * 判斷是否為月日合併格式 (MD > 12)：
     * 標準格式的「月」最多 12，因此大於 12 必為合併數字（如 101 = 1月1日）
     */
    const monthDay = parseInt(monthOrMD, 10);
    const isMDCombined = monthDay > 12;
    return {
        monthDay,
        isMDCombined,
    };
}
/**
 * 從版本字串的月份/日部分解析月日資訊
 *
 * @param monthOrMD - 月份或月日合併字串
 * @param dayOrIncrement - 日或遞增部分
 * @param increment - 遞增部分（可選）
 * @returns 解析後的月日資訊
 */
function _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment) {
    const { monthDay, isMDCombined } = _detectIsMDCombined(monthOrMD);
    let month;
    let day;
    let dailyVersion;
    if (isMDCombined) {
        /** 格式: YYYY.MD.increment 或 YYQ.MD.increment，第三段才是遞增號 */
        ({ month, day } = _parseMonthDayFromMD(monthDay));
        dailyVersion = increment ? parseInt(increment, 10) : parseInt(dayOrIncrement, 10);
    }
    else {
        /**
         * 格式: YYYY.M.D-increment 或 YYQ.M.D-increment；
         * 缺少日或遞增段時回退到 1，視為最小合法版本
         */
        month = monthOrMD ? parseInt(monthOrMD, 10) : 1;
        day = dayOrIncrement ? parseInt(dayOrIncrement, 10) : 1;
        dailyVersion = increment ? parseInt(increment, 10) : 1;
    }
    return { month, day, dailyVersion, isMDCombined };
}
/**
 * 從版本字串解析 JetBrains 年份和季度
 *
 * yearQuarter = (year % 100) * 10 + quarter
 * 所以: quarter = yearQuarter % 10, year = 2000 + floor(yearQuarter / 10)
 *
 * @param yearQuarterStr - 年份季度字串 (e.g., "261")
 * @returns 解析後的年份和季度
 */
function _parseJetbrainsYearQuarter(yearQuarterStr) {
    const yearQuarter = parseInt(yearQuarterStr, 10);
    /** 末位為季度、其餘為年份後兩位，故以 % 10 取季度 */
    const quarter = yearQuarter % 10;
    /** 年份固定補回 2000 年代：JetBrains 短格式只存兩位年 */
    const year = 2000 + Math.floor(yearQuarter / 10);
    return { year, quarter };
}
/**
 * 從輸入取得 dayjs 物件
 *
 * 支援從多种输入类型转换为 dayjs 对象
 *
 * @param date - 日期輸入 (Dayjs | Date | number | string | IDateInfo)
 * @param opts - dayjs 選項
 * @returns dayjs 物件
 */
function getDayjsFromInput(date, opts) {
    /**
     * 物件型別需再細分：Dayjs、Date、IDateInfo 三者的解析方式不同，
     * 統一交給 tzDayjsSafeParse 可保留時區 (Timezone) 資訊
     */
    if (typeof date === 'object') {
        if ((0, dayjs_1.isDayjs)(date)) {
            return (0, dayjs_tz_helper_1.tzDayjsSafeParse)(date, opts);
        }
        else if (date instanceof Date) {
            return (0, dayjs_tz_helper_1.tzDayjsSafeParse)(date, opts);
        }
        else if ((0, assert_1.isValidDateInfo)(date)) {
            /** IDateInfo 沒有時區資訊，以字串組合後交由 safeParse 處理 */
            return (0, dayjs_tz_helper_1.tzDayjsSafeParse)(`${date.year}-${date.month}-${date.day}`, opts);
        }
    }
    else if (typeof date === 'string' || typeof date === 'number') {
        /** 字串或 timestamp：交給 safeParse 嘗試多種格式 */
        return (0, dayjs_tz_helper_1.tzDayjsSafeParse)(date, opts);
    }
    /**
     * 未知或無效輸入回傳 null（而非拋錯），
     * 由 _handleVersionStyleOptionsCore 以 new Date() 取代
     */
    return null;
}
/**
 * 從 Date 物件取得日期資訊
 *
 * 將 JavaScript Date 物件轉換為 IDateInfo 格式
 *
 * @param date - Date 物件
 * @returns 日期資訊
 *
 * @deprecated 建議使用 _getDateInfoFromDayjs
 */
function _getDateInfoFromDate(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };
}
/**
 * 從 dayjs 物件取得日期資訊
 *
 * 將 dayjs 物件轉換為 IDateInfo 格式
 * 注意: dayjs 的月份是 0-based，需要轉換為 1-based
 *
 * @param date - dayjs 物件
 * @returns 日期資訊
 */
function _getDateInfoFromDayjs(date) {
    return {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
    };
}
/**
 * 從選項取得日期資訊
 *
 * @param options - 選項
 * @returns 日期資訊
 *
 * @deprecated 當 options 確定經過 _handleVersionStyleOptionsCore 或 _handleVersionStyleOptions 處理過時可以直接使用 _getDateInfoFromDayjs
 */
function _getDateInfoFromOptions(options) {
    var _a;
    /**
     * 相容兩種呼叫方式：傳整個 options 時取其 .date，
     * 傳純日期時直接當日期使用，最後統一經 _getDateInfoFromDayjs 取年月日
     */
    let date = (0, options_1._handleVersionStyleOptionsCore)((_a = options === null || options === void 0 ? void 0 : options.date) !== null && _a !== void 0 ? _a : options).date;
    return _getDateInfoFromDayjs(date);
}
//# sourceMappingURL=date.js.map
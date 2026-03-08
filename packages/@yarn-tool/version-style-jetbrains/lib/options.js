"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getStyleFromFlags = _getStyleFromFlags;
exports._handleVersionStyleOptionsCore = _handleVersionStyleOptionsCore;
exports._getParsedVersionFromOptions = _getParsedVersionFromOptions;
exports._handleVersionStyleOptions = _handleVersionStyleOptions;
const types_1 = require("./types");
const date_1 = require("./date");
const assert_1 = require("./assert");
const helpers_1 = require("./helpers");
/**
 * 從 isJetbrainsShort 和 isMDCombined 取得對應的版本樣式
 * Get version style from isJetbrainsShort and isMDCombined
 *
 * @param isJetbrainsShort - 是否為 JetBrains 樣式 / Whether it is JetBrains style
 * @param isMDCombined - 是否使用月日合併格式 / Whether using MD format
 * @returns 版本樣式 / Version style
 */
function _getStyleFromFlags(isJetbrainsShort, isMDCombined) {
    if (isJetbrainsShort) {
        return isMDCombined ? types_1.EnumVersionStyle.JetbrainsShortMD : types_1.EnumVersionStyle.JetbrainsShort;
    }
    return isMDCombined ? types_1.EnumVersionStyle.StandardFullMD : types_1.EnumVersionStyle.StandardFull;
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
function _handleVersionStyleOptionsCore(optionsOrDate) {
    // 取得日期
    let date;
    let options = {};
    if (!optionsOrDate) {
        //
    }
    else if (typeof optionsOrDate === 'number' || typeof optionsOrDate === 'string') {
        date = optionsOrDate;
    }
    else if (optionsOrDate instanceof Date) {
        // 已經是 Date 物件
        date = optionsOrDate;
    }
    else if ('date' in optionsOrDate) {
        date = optionsOrDate.date;
        options = optionsOrDate;
    }
    else if (typeof optionsOrDate === 'object') {
        options = optionsOrDate;
    }
    options = {
        ...options,
        date: (0, date_1.getDayjsFromInput)(date !== null && date !== void 0 ? date : new Date(), options.dateOptions),
    };
    return options;
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
function _getParsedVersionFromOptions(processed) {
    // 優先使用 currentVersion
    if (processed.currentVersion) {
        const parsed = (0, helpers_1._parseVersion)(processed.currentVersion);
        if (parsed) {
            return parsed;
        }
        if (processed.throwOnError) {
            throw new RangeError(`Failed to parse currentVersion: ${processed.currentVersion}`);
        }
    }
    // 從 processed 取得日期資訊
    const { date, style } = processed;
    const dateInfo = (0, date_1._getDateInfoFromDayjs)(date);
    // 沒有 currentVersion 時，直接從 dateInfo 和 style 建構結果
    // dailyVersion 預設為 1（新版本的初始值）
    // isJetbrainsShort 和 isMDCombined 可從 style 推斷
    return {
        ...dateInfo,
        dailyVersion: processed.dailyIncrement,
        isJetbrainsShort: (0, assert_1._isJetbrainsStyleFromStyle)(style),
        isMDCombined: (0, assert_1._isMDCombinedFromStyle)(style),
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
function _handleVersionStyleOptions(optionsOrDate) {
    var _a, _b, _c;
    const options = _handleVersionStyleOptionsCore(optionsOrDate);
    return {
        ...options,
        dailyIncrement: (_a = options.dailyIncrement) !== null && _a !== void 0 ? _a : 1,
        disableDailyVersionSuffix: (_b = options.disableDailyVersionSuffix) !== null && _b !== void 0 ? _b : false,
        style: (_c = options.style) !== null && _c !== void 0 ? _c : types_1.EnumVersionStyle.JetbrainsShortMD,
    };
}
//# sourceMappingURL=options.js.map
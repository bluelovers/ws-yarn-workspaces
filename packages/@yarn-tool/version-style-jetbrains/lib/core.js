"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._dateToVersionByStyleCore = _dateToVersionByStyleCore;
const types_1 = require("./types");
const date_1 = require("./date");
/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 * Convert date to version string by style (core function)
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options (year, month, day, dailyIncrement, disableDailyVersionSuffix)
 * @returns 版本字串 / Version string
 */
function _dateToVersionByStyleCore(style, options) {
    const { year, month, day, dailyIncrement, disableDailyVersionSuffix } = options;
    const quarter = (0, date_1.getQuarterFromMonth)(month);
    switch (style) {
        case types_1.EnumVersionStyle.JetbrainsShort:
            if (disableDailyVersionSuffix) {
                return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${month}.${day}`;
            }
            return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${month}.${day}-${dailyIncrement}`;
        case types_1.EnumVersionStyle.JetbrainsShortMD:
            return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${month * 100 + day}.${dailyIncrement}`;
        case types_1.EnumVersionStyle.StandardFull:
            if (disableDailyVersionSuffix) {
                return `${year}.${month}.${day}`;
            }
            return `${year}.${month}.${day}-${dailyIncrement}`;
        case types_1.EnumVersionStyle.StandardFullMD:
            return `${year}.${month * 100 + day}.${dailyIncrement}`;
        default:
            throw new Error(`Unknown version style: ${style}`);
    }
}
//# sourceMappingURL=core.js.map
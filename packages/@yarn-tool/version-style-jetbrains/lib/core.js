"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._dateToVersionByStyleCore = _dateToVersionByStyleCore;
const types_1 = require("./types");
const date_1 = require("./date");
/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 *
 * @param style - 版本樣式
 * @param options - 選項
 * @returns 版本字串
 */
function _dateToVersionByStyleCore(style, options) {
    const { year, month, day, dailyIncrement, disableDailyVersionSuffix, hour = 0, minute = 0 } = options;
    const quarter = (0, date_1.getQuarterFromMonth)(month);
    /**
     * 組出時間樣式版本字串：第三段以 HHmm 時分取代其他樣式的遞增段，
     * 遞增號退回為可省略的 -x 後綴（與 JetbrainsShort 同規則），
     * 集中避免兩種時間樣式各自實作而格式不一致
     *
     * @param yearCode - 各時間樣式自己的年份編碼 (YYQ 或 2YY)
     * @returns 版本字串
     */
    function buildDateTimeVersion(yearCode) {
        const timeVersion = `${yearCode}.${(0, date_1.getMonthDayCode)(month, day)}.${(0, date_1._formatTimeToHHmm)(hour, minute)}`;
        return disableDailyVersionSuffix ? timeVersion : `${timeVersion}-${dailyIncrement}`;
    }
    /**
     * 以 switch 而非查表：每種樣式的後綴規則不同（MD 樣式永不省略遞增號），
     * 集中在此可避免呼叫端各自實作而產生格式不一致
     */
    switch (style) {
        case types_1.EnumVersionStyle.JetbrainsShort:
            /**
             * 短樣式允許省略 -x 遞增後綴；這是兩種可省略樣式之一
             */
            if (disableDailyVersionSuffix) {
                return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${month}.${day}`;
            }
            return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${month}.${day}-${dailyIncrement}`;
        case types_1.EnumVersionStyle.JetbrainsShortMD:
            /**
             * MD 樣式以「月*100+日」壓縮月日，遞增號改用點分隔以避免與月日數字混淆
             */
            return `${(0, date_1.getJetbrainsYearCode)(year, quarter)}.${(0, date_1.getMonthDayCode)(month, day)}.${dailyIncrement}`;
        case types_1.EnumVersionStyle.StandardFull:
            /**
             * 與 JetbrainsShort 同規則，差別僅在年份使用完整四位年
             */
            if (disableDailyVersionSuffix) {
                return `${year}.${month}.${day}`;
            }
            return `${year}.${month}.${day}-${dailyIncrement}`;
        case types_1.EnumVersionStyle.StandardFullMD:
            return `${year}.${(0, date_1.getMonthDayCode)(month, day)}.${dailyIncrement}`;
        case types_1.EnumVersionStyle.Y2KDateTime:
            return buildDateTimeVersion((0, date_1.getY2KDateTimeYearCode)(year));
        case types_1.EnumVersionStyle.JetbrainsDateTime:
            return buildDateTimeVersion((0, date_1.getJetbrainsYearCode)(year, quarter));
        default:
            /**
             * 防禦性分支：此處只可能來自呼叫端傳入非列舉值，快速失敗比靜默產生錯誤版本號安全
             */
            throw new Error(`Unknown version style: ${style}`);
    }
}
//# sourceMappingURL=core.js.map
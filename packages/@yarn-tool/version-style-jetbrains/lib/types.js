"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumVersionStyle = void 0;
/**
 * 版本風格類型
 */
var EnumVersionStyle;
(function (EnumVersionStyle) {
    /**
     * JetBrains 短年份樣式
     *
     * @example 261.1.1-1
     */
    EnumVersionStyle["JetbrainsShort"] = "jetbrains-short";
    /**
     * 標準完整年份樣式
     *
     * @example 2026.1.1-1
     */
    EnumVersionStyle["StandardFull"] = "standard-full";
    /**
     * JetBrains 短年份 + 月日合併樣式
     *
     * @example 261.101.1
     */
    EnumVersionStyle["JetbrainsShortMD"] = "jetbrains-short-md";
    /**
     * 標準完整年份 + 月日合併樣式
     *
     * @example 2026.101.1
     */
    EnumVersionStyle["StandardFullMD"] = "standard-full-md";
    /**
     * y2k 年份 + 月日 + 時間樣式
     *
     * 首段取年份 (2026) 的第一個 2 與年份後兩位，第二段為月日 (MMDD)，第三段為時分 (HHmm)
     * 2100 起不支援
     *
     * @example 226.1120.1744-1
     * @example 226.1120.1744 (disableDailyVersionSuffix)
     */
    EnumVersionStyle["Y2KDateTime"] = "y2k-date-time";
    /**
     * JetBrains 年份季度 + 月日 + 時間樣式
     *
     * 首段為 YYQ (如 264 = 2026年Q4)，第二段為月日 (MMDD)，第三段為時分 (HHmm)
     *
     * @example 264.1120.1744-1
     * @example 264.1120.1744 (disableDailyVersionSuffix)
     */
    EnumVersionStyle["JetbrainsDateTime"] = "jetbrains-date-time";
})(EnumVersionStyle || (exports.EnumVersionStyle = EnumVersionStyle = {}));
//# sourceMappingURL=types.js.map
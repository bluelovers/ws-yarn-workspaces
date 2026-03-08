"use strict";
/**
 * 版本樣式類型定義
 * Version style type definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumVersionStyle = void 0;
/**
 * 版本風格類型
 * Version style types
 */
var EnumVersionStyle;
(function (EnumVersionStyle) {
    /**
     * JetBrains 短年份樣式
     * JetBrains short year style
     *
     * @example 261.1.1-1
     */
    EnumVersionStyle["JetbrainsShort"] = "jetbrains-short";
    /**
     * 標準完整年份樣式
     * Standard full year style
     *
     * @example 2026.1.1-1
     */
    EnumVersionStyle["StandardFull"] = "standard-full";
    /**
     * JetBrains 短年份 + 月日合併樣式
     * JetBrains short year with combined month-day
     *
     * @example 261.101.1
     */
    EnumVersionStyle["JetbrainsShortMD"] = "jetbrains-short-md";
    /**
     * 標準完整年份 + 月日合併樣式
     * Standard full year with combined month-day
     *
     * @example 2026.101.1
     */
    EnumVersionStyle["StandardFullMD"] = "standard-full-md";
})(EnumVersionStyle || (exports.EnumVersionStyle = EnumVersionStyle = {}));
//# sourceMappingURL=types.js.map
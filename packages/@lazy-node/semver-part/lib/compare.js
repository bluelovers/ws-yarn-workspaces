"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = compare;
exports.eq = eq;
exports.neq = neq;
exports.gt = gt;
exports.gte = gte;
exports.lt = lt;
exports.lte = lte;
exports.cmp = cmp;
exports.tryCompare = tryCompare;
const tslib_1 = require("tslib");
/**
 * 版本部分比較工具 / Version part comparison utilities
 *
 * @module @lazy-node/semver-part/lib/compare
 *
 * 此模組提供比較 semver 版本部分的功能，支援不完整的版本字串比較。
 * This module provides functionality to compare semver version parts,
 * supporting comparison of incomplete version strings.
 *
 * @example
 * ```typescript
 * import { compare, eq, gt, gte, lt, lte, neq, cmp } from '@lazy-node/semver-part/lib/compare';
 *
 * // 比較版本部分 / Compare version parts
 * compare('1.2', '1.3'); // -1
 * eq('1.2', '1.2'); // true
 * gt('1.3', '1.2'); // true
 * lt('1.2', '1.3'); // true
 *
 * // 使用運算子比較 / Compare with operator
 * cmp('1.2', '>', '1.1'); // true
 * cmp('1.2', '<', '1.3'); // true
 * ```
 */
const _core_1 = require("./_core");
const compare_1 = tslib_1.__importDefault(require("semver/functions/compare"));
const cmp_1 = tslib_1.__importDefault(require("semver/functions/cmp"));
/**
 * 比較兩個版本部分
 * Compare two version parts
 *
 * 將版本部分標準化後進行比較
 * Normalizes version parts before comparison
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果 / Comparison result
 *
 * @example
 * ```typescript
 * compare('1.2.3', '1.3.0'); // -1
 * compare('1.3.0', '1.2.3'); // 1
 * compare('1.2.3', '1.2.3'); // 0
 * compare('2.3', '2.4'); // -1 (自動補全為 0.2.3 vs 0.2.4)
 * ```
 */
function compare(part1, part2, optionsOrLoose) {
    return (0, compare_1.default)(...(0, _core_1._part)(part1, part2), optionsOrLoose);
}
/**
 * 檢查兩個版本部分是否相等
 * Check if two version parts are equal
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否相等 / Whether equal
 *
 * @example
 * ```typescript
 * eq('1.2.3', '1.2.3'); // true
 * eq('1.2', '1.2.0'); // true (自動補全)
 * eq('1.2', '1.3'); // false
 * ```
 */
function eq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) === 0;
}
/**
 * 檢查兩個版本部分是否不相等
 * Check if two version parts are not equal
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否不相等 / Whether not equal
 *
 * @example
 * ```typescript
 * neq('1.2', '1.3'); // true
 * neq('1.2', '1.2'); // false
 * ```
 */
function neq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) !== 0;
}
/**
 * 檢查第一個版本部分是否大於第二個
 * Check if first version part is greater than second
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否大於 / Whether greater
 *
 * @example
 * ```typescript
 * gt('1.3', '1.2'); // true
 * gt('1.2', '1.3'); // false
 * ```
 */
function gt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) > 0;
}
/**
 * 檢查第一個版本部分是否大於或等於第二個
 * Check if first version part is greater than or equal to second
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否大於或等於 / Whether greater or equal
 *
 * @example
 * ```typescript
 * gte('1.3', '1.2'); // true
 * gte('1.2', '1.2'); // true
 * gte('1.1', '1.2'); // false
 * ```
 */
function gte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) >= 0;
}
/**
 * 檢查第一個版本部分是否小於第二個
 * Check if first version part is less than second
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否小於 / Whether less
 *
 * @example
 * ```typescript
 * lt('1.2', '1.3'); // true
 * lt('1.3', '1.2'); // false
 * ```
 */
function lt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) < 0;
}
/**
 * 檢查第一個版本部分是否小於或等於第二個
 * Check if first version part is less than or equal to second
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否小於或等於 / Whether less or equal
 *
 * @example
 * ```typescript
 * lte('1.2', '1.3'); // true
 * lte('1.2', '1.2'); // true
 * lte('1.3', '1.2'); // false
 * ```
 */
function lte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) <= 0;
}
/**
 * 使用指定運算子比較兩個版本部分
 * Compare two version parts with specified operator
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param operator - 比較運算子 / Comparison operator ('>' | '>=' | '<' | '<=' | '=' | '==' | '===' | '!=' | '!==')
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果 / Comparison result
 *
 * @example
 * ```typescript
 * cmp('1.2', '>', '1.1'); // true
 * cmp('1.2', '<', '1.3'); // true
 * cmp('1.2', '=', '1.2'); // true
 * cmp('1.2', '>=', '1.2'); // true
 * ```
 */
function cmp(part1, operator, part2, optionsOrLoose) {
    const [v1, v2] = (0, _core_1._part)(part1, part2);
    return (0, cmp_1.default)(v1, operator, v2, optionsOrLoose);
}
/**
 * 嘗試比較兩個版本部分，失敗時返回 undefined
 * Try to compare two version parts, returns undefined on failure
 *
 * 安全的比較函數，不會拋出異常
 * Safe comparison function that won't throw exceptions
 *
 * @param v1 - 第一個版本部分 / First version part
 * @param v2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果或 undefined / Comparison result or undefined
 *
 * @example
 * ```typescript
 * tryCompare('1.2', '1.3'); // -1
 * tryCompare('invalid', '1.2'); // undefined (不拋出異常)
 * ```
 */
function tryCompare(v1, v2, optionsOrLoose) {
    try {
        return compare(v1, v2, optionsOrLoose);
    }
    catch (e) { }
}
//# sourceMappingURL=compare.js.map
"use strict";
/**
 * @lazy-node/semver-parse 物件修剪工具
 * Object pruning utility for @lazy-node/semver-parse
 *
 * 此模組提供移除物件中 undefined 屬性的功能
 * This module provides functionality to remove undefined properties from objects
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruned = pruned;
exports.prunedSimpleSemVer = prunedSimpleSemVer;
exports.normalizeSemVerObjectInput = normalizeSemVerObjectInput;
const const_1 = require("../const");
const checker_1 = require("../checker");
/**
 * 移除物件中的 undefined 屬性
 * Remove undefined properties from an object
 *
 * 返回一個新物件，其中所有 undefined 的屬性都已移除。
 * 這對於序列化和清理 semver 物件非常有用。
 *
 * Returns a new object with all undefined properties removed.
 * This is useful for serializing and cleaning semver objects.
 *
 * @template T - 物件類型 / Object type
 * @param {T} obj - 來源物件 / Source object
 * @param {T} [o] - 目標物件（可選）/ Target object (optional)
 * @returns {T} 修剪後的物件 / Pruned object
 *
 * @example
 * ```typescript
 * pruned({ a: 1, b: undefined, c: 'test' });
 * // => { a: 1, c: 'test' }
 *
 * // 使用目標物件 / Using target object
 * const target = {};
 * pruned({ a: 1, b: undefined }, target);
 * // target => { a: 1 }
 * ```
 */
function pruned(obj, o = {}) {
    // 遍歷物件的所有屬性
    // Iterate over all properties of the object
    for (const key in obj) {
        // 只複製非 undefined 的屬性
        // Only copy non-undefined properties
        if ('undefined' !== typeof obj[key]) {
            o[key] = obj[key];
        }
    }
    return o;
}
/**
 * 修剪 SimpleSemVer 物件
 * Prune a SimpleSemVer object
 *
 * 專門用於 SimpleSemVer 物件的修剪函數。
 * 只保留 simpleSemVerKeys 中定義的標準屬性，並移除 undefined 值。
 *
 * Pruning function specifically for SimpleSemVer objects.
 * Only keeps standard properties defined in simpleSemVerKeys, and removes undefined values.
 *
 * @template T - semver 類型 / Semver type
 * @param {T} obj - 來源 semver 物件 / Source semver object
 * @param {T} [o] - 目標物件（可選）/ Target object (optional)
 * @returns {T} 修剪後的 semver 物件 / Pruned semver object
 *
 * @example
 * ```typescript
 * prunedSimpleSemVer({
 *   major: '1',
 *   minor: undefined,
 *   patch: '0',
 *   extra: 'ignored'  // 非標準屬性會被忽略 / Non-standard properties are ignored
 * });
 * // => { major: '1', patch: '0' }
 *
 * // 保留所有標準屬性 / Keep all standard properties
 * prunedSimpleSemVer({
 *   semver: '>=1.2.3',
 *   operator: '>=',
 *   version: '1.2.3',
 *   major: '1',
 *   minor: '2',
 *   patch: '3',
 *   release: undefined,
 *   build: undefined
 * });
 * // => { semver: '>=1.2.3', operator: '>=', version: '1.2.3', major: '1', minor: '2', patch: '3' }
 * ```
 */
function prunedSimpleSemVer(obj, o = {}) {
    // 只遍歷 simpleSemVerKeys 中定義的標準屬性
    // Only iterate over standard properties defined in simpleSemVerKeys
    for (const key of const_1.simpleSemVerKeys) {
        // 只複製非 undefined 的屬性
        // Only copy non-undefined properties
        if ('undefined' !== typeof obj[key]) {
            // @ts-ignore
            o[key] = obj[key];
        }
    }
    return o;
}
function normalizeSemVerObjectInput(obj, opts = {}) {
    if (!(opts === null || opts === void 0 ? void 0 : opts.init) && (0, checker_1.isSimpleSemVerObjectLike)(obj)) {
        //o.operator ??= '';
    }
    else if (obj.operator === '') {
        delete obj.operator;
    }
    return obj;
}
exports.default = prunedSimpleSemVer;
//# sourceMappingURL=pruned.js.map
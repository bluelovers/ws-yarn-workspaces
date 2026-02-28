"use strict";
/**
 * @lazy-node/semver-parse 版本合併器
 * Version merger for @lazy-node/semver-parse
 *
 * 此模組提供 semver 物件合併功能
 * This module provides semver object merging functionality
 *
 * **注意：此函數僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This function only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSimpleSemVer = mergeSimpleSemVer;
const checker_1 = require("./checker");
const isAllowedMergeAbleValue_1 = require("./util/isAllowedMergeAbleValue");
/**
 * 合併兩個 SimpleSemVer 物件
 * Merge two SimpleSemVer objects
 *
 * 將來源物件的版本屬性合併到目標物件中。
 * Merges version properties from source object into target object.
 *
 * **重要限制：只允許更新目標物件中已經存在的值。**
 * **Important limitation: Only updates values that already exist in the target object.**
 *
 * 合併規則：
 * Merge rules:
 * 1. 只有當目標物件的屬性值存在且有效時，才會被來源物件的值更新
 *    Only updates when the target's property value exists and is valid
 * 2. 有效的值：非空字串且不是萬用字元（`*` 或 `x`）
 *    Valid values: non-empty string and not wildcards (`*` or `x`)
 * 3. 如果目標物件沒有該屬性，則不會新增該屬性
 *    If target doesn't have the property, it won't be added
 *
 * @template T - semver 類型 / Semver type
 * @param {T} target - 目標 semver 物件 / Target semver object
 * @param {ISimpleSemVerObjectBase} b - 來源 semver 物件 / Source semver object
 * @returns {Object} 合併結果 / Merge result
 * @returns {IToSimpleSemVerObject<T>} .target - 合併後的目標物件 / Merged target object
 * @returns {ITSPartialPick<ISimpleSemVerObjectBase, 'major' | 'minor' | 'patch' | 'release' | 'build'>} .changed - 變更的屬性 / Changed properties
 * @throws {TypeError} 當目標或來源不是有效的版本物件時 / When target or source is not a valid version object
 *
 * @example
 * ```typescript
 * // 合併版本部分（目標已有該屬性）/ Merge version parts (target has the property)
 * const target = { major: '1', minor: '0', patch: '0' };
 * const source = { minor: '2', patch: '3' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '2', patch: '3' }, changed: { minor: '2', patch: '3' } }
 *
 * // 不會新增目標沒有的屬性 / Won't add properties that target doesn't have
 * const target = { major: '1', minor: '0', patch: '0' };
 * const source = { release: 'beta.1' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '0', patch: '0' }, changed: undefined }
 * // 注意：release 不會被新增，因為 target 沒有 release 屬性
 * // Note: release won't be added because target doesn't have release property
 *
 * // 更新已存在的預發布標籤 / Update existing pre-release tag
 * const target = { major: '1', minor: '0', patch: '0', release: 'alpha.1' };
 * const source = { release: 'beta.1' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '0', patch: '0', release: 'beta.1' }, changed: { release: 'beta.1' } }
 *
 * // 萬用字元不會被合併 / Wildcards are not merged
 * const target = { major: '1', minor: '2', patch: '3' };
 * const source = { patch: 'x' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '2', patch: '3' }, changed: undefined }
 * ```
 */
function mergeSimpleSemVer(target, b) {
    // 斷言目標和來源都是有效的版本物件
    // Assert both target and source are valid version objects
    (0, checker_1.assertSimpleSemVerObjectLike)(target);
    // assertSimpleSemVerObjectLike(b);
    const entries = Object.entries(b);
    let not_ok = true;
    for (const [k, v] of entries) {
        if (typeof v === 'string') {
            not_ok = false;
            continue;
        }
        else if (v === null || v === undefined) {
            continue;
        }
        throw new TypeError(`Invalid '${k}' value: ${v}`);
    }
    if (not_ok) {
        throw new TypeError(`Invalid 'b' value: ${JSON.stringify(b)}`);
    }
    // 記錄變更的屬性
    // Track changed properties
    let changed;
    // 遍歷所有可合併的版本屬性
    // Iterate over all mergeable version properties
    [
        'major',
        'minor',
        'patch',
        'release',
        'build',
    ].forEach(key => {
        // 獲取目標和來源的值
        // Get target and source values
        let value1 = target[key];
        let value2 = b[key];
        // 只有當兩個值都允許合併時才進行合併
        // Only merge when both values are allowed for merging
        // 允許的值：非空字串且不是 '*' 或 'x'
        // Allowed values: non-empty string and not '*' or 'x'
        if ((0, isAllowedMergeAbleValue_1.isAllowedMergeAbleValue)(value1) && (0, isAllowedMergeAbleValue_1.isAllowedMergeAbleValue)(value2)) {
            changed !== null && changed !== void 0 ? changed : (changed = {});
            // 更新目標物件的值
            // Update target object's value
            target[key] = value2;
            // 記錄變更
            // Record change
            changed[key] = value2;
        }
    });
    return {
        target: target,
        changed,
    };
}
exports.default = mergeSimpleSemVer;
//# sourceMappingURL=mergeSimpleSemVer.js.map
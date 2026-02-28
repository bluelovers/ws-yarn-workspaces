"use strict";
/**
 * @lazy-node/semver-parse 共用解析函數
 * Shared parsing functions for @lazy-node/semver-parse
 *
 * 此模組提供共用的 semver 解析邏輯，供 parseSimpleSemVer 和 parseSimpleSemVerRange 使用
 * This module provides shared semver parsing logic for parseSimpleSemVer and parseSimpleSemVerRange
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSemVerFromMatch = createSemVerFromMatch;
exports.createSimpleSemVerFromMatch = createSimpleSemVerFromMatch;
const SimpleSemVer_1 = require("../SimpleSemVer");
const pruned_1 = require("./pruned");
/**
 * 從正則表達式匹配結果建立 ISimpleSemVer 物件
 * Create ISimpleSemVer object from regex match result
 *
 * 此函數從 reSemverWithRangeAndWildcards 或 reSemverRange 的匹配結果中
 * 提取版本資訊並建立 ISimpleSemVer 物件。
 *
 * This function extracts version information from match results of
 * reSemverWithRangeAndWildcards or reSemverRange and creates ISimpleSemVer object.
 *
 * @param m - 正則表達式匹配結果 / Regex match result
 * @param operatorIndex - 運算子在匹配結果中的索引 / Operator index in match result
 * @param majorIndex - major 版本在匹配結果中的索引 / Major version index in match result
 * @param minorIndex - minor 版本在匹配結果中的索引 / Minor version index in match result
 * @param patchIndex - patch 版本在匹配結果中的索引 / Patch version index in match result
 * @param releaseIndex - release 在匹配結果中的索引 / Release index in match result
 * @param buildIndex - build 在匹配結果中的索引 / Build index in match result
 * @param semverIndex - semver 字串在匹配結果中的索引（可選，若無則自動構建）/ Semver string index in match result (optional, auto-built if not provided)
 * @param input - 原始輸入字串（用於構建 semver）/ Original input string (used to build semver)
 * @returns {ISimpleSemVer} 解析後的 semver 物件 / Parsed semver object
 *
 * @example
 * ```typescript
 * const m = reSemverWithRangeAndWildcards.exec('>=1.2.3');
 * const obj = createSemVerFromMatch(m, 1, 3, 5, 7, 9, 11);
 * // => { operator: '>=', major: '1', minor: '2', patch: '3' }
 * ```
 */
function createSemVerFromMatch(m, operatorIndex, majorIndex, minorIndex, patchIndex, releaseIndex, buildIndex, semverIndex, input) {
    var _a;
    // 建立基礎 semver 物件
    // Build base semver object
    const obj = {
        major: m[majorIndex],
    };
    // 構建純版本字串（不含運算子、release、build）
    // Build pure version string (without operator, release, build)
    // version 只包含 major.minor.patch
    // version only contains major.minor.patch
    let version = '';
    version += m[majorIndex];
    if (m[minorIndex] !== undefined)
        version += '.' + m[minorIndex];
    if (m[patchIndex] !== undefined)
        version += '.' + m[patchIndex];
    obj.version = version;
    // 處理 semver 字串（完整版本部分，含運算子）
    // Handle semver string (full version part with operator)
    if (semverIndex !== undefined && m[semverIndex]) {
        obj.semver = m[semverIndex];
    }
    else if (input !== undefined) {
        // 如果沒有 semverIndex，使用原始輸入字串
        // If semverIndex is not provided, use original input string
        obj.semver = input;
    }
    else {
        // 自動構建 semver 字串（含運算子、release、build）
        // Auto-build semver string (with operator, release, build)
        let semver = '';
        if (m[operatorIndex])
            semver += m[operatorIndex];
        semver += m[majorIndex];
        if (m[minorIndex] !== undefined)
            semver += '.' + m[minorIndex];
        if (m[patchIndex] !== undefined)
            semver += '.' + m[patchIndex];
        if (m[releaseIndex])
            semver += '-' + m[releaseIndex];
        if (m[buildIndex])
            semver += '+' + m[buildIndex];
        obj.semver = semver;
    }
    // 處理運算子
    // Handle operator
    // 只有當運算子存在時才設定 operator 屬性
    // Only set operator property when operator exists
    if ((_a = m[operatorIndex]) === null || _a === void 0 ? void 0 : _a.length) {
        obj.operator = m[operatorIndex];
    }
    // 處理 minor 版本
    // Handle minor version
    if (m[minorIndex] !== undefined) {
        obj.minor = m[minorIndex];
    }
    // 處理 patch 版本
    // Handle patch version
    if (m[patchIndex] !== undefined) {
        obj.patch = m[patchIndex];
    }
    // 處理預發布標籤
    // Handle pre-release tag
    if (m[releaseIndex]) {
        obj.release = m[releaseIndex];
    }
    // 處理建置元資料
    // Handle build metadata
    if (m[buildIndex]) {
        obj.build = m[buildIndex];
    }
    return obj;
}
/**
 * 從正則表達式匹配結果建立 SimpleSemVer 實例
 * Create SimpleSemVer instance from regex match result
 *
 * 此函數是 createSemVerFromMatch 的包裝函數，直接返回 SimpleSemVer 實例。
 * This function is a wrapper of createSemVerFromMatch that returns SimpleSemVer instance directly.
 *
 * @param m - 正則表達式匹配結果 / Regex match result
 * @param operatorIndex - 運算子在匹配結果中的索引 / Operator index in match result
 * @param majorIndex - major 版本在匹配結果中的索引 / Major version index in match result
 * @param minorIndex - minor 版本在匹配結果中的索引 / Minor version index in match result
 * @param patchIndex - patch 版本在匹配結果中的索引 / Patch version index in match result
 * @param releaseIndex - release 在匹配結果中的索引 / Release index in match result
 * @param buildIndex - build 在匹配結果中的索引 / Build index in match result
 * @param semverIndex - semver 字串在匹配結果中的索引（可選）/ Semver string index in match result (optional)
 * @param input - 原始輸入字串（用於構建 semver）/ Original input string (used to build semver)
 * @returns {SimpleSemVer} SimpleSemVer 實例 / SimpleSemVer instance
 */
function createSimpleSemVerFromMatch(m, operatorIndex, majorIndex, minorIndex, patchIndex, releaseIndex, buildIndex, semverIndex, input) {
    const obj = createSemVerFromMatch(m, operatorIndex, majorIndex, minorIndex, patchIndex, releaseIndex, buildIndex, semverIndex, input);
    return new SimpleSemVer_1.SimpleSemVer((0, pruned_1.normalizeSemVerObjectInput)(obj, {
        init: true,
    }));
}
exports.default = createSemVerFromMatch;
//# sourceMappingURL=parseSemverMatch.js.map
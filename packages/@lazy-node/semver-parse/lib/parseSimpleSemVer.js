"use strict";
/**
 * @lazy-node/semver-parse 版本解析器
 * Version parser for @lazy-node/semver-parse
 *
 * 此模組提供 semver 版本字串解析功能
 * This module provides semver version string parsing functionality
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
exports.parseSimpleSemVer = parseSimpleSemVer;
const const_1 = require("./const");
const SimpleSemVer_1 = require("./SimpleSemVer");
const checker_1 = require("./checker");
const parseSemverMatch_1 = require("./util/parseSemverMatch");
/**
 * 解析 semver 版本字串
 * Parse a semver version string
 *
 * 將 semver 版本字串解析為結構化的 SimpleSemVer 物件。
 * 支援選擇性的 v 前綴、範圍運算子和萬用字元。
 *
 * Parses a semver version string into a structured SimpleSemVer object.
 * Supports optional v prefix, range operators, and wildcards.
 *
 * @template T - semver 物件類型 / Semver object type
 * @param {string} version - 要解析的版本字串 / Version string to parse
 * @returns {IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>} 解析後的 SimpleSemVer 物件 / Parsed SimpleSemVer object
 *
 * @example
 * ```typescript
 * // 基本版本解析 / Basic version parsing
 * parseSimpleSemVer('1.2.3');
 * // => SimpleSemVer { major: '1', minor: '2', patch: '3' }
 *
 * // 帶 v 前綴 / With v prefix
 * parseSimpleSemVer('v1.2.3');
 * // => SimpleSemVer { major: '1', minor: '2', patch: '3', semver: 'v1.2.3' }
 *
 * // 帶運算子 / With operator
 * parseSimpleSemVer('>=1.2.3');
 * // => SimpleSemVer { operator: '>=', major: '1', minor: '2', patch: '3' }
 *
 * // 帶預發布標籤和建置元資料 / With pre-release tag and build metadata
 * parseSimpleSemVer('1.2.3-beta.1+build.123');
 * // => SimpleSemVer {
 * //   major: '1', minor: '2', patch: '3',
 * //   release: 'beta.1', build: 'build.123'
 * // }
 *
 * // 帶萬用字元 / With wildcards
 * parseSimpleSemVer('1.2.x');
 * // => SimpleSemVer { major: '1', minor: '2', patch: 'x' }
 *
 * parseSimpleSemVer('1.*');
 * // => SimpleSemVer { major: '1', minor: '*' }
 * ```
 */
function parseSimpleSemVer(version) {
    // semver, major, minor, patch
    // 相關參考資料 / Related references:
    // https://github.com/mojombo/semver/issues/32
    // https://github.com/isaacs/node-semver/issues/10
    // 可選的 v 前綴 / Optional v prefix
    let ver;
    // 處理純萬用字元情況（只有 `*` 或 `x`）
    // Handle pure wildcard case (only `*` or `x`)
    if (version === "*" /* EnumSemverWildcard.star */ || version === "x" /* EnumSemverWildcard.x */) {
        ver = new SimpleSemVer_1.SimpleSemVer({
            semver: version,
        });
        return ver;
    }
    // 使用支援萬用字元的正規表達式匹配版本字串
    // Use regex with wildcard support to match version string
    const m = const_1.reSemverWithRangeAndWildcards.exec(version);
    if ((m === null || m === void 0 ? void 0 : m.length) > 0) {
        // 捕獲組索引說明 / Capture group index explanation:
        // m[0] = 完整匹配 / Full match
        // m[1] = 運算子 / Operator
        // m[2] = v 前綴 / v prefix
        // m[3] = major 版本 / Major version
        // m[4] = .minor 部分 / .minor part
        // m[5] = minor 版本 / Minor version
        // m[6] = .patch 部分 / .patch part
        // m[7] = patch 版本 / Patch version
        // m[8] = -release 部分 (包含 -) / -release part (including -)
        // m[9] = release 內容 (不含 -) / Release content (without -)
        // m[10] = +build 部分 (包含 +) / +build part (including +)
        // m[11] = build 內容 (不含 +) / Build content (without +)
        // 檢查是否為無效的部分版本
        // Check if it's an invalid partial version
        const hasMinor = m[4] !== undefined; // 有 .minor 部分 / Has .minor part
        const hasPatch = m[6] !== undefined; // 有 .patch 部分 / Has .patch part
        const minorIsWildcard = (0, checker_1.isSemverWildcard)(m[5]);
        const patchIsWildcard = (0, checker_1.isSemverWildcard)(m[7]);
        // 有效的版本需要滿足以下條件之一：
        // Valid version needs to satisfy one of the following:
        // 1. 只有 major 版本 / Only major version (e.g., "12")
        // 2. major.minor 部分版本 / Partial version with major.minor (e.g., "12.0")
        // 3. 完整版本 (major.minor.patch) / Full version (major.minor.patch)
        // 4. 包含萬用字元的版本 (如 1.x, 1.0.x) / Version with wildcards (e.g., 1.x, 1.0.x)
        const isPartialVersion = m[3] !== undefined; // 有 major 版本 / Has major version
        const isFullVersion = hasMinor && hasPatch;
        const hasWildcard = minorIsWildcard || patchIsWildcard;
        // 如果沒有 major 版本且不是萬用字元版本，則視為無效版本
        // If no major version and not a wildcard version, treat as invalid version
        if (!isPartialVersion && !hasWildcard) {
            return ver;
        }
        // 檢查 release 和 build 是否以無效字元結尾
        // Check if release and build end with invalid characters
        const release = m[9];
        const build = m[11];
        // release 和 build 不能以 . 結尾
        // release and build cannot end with .
        if ((release !== undefined && release.endsWith('.')) ||
            (build !== undefined && build.endsWith('.'))) {
            return ver;
        }
        // 建立 SimpleSemVer 實例
        // Create SimpleSemVer instance
        ver = (0, parseSemverMatch_1.createSimpleSemVerFromMatch)(m, 1, // operatorIndex
        3, // majorIndex
        5, // minorIndex
        7, // patchIndex
        9, // releaseIndex
        11, // buildIndex
        undefined, // semverIndex - 使用 input 自動構建
        version);
        // 斷言解析結果為有效的版本物件
        // Assert parsed result is a valid version object
        (0, checker_1.assertSimpleSemVerObjectLike)(ver);
    }
    return ver;
}
exports.default = parseSimpleSemVer;
//# sourceMappingURL=parseSimpleSemVer.js.map
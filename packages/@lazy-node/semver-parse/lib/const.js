"use strict";
/**
 * @lazy-node/semver-parse 常數定義
 * Constants for @lazy-node/semver-parse
 *
 * 此模組定義了 semver 解析所需的正規表達式和常數
 * This module defines regular expressions and constants for semver parsing
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumVersionExtra = exports.simpleSemVerKeys = exports.reOperatorWithSpace = exports.reOperator = exports.reSemverRange = exports.reSemverWithRangeAndWildcards = exports.reSemverWithRange = exports.reSemver = void 0;
/**
 * Semver 版本正規表達式
 * Semver version regular expression
 *
 * 匹配標準 semver 版本字串（可選的 v 前綴）
 * Matches standard semver version strings (optional v prefix)
 *
 * 匹配範例 / Match examples:
 * - `1.0.0`
 * - `v1.2.3`
 * - `1.0.0-beta.1`
 * - `1.0.0+build.123`
 * - `v1.2.3-beta.1+build.123`
 */
exports.reSemver = /^v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;
/**
 * 帶範圍運算子的 Semver 正規表達式
 * Semver regular expression with range operators
 *
 * 匹配帶有範圍運算子的 semver 版本字串
 * Matches semver version strings with range operators
 *
 * 支援的運算子 / Supported operators:
 * - `^` - 相容版本 / Compatible version
 * - `~` - 大約版本 / Approximately version
 * - `>=`, `<=`, `>`, `<` - 比較運算子 / Comparison operators
 * - `=` - 精確匹配 / Exact match
 */
exports.reSemverWithRange = /^(?:((?:(?:~?[<>]?)|\^?)=?)\s*)?v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;
/**
 * 帶範圍運算子和萬用字元的 Semver 正規表達式
 * Semver regular expression with range operators and wildcards
 *
 * 匹配帶有範圍運算子和萬用字元的 semver 版本字串
 * Matches semver version strings with range operators and wildcards
 *
 * 支援的運算子 / Supported operators:
 * - `^` - 相容版本 / Compatible version
 * - `~` - 大約版本 / Approximately version
 * - `>=`, `<=`, `>`, `<` - 比較運算子 / Comparison operators
 * - `=` - 精確匹配 / Exact match
 *
 * 支援的萬用字元 / Supported wildcards:
 * - `x` - 萬用字元 / Wildcard
 * - `*` - 星號萬用字元 / Asterisk wildcard
 *
 * 匹配範例 / Match examples:
 * - `1.0.0` - 完整版本 / Full version
 * - `1.x` - minor 萬用字元 / Minor wildcard
 * - `1.0.x` - patch 萬用字元 / Patch wildcard
 * - `1.*` - minor 星號萬用字元 / Minor asterisk wildcard
 * - `>=1.0.x` - 帶運算子的萬用字元版本 / Wildcard version with operator
 * - `x` - 單一萬用字元 / Single wildcard
 * - `*` - 單一星號萬用字元 / Single asterisk wildcard
 *
 * 捕獲組說明 / Capture groups:
 * - 群組 1: 運算子 (如 `^`, `~`, `>=` 等) / Operator (e.g., `^`, `~`, `>=`, etc.)
 * - 群組 2: 完整版本字串 / Full version string
 * - 群組 3: major 版本 / Major version
 * - 群組 4: `.minor` 部分 / `.minor` part
 * - 群組 5: minor 版本 / Minor version
 * - 群組 6: `.patch` 部分 / `.patch` part
 * - 群組 7: patch 版本 / Patch version
 * - 群組 8: `-release` 部分 (包含 `-`) / `-release` part (including `-`)
 * - 群組 9: release 內容 (不含 `-`) / Release content (without `-`)
 * - 群組 10: `+build` 部分 (包含 `+`) / `+build` part (including `+`)
 * - 群組 11: build 內容 (不含 `+`) / Build content (without `+`)
 */
exports.reSemverWithRangeAndWildcards = /^(?:((?:(?:~?[<>]?)|\^?)=?)\s*)?(v)?([0-9]+)(\.(x|\*|[0-9]+))?(\.(x|\*|[0-9]+))?(-([a-zA-Z0-9\.-]+))?(\+([a-zA-Z0-9\.-]+))?$/;
/**
 * Semver 範圍正規表達式
 * Semver range regular expression
 *
 * 用於解析版本範圍字串，支援多個版本條件和邏輯運算子
 * Used for parsing version range strings, supports multiple version conditions and logical operators
 *
 * 支援的範圍語法 / Supported range syntax:
 * - `||` - 或邏輯 / OR logic
 * - `-` - 範圍 / Range
 * - `x`, `*` - 萬用字元 / Wildcards
 *
 * 捕獲組說明 / Capture groups:
 * - 群組 1: 整個匹配內容
 * - 群組 2: `||` 或 `-` (邏輯運算子)
 * - 群組 3: 版本部分 (包含 release 和 build)
 * - 群組 4: 運算子 (如 `^`, `~`, `>=` 等)
 * - 群組 5: `v` 前綴
 * - 群組 6: major 版本
 * - 群組 7: `.minor` 部分
 * - 群組 8: minor 版本
 * - 群組 9: `.patch` 部分
 * - 群組 10: patch 版本
 * - 群組 11: `-release` 部分 (包含 `-`)
 * - 群組 12: release 內容 (不含 `-`)
 * - 群組 13: `+build` 部分 (包含 `+`)
 * - 群組 14: build 內容 (不含 `+`)
 *
 * @example
 * ```typescript
 * // 匹配範例 / Match examples:
 * // '>=1.2.3 <2.0.0'
 * // '^1.2.0'
 * // '1.2.x'
 * // '>=1.0.0 || 0.5.0'
 * // '1.0.0-alpha+build.123' (同時包含預發布標籤和建置元資料)
 * ```
 */
// export const reSemverRange = /\s*((\|\||\-)|(((?:(?:~?[<>]?)|\^?)=?)\s*(v)?([0-9]+)(\.(x|\*|[0-9]+))?(\.(x|\*|[0-9]+))?(([\-+])([a-zA-Z0-9\.-]+))?))\s*/g;
exports.reSemverRange = /\s*((\|\||\-)|(((?:(?:~?[<>]?)|\^?)=?)\s*(v)?([0-9]+)(\.(x|\*|[0-9]+))?(\.(x|\*|[0-9]+))?(-([a-zA-Z0-9\.-]+))?(\+([a-zA-Z0-9\.-]+))?))\s*/g;
exports.reOperator = /^((?:(?:~?[<>]?)|\^?)=?)$/;
exports.reOperatorWithSpace = /^((?:(?:~?[<>]?)|\^?)=?)\s*(?=\d)/;
/**
 * SimpleSemVer 物件的標準屬性鍵列表
 * Standard property keys for SimpleSemVer objects
 *
 * 定義 SimpleSemVer 物件應包含的所有屬性名稱
 * Defines all property names that a SimpleSemVer object should contain
 */
exports.simpleSemVerKeys = [
    'semver',
    'operator',
    'version',
    'major',
    'minor',
    'patch',
    'release',
    'build',
];
/**
 * 版本額外資訊列舉
 * Version extra information enum
 *
 * 定義版本字串中的額外資訊前綴符號
 * Defines prefix symbols for extra information in version strings
 */
var EnumVersionExtra;
(function (EnumVersionExtra) {
    /**
     * 建置元資料前綴
     * Build metadata prefix
     *
     * 用於標識建置資訊，例如 `+build.123`
     * Used to identify build information, e.g., `+build.123`
     */
    EnumVersionExtra["build"] = "+";
    /**
     * 預發布標籤前綴
     * Pre-release tag prefix
     *
     * 用於標識預發布版本，例如 `-beta.1`
     * Used to identify pre-release versions, e.g., `-beta.1`
     */
    EnumVersionExtra["release"] = "-";
})(EnumVersionExtra || (exports.EnumVersionExtra = EnumVersionExtra = {}));
//# sourceMappingURL=const.js.map
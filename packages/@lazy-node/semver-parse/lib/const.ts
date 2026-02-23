/**
 * @lazy-node/semver-parse 常數定義
 * Constants for @lazy-node/semver-parse
 *
 * 此模組定義了 semver 解析所需的正規表達式和常數
 * This module defines regular expressions and constants for semver parsing
 *
 * @packageDocumentation
 */

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
export const reSemver = /^v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;

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
export const reSemverWithRange = /^(?:((?:(?:~?[<>]?)|\^?)=?)\s*)?v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;

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
 * @example
 * ```typescript
 * // 匹配範例 / Match examples:
 * // '>=1.2.3 <2.0.0'
 * // '^1.2.0'
 * // '1.2.x'
 * // '>=1.0.0 || 0.5.0'
 * ```
 */
export const reSemverRange = /\s*((\|\||\-)|(((?:(?:~?[<>]?)|\^?)=?)\s*(v)?([0-9]+)(\.(x|\*|[0-9]+))?(\.(x|\*|[0-9]+))?(([\-+])([a-zA-Z0-9\.-]+))?))\s*/g;

/**
 * SimpleSemVer 物件的標準屬性鍵列表
 * Standard property keys for SimpleSemVer objects
 *
 * 定義 SimpleSemVer 物件應包含的所有屬性名稱
 * Defines all property names that a SimpleSemVer object should contain
 */
export const simpleSemVerKeys = [
	'semver',
	'operator',
	'version',
	'major',
	'minor',
	'patch',
	'release',
	'build',
] as const;

/**
 * 版本額外資訊列舉
 * Version extra information enum
 *
 * 定義版本字串中的額外資訊前綴符號
 * Defines prefix symbols for extra information in version strings
 */
export const enum EnumVersionExtra
{
	/**
	 * 建置元資料前綴
	 * Build metadata prefix
	 *
	 * 用於標識建置資訊，例如 `+build.123`
	 * Used to identify build information, e.g., `+build.123`
	 */
	build = '+',

	/**
	 * 預發布標籤前綴
	 * Pre-release tag prefix
	 *
	 * 用於標識預發布版本，例如 `-beta.1`
	 * Used to identify pre-release versions, e.g., `-beta.1`
	 */
	release = '-',
}

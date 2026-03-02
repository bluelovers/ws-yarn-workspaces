/**
 * @fileoverview Normalize dependency values to standardized semver format
 * @description 將依賴值正規化為標準化的 semver 格式
 *
 * This module provides utilities to normalize various dependency value formats
 * into a standardized semver string. It handles edge cases like empty inputs,
 * spaces, star wildcards, and complex semver ranges.
 *
 * 本模組提供將各種依賴值格式正規化為標準化 semver 字串的工具。
 * 處理邊緣情況，如空輸入、空格、星號萬用字元和複雜的 semver 範圍。
 *
 * @module @yarn-tool/normalize-deps-value
 */
import { IResult } from '@yarn-tool/npm-package-arg-util';
/**
 * Normalize an npm-package-arg result to a dependency value string
 * 將 npm-package-arg 結果正規化為依賴值字串
 *
 * This function converts an npm-package-arg result into a standardized
 * dependency value string suitable for package.json. It handles:
 * - Empty/space inputs (returns "*")
 * - Range normalization using semver-ampersand
 * - Tag handling with special cases
 * - Direct passthrough for other types
 *
 * 此函數將 npm-package-arg 結果轉換為適合 package.json 的標準化依賴值字串。
 * 處理：
 * - 空/空格輸入（返回 "*"）
 * - 使用 semver-ampersand 進行範圍正規化
 * - 標籤的特殊情況處理
 * - 其他類型的直接傳遞
 *
 * @param {ReturnType<typeof _getNpaResult>} result - The npm-package-arg result or string to normalize / 要正規化的 npm-package-arg 結果或字串
 *
 * @returns {string} Normalized dependency value (e.g., "*", "^4.0.0", "1.2.3") / 正規化的依賴值（例如："*"、"^4.0.0"、"1.2.3"）
 *
 * @example
 * // Empty input
 * // 空輸入
 * normalizeResultToDepsValue({ type: 'range', rawSpec: '', ... });
 * // => "*"
 *
 * @example
 * // Space input
 * // 空格輸入
 * normalizeResultToDepsValue({ type: 'range', rawSpec: ' ', ... });
 * // => "*"
 *
 * @example
 * // Star wildcard
 * // 星號萬用字元
 * normalizeResultToDepsValue({ type: 'range', rawSpec: '*', ... });
 * // => "*"
 *
 * @example
 * // Range normalization
 * // 範圍正規化
 * normalizeResultToDepsValue({ type: 'range', rawSpec: '>=1.0.0 <2.0.0', ... });
 * // => ">=1.0.0 <2.0.0" (normalized via semver-ampersand)
 *
 * @example
 * // Tag as package name only
 * // 僅作為套件名稱的標籤
 * normalizeResultToDepsValue({ type: 'tag', name: 'lodash', rawSpec: '*', raw: 'lodash' });
 * // => "lodash"
 *
 * @example
 * // Direct passthrough
 * // 直接傳遞
 * normalizeResultToDepsValue({ type: 'version', rawSpec: '4.17.21', ... });
 * // => "4.17.21"
 */
export declare function normalizeResultToDepsValue(result: ReturnType<typeof _getNpaResult>): string;
/**
 * Parse a value string into an npm-package-arg result
 * 將值字串解析為 npm-package-arg 結果
 *
 * This function attempts to parse a dependency value string using multiple strategies:
 * 1. Try as semver range with fake package name (for bare version strings like "^4.0.0")
 * 2. Try as full package spec (for "package@version" format)
 * 3. Try with noThrowError flag (for edge cases)
 *
 * 此函數嘗試使用多種策略解析依賴值字串：
 * 1. 嘗試作為帶虛假套件名稱的 semver 範圍（用於純版本字串如 "^4.0.0"）
 * 2. 嘗試作為完整套件規格（用於 "package@version" 格式）
 * 3. 嘗試使用 noThrowError 標誌（用於邊緣情況）
 *
 * @param {string} value - The dependency value string to parse
 * @param {string} value - 要解析的依賴值字串
 *
 * @returns {IResult} Parsed npm-package-arg result
 * @returns {IResult} 解析後的 npm-package-arg 結果
 *
 * @throws {Error} Throws if all parsing strategies fail
 * @throws {Error} 如果所有解析策略都失敗則拋出錯誤
 *
 * @example
 * // Bare semver range
 * // 純 semver 範圍
 * _getNpaResult('^4.0.0');
 * // => IResult { type: 'range', name: '@fake/fake', rawSpec: '^4.0.0', ... }
 *
 * @example
 * // Package with version
 * // 帶版本的套件
 * _getNpaResult('lodash@^4.0.0');
 * // => IResult { type: 'range', name: 'lodash', rawSpec: '^4.0.0', ... }
 *
 * @example
 * // Empty string
 * // 空字串
 * _getNpaResult('');
 * // => IResult { type: 'range', name: '@fake/fake', rawSpec: '', ... }
 */
export declare function _getNpaResult(value: string): IResult;
/**
 * Normalize a dependency value string to standard format
 * 將依賴值字串正規化為標準格式
 *
 * This is the main entry point that combines parsing and normalization
 * into a single operation. It handles all the edge cases tested in
 * space.spec.ts including empty strings, spaces, and star wildcards.
 *
 * 這是主要入口點，將解析和正規化合併為單一操作。
 * 處理 space.spec.ts 中測試的所有邊緣情況，包括空字串、空格和星號萬用字元。
 *
 * @param {string} value - The dependency value to normalize / 要正規化的依賴值
 *
 * @returns {string} Normalized dependency value / 正規化的依賴值
 *
 * @example
 * // Empty string becomes star
 * // 空字串變為星號
 * normalizeDepsValue('');
 * // => "*"
 *
 * @example
 * // Space becomes star
 * // 空格變為星號
 * normalizeDepsValue(' ');
 * // => "*"
 *
 * @example
 * // Star remains star
 * // 星號保持為星號
 * normalizeDepsValue('*');
 * // => "*"
 *
 * @example
 * // Semver range is normalized
 * // Semver 範圍被正規化
 * normalizeDepsValue('>=1.0.0 <2.0.0');
 * // => ">=1.0.0 <2.0.0"
 *
 * @example
 * // Package@version returns version
 * // Package@version 返回版本
 * normalizeDepsValue('lodash@^4.0.0');
 * // => "^4.0.0"
 */
export declare function normalizeDepsValue(value: string): string;
export default normalizeDepsValue;

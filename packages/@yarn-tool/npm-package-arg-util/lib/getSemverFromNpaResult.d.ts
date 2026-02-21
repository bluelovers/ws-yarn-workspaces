/**
 * @fileoverview Utility function to extract semver from npm-package-arg results
 * @description 從 npm-package-arg 結果提取 semver 的工具函數
 *
 * This module provides a function to extract the semantic version
 * or version range from various types of npm-package-arg results.
 *
 * 本模組提供從各種類型的 npm-package-arg 結果中
 * 提取語意版本或版本範圍的函數。
 */
import { IResult } from './types';
/**
 * Extract the semantic version from an npm-package-arg result
 * 從 npm-package-arg 結果提取語意版本
 *
 * This function extracts the version specifier from different types
 * of npm-package-arg results. For alias results, it extracts the
 * version from the sub-spec; for other types, it uses the rawSpec.
 *
 * 此函數從不同類型的 npm-package-arg 結果中提取版本指定符。
 * 對於別名結果，它從子規格中提取版本；
 * 對於其他類型，它使用 rawSpec。
 *
 * @param {IResult} npaResult - The npm-package-arg result to extract from
 * @param {IResult} npaResult - 要從中提取的 npm-package-arg 結果
 *
 * @returns {string} The extracted semantic version or range
 * @returns {string} 提取的語意版本或範圍
 *
 * @example
 * // Extract version from a versioned package
 * // 從帶版本的套件提取版本
 * const result = npa('lodash@4.17.21');
 * getSemverFromNpaResult(result); // '4.17.21'
 *
 * @example
 * // Extract version range from a ranged package
 * // 從帶版本範圍的套件提取範圍
 * const result = npa('lodash@^4.0.0');
 * getSemverFromNpaResult(result); // '^4.0.0'
 *
 * @example
 * // Extract version from an alias
 * // 從別名提取版本
 * const result = npa('my-lodash@npm:lodash@4.17.21');
 * getSemverFromNpaResult(result); // '4.17.21'
 */
export declare function getSemverFromNpaResult(npaResult: IResult): string;
export default getSemverFromNpaResult;

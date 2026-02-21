/**
 * @fileoverview Utility functions for generating package argument strings
 * @description 生成套件參數字串的工具函數
 *
 * This module provides functions to generate npm package argument
 * strings from parsed package information.
 *
 * 本模組提供從解析的套件資訊生成 npm 套件參數字串的函數。
 */
import { IParsePackageName, IResult } from './types';
import { ITSPartialPick } from 'ts-type/lib/type/record';
/**
 * Generate a package argument string from parsed package information
 * 從解析的套件資訊生成套件參數字串
 *
 * This function creates a package argument string that can be used
 * with npm/yarn commands. It optionally includes the version if
 * includeVersion is true and a semver is present.
 *
 * 此函數創建可用於 npm/yarn 命令的套件參數字串。
 * 如果 includeVersion 為 true 且存在 semver，則可選地包含版本。
 *
 * @param {object} input - The parsed package information
 * @param {object} input - 解析的套件資訊
 *
 * @param {string} input.name - The package name (required)
 * @param {string} input.name - 套件名稱（必需）
 *
 * @param {string} [input.semver] - The semantic version (optional)
 * @param {string} [input.semver] - 語意版本（可選）
 *
 * @param {string} [input.type] - The result type (optional)
 * @param {string} [input.type] - 結果類型（可選）
 *
 * @param {boolean} [includeVersion] - Whether to include version in output
 * @param {boolean} [includeVersion] - 是否在輸出中包含版本
 *
 * @returns {string} The generated package argument string
 * @returns {string} 生成的套件參數字串
 *
 * @example
 * // Generate without version
 * // 不包含版本生成
 * generatePackageArg({ name: 'lodash' }); // 'lodash'
 *
 * @example
 * // Generate with version
 * // 包含版本生成
 * generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, true); // 'lodash@^4.17.0'
 *
 * @example
 * // Version not included by default
 * // 預設不包含版本
 * generatePackageArg({ name: 'lodash', semver: '^4.17.0' }); // 'lodash'
 */
export declare function generatePackageArg(input: Pick<IParsePackageName, 'name'> & ITSPartialPick<IParsePackageName, 'semver' | 'type'>, includeVersion?: boolean): string;
/**
 * Check if a result type is allowed for registry operations
 * 檢查結果類型是否允許進行 registry 操作
 *
 * This function checks if the given result type is valid for
 * npm registry operations (tag, version, or range).
 *
 * 此函數檢查給定的結果類型是否對 npm registry 操作有效
 * （tag、version 或 range）。
 *
 * @param {IResult["type"]} type - The result type to check
 * @param {IResult["type"]} type - 要檢查的結果類型
 *
 * @returns {boolean} True if the type is allowed for registry operations
 * @returns {boolean} 如果類型允許進行 registry 操作則返回 true
 *
 * @example
 * _allowedResultType('version'); // true
 * _allowedResultType('range'); // true
 * _allowedResultType('tag'); // true
 * _allowedResultType('git'); // false
 */
export declare function _allowedResultType(type: IResult["type"]): boolean;

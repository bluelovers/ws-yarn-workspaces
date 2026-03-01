/**
 * @fileoverview Utility functions for parsing package names from command line arguments
 * @description 從命令列參數解析套件名稱的工具函數
 *
 * This module provides functions for parsing package name strings,
 * extracting package information like name, scope, and version.
 *
 * 本模組提供解析套件名稱字串的函數，
 * 提取套件資訊如名稱、範圍和版本。
 */
import { IParsePackageName, IResult } from './types';
/**
 * Parse a package name from command line arguments
 * 從命令列參數解析套件名稱
 *
 * @deprecated Use parsePackageName instead
 * @deprecated 請改用 parsePackageName
 *
 * @param {string} input - The package argument string to parse
 * @param {string} input - 要解析的套件參數字串
 *
 * @returns {object|undefined} Parsed package information or undefined if invalid
 * @returns {object|undefined} 解析的套件資訊，如果無效則返回 undefined
 */
export declare function parseArgvPkgName(input: string): {
    input: string;
    namespace: string;
    name: string;
    version: string;
    result: IResult;
};
/**
 * Parse a package name and extract detailed information
 * 解析套件名稱並提取詳細資訊
 *
 * This function parses a package name string (optionally with version)
 * and returns an object containing all relevant package information
 * including name, scope, subname, and semver.
 *
 * 此函數解析套件名稱字串（可選帶版本），
 * 並返回包含所有相關套件資訊的物件，
 * 包括名稱、範圍、子名稱和 semver。
 *
 * @param {string} packageName - The package name to parse (e.g., "lodash@4.17.21", "@types/node@^18.0.0")
 * @param {string} packageName - 要解析的套件名稱（例如："lodash@4.17.21"、"@types/node@^18.0.0"）
 *
 * @returns {IParsePackageName} The parsed package information
 * @returns {IParsePackageName} 解析的套件資訊
 *
 * @example
 * // Parse a simple package
 * // 解析簡單套件
 * parsePackageName('lodash@^4.17.0');
 * // Returns: { type: 'range', name: 'lodash', scope: undefined, subname: 'lodash', semver: '^4.17.0', result: ... }
 *
 * @example
 * // Parse a scoped package
 * // 解析範圍套件
 * parsePackageName('@types/node@18.0.0');
 * // Returns: { type: 'version', name: '@types/node', scope: 'types', subname: 'node', semver: '18.0.0', result: ... }
 *
 * @example
 * // Parse without a version / 解析不含版本
 * parsePackageName('lodash');
 * // Returns: { type: 'tag', name: 'lodash', scope: undefined, subname: 'lodash', semver: undefined, result: ... }
 */
export declare function parsePackageName(packageName: string): IParsePackageName;
export declare function _parsePackageNameCore(result: IResult): IParsePackageName;

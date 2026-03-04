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
 * Core logic for parsing package name from npa result (legacy format)
 * 從 npa 結果解析套件名稱的核心邏輯（舊版格式）
 *
 * This internal function processes the raw npm-package-arg result and transforms
 * it into the legacy return format used by parseArgvPkgName.
 *
 * 此內部函數處理原始的 npm-package-arg 結果，並將其轉換為 parseArgvPkgName 使用的舊版返回格式。
 *
 * @param {IResult} result - The parsed result from npm-package-arg
 * @param {IResult} result - 來自 npm-package-arg 的解析結果
 *
 * @param {string} input - The original input string
 * @param {string} input - 原始輸入字串
 *
 * @returns {object|undefined} Parsed package information in legacy format, or undefined if result is invalid
 * @returns {object|undefined} 舊版格式的解析套件資訊，如果結果無效則返回 undefined
 *
 * @internal
 */
export declare function _parseArgvPkgNameCore(result: IResult, input: string): {
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
/**
 * Core logic for parsing package name from npa result (new format)
 * 從 npa 結果解析套件名稱的核心邏輯（新版格式）
 *
 * This internal function processes the raw npm-package-arg result and transforms
 * it into the standardized IParsePackageName format. It extracts and normalizes
 * all relevant package information including type, name, scope, subname, and semver.
 *
 * 此內部函數處理原始的 npm-package-arg 結果，並將其轉換為標準化的 IParsePackageName 格式。
 * 它提取並標準化所有相關的套件資訊，包括類型、名稱、範圍、子名稱和 semver。
 *
 * @param {IResult} result - The parsed result from npm-package-arg
 * @param {IResult} result - 來自 npm-package-arg 的解析結果
 *
 * @returns {IParsePackageName} Standardized package information object
 * @returns {IParsePackageName} 標準化的套件資訊物件
 *
 * @internal
 */
export declare function _parsePackageNameCore(result: IResult): IParsePackageName;

"use strict";
/**
 * @fileoverview npm-package-arg utility functions for Yarn tool
 * @description npm-package-arg 工具函數，用於解析和處理 npm 套件參數
 *
 * This module provides utility functions for parsing npm package arguments,
 * including support for various package formats like registry packages,
 * git repositories, local files, and aliases.
 *
 * 本模組提供解析 npm 套件參數的工具函數，
 * 支援多種套件格式，包括 registry 套件、git 儲存庫、本地檔案和別名。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemverFromNpaResult = void 0;
exports._npa2Core = _npa2Core;
exports.npa2 = npa2;
exports.npa = npa;
exports.handleOptionsNpaUtil = handleOptionsNpaUtil;
exports.npaTry = npaTry;
exports.npaTry2 = npaTry2;
const tslib_1 = require("tslib");
const npm_package_arg_1 = tslib_1.__importDefault(require("npm-package-arg"));
const assert_1 = require("./lib/assert");
// Re-export utility function for extracting semver from npa result
// 重新匯出從 npa 結果提取 semver 的工具函數
var getSemverFromNpaResult_1 = require("./lib/getSemverFromNpaResult");
Object.defineProperty(exports, "getSemverFromNpaResult", { enumerable: true, get: function () { return getSemverFromNpaResult_1.getSemverFromNpaResult; } });
/**
 * Core parsing function for npm package arguments
 * npm 套件參數的核心解析函數
 *
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 *
 * @param {string} arg - The package argument to parse / 要解析的套件參數
 * @param {IOptionsNpaUtil} [options] - Parsing options / 解析選項
 * @returns {T} The parsed result containing package information / 包含套件資訊的解析結果
 * @throws {Error} Throws if the package argument is invalid / 如果套件參數無效則拋出錯誤
 *
 * @internal
 */
function _npa2Core(arg, options) {
    // Parse the argument using npm-package-arg
    // 使用 npm-package-arg 解析參數
    const result = (0, npm_package_arg_1.default)(arg, options === null || options === void 0 ? void 0 : options.where);
    // Validate the result
    // 驗證結果
    !(options === null || options === void 0 ? void 0 : options.noThrowError) && (0, assert_1.assertNpaResultAll)(result, options);
    return result;
}
/**
 * Parse an npm package argument and return detailed information (new version)
 * 解析 npm 套件參數並返回詳細資訊（新版本）
 *
 * This is the new version of npa that provides more flexible validation
 * through the options parameter.
 *
 * 這是新版本的 npa，通過 options 參數提供更靈活的驗證。
 *
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 *
 * @param {string} arg - The package argument to parse (e.g., "lodash@4.17.21", "@types/node@^18.0.0")
 * @param {string} arg - 要解析的套件參數（例如："lodash@4.17.21"、"@types/node@^18.0.0"）
 *
 * @param {string | IOptionsNpaUtil} [where] - Optional base directory or options object
 * @param {string | IOptionsNpaUtil} [where] - 可選的基礎目錄或選項物件
 *
 * @param {IOptionsNpaUtil} [options] - Parsing options including:
 * @param {IOptionsNpaUtil} [options] - 解析選項，包括：
 *   - where: Base directory for resolving relative paths / 解析相對路徑的基礎目錄
 *   - shouldHasName: Whether to validate that result has a name / 是否驗證結果有名稱
 *   - allowedType: Array of allowed result types / 允許的結果類型陣列
 *   - npa: Custom npa function to use / 使用的自定義 npa 函數
 *
 * @returns {T} The parsed result containing package information
 * @returns {T} 包含套件資訊的解析結果
 *
 * @throws {Error} Throws if the package argument is invalid or validation fails
 * @throws {Error} 如果套件參數無效或驗證失敗則拋出錯誤
 *
 * @example
 * // Parse a simple package with version
 * // 解析帶版本號的簡單套件
 * const result = npa2('lodash@4.17.21');
 * // result.name === 'lodash'
 * // result.type === 'version'
 *
 * @example
 * // Parse with options
 * // 使用選項解析
 * const result = npa2('lodash@^4.17.0', {
 *   allowedType: ['version', 'range']
 * });
 *
 * @example
 * // Parse a GitHub repository without name validation
 * // 解析 GitHub 儲存庫但不驗證名稱
 * const result = npa2('user/repo#branch', {
 *   shouldHasName: false
 * });
 */
function npa2(arg, where, options) {
    options = handleOptionsNpaUtil(options, where);
    return _npa2Core(arg, options);
}
/**
 * Parse an npm package argument (legacy version with strict name validation)
 * 解析 npm 套件參數（舊版本，強制名稱驗證）
 *
 * This is the legacy version that enforces shouldHasName validation by default.
 * Use npa2() for more flexible validation options.
 *
 * 這是舊版本，預設強制執行 shouldHasName 驗證。
 * 使用 npa2() 獲得更靈活的驗證選項。
 *
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 *
 * @param {string} arg - The package argument to parse / 要解析的套件參數
 * @param {string | IOptionsNpaUtil} [where] - Optional base directory or options / 可選的基礎目錄或選項
 * @param {IOptionsNpaUtil} [options] - Parsing options / 解析選項
 * @returns {T} The parsed result containing package information / 包含套件資訊的解析結果
 *
 * @throws {Error} Throws if the package argument is invalid or has no name / 如果套件參數無效或沒有名稱則拋出錯誤
 *
 * @deprecated Use npa2() for more flexible validation options
 * @deprecated 使用 npa2() 獲得更靈活的驗證選項
 */
function npa(arg, where, options) {
    var _a;
    options = handleOptionsNpaUtil(options, where);
    // Force shouldHasName validation for legacy behavior
    // 為了舊版行為強制執行 shouldHasName 驗證
    (_a = options.shouldHasName) !== null && _a !== void 0 ? _a : (options.shouldHasName = true);
    return _npa2Core(arg, options);
}
/**
 * Handle and merge npa utility options
 * 處理並合併 npa 工具選項
 *
 * This function normalizes the options parameter by handling both
 * string (where path) and object (options) inputs.
 *
 * 此函數通過處理字串（where 路徑）和物件（選項）輸入來標準化選項參數。
 *
 * @param {IOptionsNpaUtil} [options] - The options object
 * @param {IOptionsNpaUtil} [options] - 選項物件
 *
 * @param {IOptionsNpaBase | string} [optOrWhere] - Either options base or where path
 * @param {IOptionsNpaBase | string} [optOrWhere] - 選項基礎或 where 路徑
 *
 * @returns {IOptionsNpaUtil} Normalized options object
 * @returns {IOptionsNpaUtil} 標準化的選項物件
 */
function handleOptionsNpaUtil(options, optOrWhere) {
    if (!options && typeof optOrWhere === 'object') {
        options = optOrWhere;
    }
    else if (typeof optOrWhere === 'string') {
        options = { ...options, where: optOrWhere };
    }
    return options || {};
}
/**
 * Try to parse an npm package argument without throwing errors (legacy version)
 * 嘗試解析 npm 套件參數，不拋出錯誤（舊版本）
 *
 * This is a safe wrapper around npa() that catches any errors
 * and returns undefined instead of throwing.
 *
 * 這是 npa() 的安全包裝函數，會捕獲任何錯誤
 * 並返回 undefined 而不是拋出異常。
 *
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 *
 * @param {string} arg - The package argument to parse
 * @param {string} arg - 要解析的套件參數
 *
 * @param {string | IOptionsNpaUtil} [where] - Optional base directory or options
 * @param {string | IOptionsNpaUtil} [where] - 可選的基礎目錄或選項
 *
 * @param {IOptionsNpaUtil} [options] - Parsing options
 * @param {IOptionsNpaUtil} [options] - 解析選項
 *
 * @returns {T | undefined} The parsed result or undefined if parsing fails
 * @returns {T | undefined} 解析結果，如果解析失敗則返回 undefined
 *
 * @example
 * // Valid package argument
 * // 有效的套件參數
 * const result = npaTry('lodash@4.17.21');
 * // result.name === 'lodash'
 *
 * @example
 * // Invalid package argument
 * // 無效的套件參數
 * const result = npaTry('invalid-package-arg');
 * // result === undefined
 *
 * @deprecated Use npaTry2() for more flexible validation options
 * @deprecated 使用 npaTry2() 獲得更靈活的驗證選項
 */
function npaTry(arg, where, options) {
    try {
        // Use custom npa function if provided, otherwise use default npa
        // 如果提供了自定義 npa 函數則使用，否則使用預設 npa
        // @ts-ignore
        return ((options === null || options === void 0 ? void 0 : options.npa) || (where === null || where === void 0 ? void 0 : where.npa) || npa)(arg, where, options);
    }
    catch (e) {
        // Return undefined on error instead of throwing
        // 錯誤時返回 undefined 而不是拋出
    }
}
/**
 * Try to parse an npm package argument without throwing errors (new version)
 * 嘗試解析 npm 套件參數，不拋出錯誤（新版本）
 *
 * This is a safe wrapper around npa2() that catches any errors
 * and returns undefined instead of throwing.
 *
 * 這是 npa2() 的安全包裝函數，會捕獲任何錯誤
 * 並返回 undefined 而不是拋出異常。
 *
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 *
 * @param {string} arg - The package argument to parse
 * @param {string} arg - 要解析的套件參數
 *
 * @param {string | IOptionsNpaUtil} [where] - Optional base directory or options
 * @param {string | IOptionsNpaUtil} [where] - 可選的基礎目錄或選項
 *
 * @param {IOptionsNpaUtil} [options] - Parsing options
 * @param {IOptionsNpaUtil} [options] - 解析選項
 *
 * @returns {T | undefined} The parsed result or undefined if parsing fails
 * @returns {T | undefined} 解析結果，如果解析失敗則返回 undefined
 */
function npaTry2(arg, where, options) {
    try {
        // Use custom npa function if provided, otherwise use default npa2
        // 如果提供了自定義 npa 函數則使用，否則使用預設 npa2
        // @ts-ignore
        return ((options === null || options === void 0 ? void 0 : options.npa) || (where === null || where === void 0 ? void 0 : where.npa) || npa2)(arg, where, options);
    }
    catch (e) {
        // Return undefined on error instead of throwing
        // 錯誤時返回 undefined 而不是拋出
    }
}
// Default export for convenience
// 預設匯出以方便使用
exports.default = npa;
//# sourceMappingURL=index.js.map
"use strict";
/**
 * @fileoverview Utility function to convert package names to TypeScript @types format
 * @description 將套件名稱轉換為 TypeScript @types 格式的工具函數
 *
 * This module provides a function to convert npm package names to their
 * corresponding TypeScript type package names (e.g., lodash -> @types/lodash).
 *
 * 本模組提供將 npm 套件名稱轉換為對應的 TypeScript 類型套件名稱的函數
 * （例如 lodash -> @types/lodash）。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageNameToTypes = packageNameToTypes;
const escapePackageNameToTypes_1 = require("./escapePackageNameToTypes");
const parseArgvPkgName_1 = require("./parseArgvPkgName");
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
/**
 * Convert a package name to its TypeScript @types package name
 * 將套件名稱轉換為其 TypeScript @types 套件名稱
 *
 * This function takes a package name (optionally with version) and returns
 * the corresponding @types package information. For scoped packages, it
 * follows the TypeScript convention of using double underscores.
 *
 * 此函數接受套件名稱（可選帶版本）並返回對應的 @types 套件資訊。
 * 對於範圍套件，它遵循 TypeScript 使用雙底線的慣例。
 *
 * @param {string} packageName - The package name to convert (e.g., "lodash", "@types/node@^18.0.0")
 * @param {string} packageName - 要轉換的套件名稱（例如："lodash"、"@types/node@^18.0.0"）
 *
 * @param {string} [prefix='@types'] - The prefix for the types package
 * @param {string} [prefix='@types'] - 類型套件的前綴
 *
 * @returns {IParsePackageName} The parsed @types package information
 * @returns {IParsePackageName} 解析的 @types 套件資訊
 *
 * @example
 * // Convert a simple package
 * // 轉換簡單套件
 * packageNameToTypes('lodash');
 * // Returns: { name: '@types/lodash', scope: '@types', subname: 'lodash', ... }
 *
 * @example
 * // Convert a scoped package
 * // 轉換範圍套件
 * packageNameToTypes('@next/typescript@^1.3.1');
 * // Returns: { name: '@types/next__typescript', scope: '@types', subname: 'next__typescript', ... }
 *
 * @example
 * // Package already @types
 * // 已經是 @types 的套件
 * packageNameToTypes('@types/node@^18.0.0');
 * // Returns: { name: '@types/node', scope: '@types', subname: 'node', ... }
 */
function packageNameToTypes(packageName, prefix) {
    /**
     * 解析輸入的套件名稱（可含版本），後續只取其中的名稱部分
     * Parse the input package name (version optional); only the name part is used below
     */
    let ret = (0, parseArgvPkgName_1.parsePackageName)(packageName);
    /**
     * 預設前綴為 @types / Default prefix is `@types`
     */
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    /**
     * 前綴本身必須是合法的 scope（如 @types），否則組出的名稱會無效
     * The prefix itself must be a valid scope (e.g. `@types`), otherwise the composed name would be invalid
     */
    (0, pkg_name_util_1.assertScope)(prefix, true);
    let { result } = ret;
    /**
     * @types 套件的 scope 就是前綴本身，與輸入套件的範圍無關
     * The scope of the @types package is the prefix itself, regardless of the input package's scope
     */
    let scope = prefix;
    /**
     * 將套件名稱轉換為 @types 格式（範圍以雙底線連接）
     * Escape the package name into the @types format (scope joined with double underscores)
     */
    let subname = (0, escapePackageNameToTypes_1.escapePackageNameToTypes)(result, prefix);
    /**
     * 用前綴與轉換後的名稱組出完整的 @types 套件名稱
     * Compose the full @types package name from the prefix and the escaped name
     */
    let name = (0, pkg_name_util_1.formatPackageName)({
        scope: prefix,
        name: subname,
    });
    /**
     * 保留 parsePackageName 的其餘欄位（result、semver 等），只覆寫 name/scope/subname
     * Keep the remaining fields from parsePackageName (result, semver, ...) and only
     * overwrite `name` / `scope` / `subname`
     */
    return {
        ...ret,
        name,
        scope,
        subname,
    };
}
//# sourceMappingURL=packageNameToTypes.js.map
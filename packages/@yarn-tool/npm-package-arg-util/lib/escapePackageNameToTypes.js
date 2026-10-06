"use strict";
/**
 * @fileoverview Utility function to escape package names for TypeScript @types format
 * @description 將套件名稱轉換為 TypeScript @types 格式的跳脫工具函數
 *
 * This module provides a function to convert package names to the format
 * used by TypeScript's DefinitelyTyped repository for @types packages.
 *
 * 本模組提供將套件名稱轉換為 TypeScript 的 DefinitelyTyped 儲存庫
 * 用於 @types 套件的格式的函數。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapePackageNameToTypes = escapePackageNameToTypes;
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
/**
 * Escape a package name for TypeScript @types format
 * 將套件名稱轉換為 TypeScript @types 格式
 *
 * This function converts a package name to the format used by @types packages.
 * For scoped packages, the scope is prefixed with double underscores.
 *
 * 此函數將套件名稱轉換為 @types 套件使用的格式。
 * 對於範圍套件，範圍會以雙底線作為前綴。
 *
 * Conversion rules:
 * - Simple packages: "lodash" -> "lodash"
 * - Scoped packages: "@next/typescript" -> "next__typescript"
 * - Already @types: "@types/node" -> "node" (no change needed)
 *
 * 轉換規則：
 * - 簡單套件："lodash" -> "lodash"
 * - 範圍套件："@next/typescript" -> "next__typescript"
 * - 已經是 @types："@types/node" -> "node"（無需變更）
 *
 * @param {object} options - The package information
 * @param {object} options - 套件資訊
 *
 * @param {string} [options.scope] - The package scope (without @)
 * @param {string} [options.scope] - 套件範圍（不含 @）
 *
 * @param {string} options.name - The package name
 * @param {string} options.name - 套件名稱
 *
 * @param {string} [prefix='@types'] - The types prefix to check against
 * @param {string} [prefix='@types'] - 要檢查的類型前綴
 *
 * @returns {string} The escaped package name for @types format
 * @returns {string} 轉換為 @types 格式的套件名稱
 *
 * @example
 * // Simple package
 * // 簡單套件
 * escapePackageNameToTypes({ name: 'lodash' });
 * // Returns: 'lodash'
 *
 * @example
 * // Scoped package
 * // 範圍套件
 * escapePackageNameToTypes({ scope: '@next', name: '@next/typescript' });
 * // Returns: 'next__typescript'
 *
 * @example
 * // Already @types package
 * // 已經是 @types 套件
 * escapePackageNameToTypes({ scope: '@types', name: '@types/node' });
 * // Returns: 'node'
 */
function escapePackageNameToTypes(options, prefix) {
    var _a;
    /**
     * 預設前綴為 @types / Default prefix is `@types`
     */
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    /**
     * 從名稱中移除範圍以取得基礎套件名稱，
     * 因為 @types 命名只會用到範圍之後的部分
     *
     * Strip the scope from the name to get the base package name, since @types naming only
     * uses the part after the scope
     */
    const name = (0, pkg_name_util_1.stripScope)(options.name);
    /**
     * 套件有範圍且不是 @types 範圍時，用雙底線把範圍接到名稱前面，
     * 這是 TypeScript DefinitelyTyped 對範圍套件的命名慣例；
     * 已經是 @types 範圍則不再重複加上
     *
     * When the package has a scope other than `@types`, the scope is prefixed with double
     * underscores, following the TypeScript DefinitelyTyped naming convention; an `@types`
     * scope is left untouched to avoid adding it twice
     */
    if (((_a = options.scope) === null || _a === void 0 ? void 0 : _a.length) > 0 && options.scope !== prefix) {
        return options.scope.replace('@', '') + '__' + name;
    }
    return name;
}
//# sourceMappingURL=escapePackageNameToTypes.js.map
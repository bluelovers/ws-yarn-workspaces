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
export declare function escapePackageNameToTypes(options: {
    scope?: string;
    name: string;
}, prefix?: string): string;

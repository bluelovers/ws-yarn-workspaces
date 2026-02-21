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
import { IParsePackageName } from './types';
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
export declare function packageNameToTypes(packageName: string, prefix?: string): IParsePackageName;

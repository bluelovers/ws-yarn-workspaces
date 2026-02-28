/**
 * Sort package.json scripts field / 排序 package.json scripts 欄位
 *
 * This module provides the core sorting functionality for package.json scripts.
 * By default, it follows npm lifecycle scripts order for better readability.
 *
 * 此模組提供 package.json scripts 的核心排序功能。
 * 預設遵循 npm 生命週期腳本順序，提高可讀性。
 *
 * @module sort-package-json-scripts/lib/sortScripts
 *
 * @example
 * ```typescript
 * import sortPackageJsonScripts from 'sort-package-json-scripts/lib/sortScripts';
 *
 * const scripts = {
 *   'lint': 'npx eslint *.ts',
 *   'test': 'jest --coverage',
 *   'pretest': 'npm run lint',
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts);
 * // Returns: { pretest: 'npm run lint', test: 'jest --coverage', lint: 'npx eslint *.ts' }
 * ```
 */
import { ISortPackageJsonScriptsOptions } from './types';
/**
 * Core sorting function that sorts scripts by key order.
 * 核心排序函式，按鍵值順序排序腳本。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @internal
 */
export declare function _core<T extends Record<string, any>>(scripts: T, opts: ISortPackageJsonScriptsOptions): T;
/**
 * Legacy sorting function (simple sort without grouping).
 * 舊版排序函式（簡單排序，無分組）。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @deprecated Use sortPackageJsonScripts instead / 請改用 sortPackageJsonScripts
 */
export declare function sortPackageJsonScriptsOld<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T;
/**
 * Sort package.json scripts field following npm lifecycle scripts order.
 * 排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序。
 *
 * This function sorts scripts and groups related scripts together.
 * For example, pretest, test, and posttest will be grouped in order.
 *
 * 此函式排序腳本並將相關腳本分組在一起。
 * 例如，pretest、test 和 posttest 將按順序分組。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @example
 * ```typescript
 * const scripts = {
 *   'lint': 'npx eslint *.ts',
 *   'npm:publish': 'npm publish',
 *   'test': 'jest --coverage',
 *   'coverage': 'npx nyc yarn run test',
 *   'pretest': 'npm run lint',
 *   'posttest': 'echo done',
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts);
 * // Scripts are sorted by npm lifecycle order with related scripts grouped
 * ```
 */
export declare function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T;
export default sortPackageJsonScripts;

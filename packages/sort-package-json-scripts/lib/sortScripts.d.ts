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
 * 核心排序函式 - 使用鍵值順序進行簡單排序
 * Core sorting function - simple sort using key order
 *
 * 此函式是基本的排序實現，直接使用 handleKeyOrdersCore 產生的順序來排序腳本。
 * 不會進行額外的分組處理，適合需要保持原有腳本結構的場景。
 *
 * @template T - scripts 物件類型
 * @param scripts - 要排序的 scripts 物件
 * @param opts - 排序選項
 * @returns 排序後的 scripts 物件
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
 * 排序邏輯說明：
 * 1. 首先使用 _core 函式進行基礎排序
 * 2. 建立 topMap 資料結構來追蹤腳本之間的關係：
 *    - 第一層：基礎鍵（如 'test'）
 *    - 第二層：子鍵（如 ':watch'、':coverage'）
 *    - 第三層：前綴（如 'pre'、'post'、''）
 *    - 第四層：完整尾碼（如 ':watch'、'Only'）
 * 3. 遞迴處理每個層級，確保相關腳本保持在一起
 * 4. 最後使用排序後的鍵重新排列物件
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

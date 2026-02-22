/**
 * Type definitions for sort-package-json-scripts.
 * sort-package-json-scripts 的類型定義。
 *
 * @module sort-package-json-scripts/lib/types
 */

import { omitKey, defaultNpmScriptsOrder, otherScriptNames } from './util';

/**
 * Options for sorting package.json scripts.
 * 排序 package.json scripts 的選項。
 */
export interface ISortPackageJsonScriptsOptions
{
	/**
	 * Additional script names to treat as "other" scripts.
	 * 額外的腳本名稱，視為「其他」腳本。
	 *
	 * This helps avoid omitKey incorrectly parsing script names.
	 * 這有助於避免 omitKey 錯誤解析腳本名稱。
	 *
	 * @example ['prettier', 'eslint']
	 */
	otherScriptNames?: typeof otherScriptNames;

	/**
	 * Custom script order for grouping/sorting.
	 * 自定義腳本順序用於分組/排序。
	 *
	 * By default, follows npm lifecycle scripts order.
	 * 預設遵循 npm 生命週期腳本順序。
	 */
	defaultNpmScriptsOrder?: typeof defaultNpmScriptsOrder;

	/**
	 * Custom function to extract the base key from a script name.
	 * 自定義函式從腳本名稱中提取基礎鍵。
	 *
	 * Used to group related scripts (e.g., pretest, test, posttest).
	 * 用於分組相關腳本（如 pretest、test、posttest）。
	 */
	omitKeyFn?: typeof omitKey;

	/**
	 * Custom sort function for comparing script keys.
	 * 自定義排序函式用於比較腳本鍵。
	 *
	 * @param a - First key to compare / 第一個要比較的鍵
	 * @param b - Second key to compare / 第二個要比較的鍵
	 * @returns Negative if a < b, positive if a > b, zero if equal
	 */
	sortKeyFn?: (a: string, b: string) => number;
}

/**
 * Required options type with all optional fields filled.
 * 必需選項類型，所有可選欄位都已填入。
 */
export type ISortPackageJsonScriptsOptionsRequired =
	Required<Omit<ISortPackageJsonScriptsOptions, 'sortKeyFn'>>
	& Pick<ISortPackageJsonScriptsOptions, 'sortKeyFn'>;

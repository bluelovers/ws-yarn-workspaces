/**
 * Sort package.json exports field / 排序 package.json exports 欄位
 *
 * This module provides utilities for sorting the exports field in package.json.
 * It ensures consistent key ordering for better readability and version control.
 *
 * 此模組提供排序 package.json 中 exports 欄位的工具函式。
 * 確保鍵值順序一致，提高可讀性和版本控制友好性。
 *
 * @module @yarn-tool/sort-package-json-exports
 *
 * @example
 * ```typescript
 * import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';
 *
 * const exports = {
 *   '.': {
 *     import: './dist/index.esm.mjs',
 *     require: './dist/index.cjs',
 *     types: './dist/index.d.ts',
 *   },
 * };
 *
 * const sorted = sortPackageJsonExports(exports);
 * // Returns: { '.': { types: './dist/index.d.ts', require: './dist/index.cjs', import: './dist/index.esm.mjs' } }
 * ```
 */

import { IPackageJson } from '@ts-type/package-dts/package-json';
import { sortObjectKeys } from 'sort-object-keys2';
import isPlainObject from 'is-plain-obj';
import {
	IPackageExportsEntryObject, IPackageExportsValue,
} from '@ts-type/package-dts/lib/package-json/exports';

/**
 * Check if the exports value is an entry object (not a string).
 * 檢查 exports 值是否為項物件（非字串）。
 *
 * @template T - The exports value type / exports 值類型
 * @template O - The exports entry object type / exports 項物件類型
 * @param exports - The exports value to check / 要檢查的 exports 值
 * @returns True if exports is an entry object / 若 exports 為項物件則返回 true
 */
export function isPackageJsonExportsEntryObject<T extends IPackageExportsValue, O extends IPackageExportsEntryObject = IPackageExportsEntryObject>(exports: T): exports is Extract<T, O>
{
	return isPlainObject(exports)
}

/**
 * Options for sorting package.json exports.
 * 排序 package.json exports 的選項。
 */
export interface IOptions
{
	/**
	 * Custom order for root-level exports keys.
	 * 根層級 exports 鍵的自定義順序。
	 *
	 * These keys will be prepended to the default order.
	 * 這些鍵將被添加到預設順序的前面。
	 */
	rootOrder?: readonly string[];
	/**
	 * Custom order for nested exports entry keys.
	 * 巢狀 exports 項鍵的自定義順序。
	 *
	 * These keys will be prepended to the default order.
	 * 這些鍵將被添加到預設順序的前面。
	 */
	entryOrder?: readonly string[];
}

/**
 * Handle and merge options with defaults.
 * 處理並合併選項與預設值。
 *
 * @param options - Custom options / 自定義選項
 * @returns Merged root and entry order arrays / 合併後的根和項順序陣列
 *
 * @internal
 */
export function _handleOptions(options?: IOptions)
{
	/**
	 * Default order for root-level exports keys.
	 * 根層級 exports 鍵的預設順序。
	 *
	 * Order: types, require, import, node, node-addons
	 * This follows Node.js resolution algorithm preferences.
	 * 順序：types, require, import, node, node-addons
	 * 遵循 Node.js 解析演算法偏好。
	 */
	const rootOrder = [
		'types',
		'require',
		'import',
		'node',
		'node-addons',
	];

	/**
	 * Default order for nested exports entry keys.
	 * 巢狀 exports 項鍵的預設順序。
	 *
	 * Includes root order keys plus: default, ., ./, ./package.json
	 * 包含根順序鍵加上：default, ., ./, ./package.json
	 */
	const entryOrder = [
		...rootOrder,
		'default',
		'.',
		'./',
		'./package.json',
	];

	if (options)
	{
		if (options.rootOrder?.length)
		{
			rootOrder.splice(0, 0, ...options.rootOrder);
		}
		if (options.entryOrder?.length)
		{
			entryOrder.splice(0, 0, ...options.entryOrder);
		}
	}

	return {
		rootOrder,
		entryOrder,
	}
}

/**
 * Sort the exports field in package.json.
 * 排序 package.json 中的 exports 欄位。
 *
 * Sorts both root-level keys and nested entry keys according to
 * a predefined order that follows Node.js resolution preferences.
 *
 * 根據預定義的順序排序根層級鍵和巢狀項鍵，遵循 Node.js 解析偏好。
 *
 * @param exports - The exports value from package.json / 來自 package.json 的 exports 值
 * @param options - Custom sorting options / 自定義排序選項
 * @returns The sorted exports object / 排序後的 exports 物件
 *
 * @example
 * ```typescript
 * const exports = {
 *   '.': {
 *     import: './dist/index.esm.mjs',
 *     require: './dist/index.cjs',
 *     types: './dist/index.d.ts',
 *   },
 *   './sub': {
 *     default: './dist/sub.js',
 *     types: './dist/sub.d.ts',
 *   },
 * };
 *
 * const sorted = sortPackageJsonExports(exports);
 * // Returns:
 * // {
 * //   '.': { types: './dist/index.d.ts', require: './dist/index.cjs', import: './dist/index.esm.mjs' },
 * //   './sub': { types: './dist/sub.d.ts', default: './dist/sub.js' }
 * // }
 * ```
 */
export function sortPackageJsonExports(exports: IPackageJson["exports"], options?: IOptions)
{
	if (isPackageJsonExportsEntryObject(exports))
	{
		const { rootOrder, entryOrder } = _handleOptions(options);

		sortObjectKeys(exports, {
			keys: rootOrder,
			useSource: true,
		});

		Object.keys(exports)
			.forEach(key =>
			{
				const value = exports[key];

				if (isPackageJsonExportsEntryObject(value))
				{
					exports[key] = sortObjectKeys(value, {
						keys: entryOrder,
						useSource: true,
					});
				}
			})
	}

	return exports
}

export default sortPackageJsonExports

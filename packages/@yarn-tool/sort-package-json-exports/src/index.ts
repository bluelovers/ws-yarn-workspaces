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
	 *
	 * 注意：此處在自訂 rootOrder 前置之前就已展開 rootOrder，
	 * 因此自訂 rootOrder 不會自動帶入 entryOrder，需分別以 entryOrder 指定。
	 *
	 * Note: `rootOrder` is spread here *before* any custom `rootOrder` prepending,
	 * so a custom `rootOrder` does not leak into `entryOrder`; specify both to
	 * override both levels.
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
		/**
		 * 僅在傳入非空陣列時才前置（Prepend）：
		 * 空陣列 splice 出去雖無副作用，但會讓「已明確指定空順序」與「未指定」難以區分，
		 * 並避免不必要的 O(n) 拷貝。
		 *
		 * Only prepend when a non-empty array is given: splicing an empty array is a
		 * no-op yet blurs the distinction between "explicitly empty" and "unset", and
		 * it would cost an unnecessary O(n) copy.
		 */
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
	/**
	 * 先做型別守衛（Type guard）：exports 可能是字串、陣列或 undefined（合法的簡寫形式），
	 * 這些形式沒有鍵可排，直接跳過排序以免改寫非物件的值。
	 *
	 * Guard first with a type check: `exports` may legally be a string, an array or
	 * undefined (shorthand forms); those have no keys to sort, so sorting is skipped
	 * to avoid rewriting a non-object value.
	 */
	if (isPackageJsonExportsEntryObject(exports))
	{
		const { rootOrder, entryOrder } = _handleOptions(options);

		/**
		 * useSource: true 表示直接在來源物件上原地回寫，
		 * 因此此處不接回傳值（sortObjectKeys 仍會回傳同一個物件）。
		 * 順序表未列出的鍵會被排到已知鍵之後，原有的鍵不會遺失。
		 *
		 * `useSource: true` writes the sorted result back into the source object, so
		 * the return value is intentionally ignored here (`sortObjectKeys` still
		 * returns the same object). Keys missing from the order list are pushed after
		 * the known ones; no existing key is lost.
		 */
		sortObjectKeys(exports, {
			keys: rootOrder,
			useSource: true,
		});

		/**
		 * 根層級排序完成後，再逐一處理每個子路徑（Subpath）的入口條件（Condition）；
		 * 使用 Object.keys 而非重新取值，是為了保持剛排序過的根層級順序。
		 *
		 * After root-level ordering, iterate each subpath to sort its conditions;
		 * `Object.keys` reuses the just-sorted root order instead of re-reading the
		 * object in a different sequence.
		 */
		Object.keys(exports)
			.forEach(key =>
			{
				const value = exports[key];

				/**
				 * 僅排序仍是項物件的入口；若某子路徑的值是字串（合法的簡寫），
				 * 則原樣保留，不呼叫 sortObjectKeys。
				 *
				 * Only entry objects are sorted; if a subpath's value is a string (a
				 * legal shorthand), it is left untouched and `sortObjectKeys` is not
				 * called for it.
				 */
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

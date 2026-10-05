/**
 * @fileoverview Array Manipulation Utilities for Scope Management
 * 
 * Provides utility functions for adding and removing items from arrays
 * while tracking changes. Used for managing workspace scope arrays.
 * 
 * @module @yarn-tool/ws-scope/util/arrayAdd
 */

import { array_unique_overwrite } from 'array-hyper-unique';

/**
 * Result object from array manipulation operations
 * 
 * @template T - The array element type
 */
interface ArrayOperationResult<T>
{
	/**
	 * 是否已修改陣列，讓呼叫端只在真正變動時才標記 dirty
	 * Whether the array was modified, so callers can mark dirty only on real changes
	 */
	changed: boolean;

	/**
	 * 經新增/去重處理後的陣列本身
	 * The array itself after add/dedup processing
	 */
	value: T[];
}

/**
 * Adds a scope path to an array if not already present
 * 
 * @param {string} scope - The scope path to add / 要新增的範圍路徑
 * @param {string[]} [value=[]] - The array to modify / 要修改的陣列
 * @returns {ArrayOperationResult<string>} Result with changed flag and modified array / 回傳含變更旗標與修改後陣列的結果
 * @throws {Error} Throws if value is not an array / 若 value 不是陣列則拋出錯誤
 * 
 * @description
 * Adds the scope to the array only if it doesn't already exist.
 * Also ensures uniqueness of all elements in the array.
 * 
 * @example
 * ```typescript
 * const result = arrayAdd('packages/*', ['packages/a/*']);
 * // result.changed = true
 * // result.value = ['packages/a/*', 'packages/*']
 * ```
 */
export function arrayAdd(scope: string, value?: string[]): ArrayOperationResult<string>
{
	value ??= [];

	/**
	 * 執行期防禦：參數宣告為 string[] 但外部可能傳入非陣列，
	 * 提前拋錯避免後續 .includes/.push 靜默失敗
	 * Runtime defense: the parameter is typed string[] but callers may pass
	 * a non-array; fail fast instead of letting .includes/.push fail silently
	 */
	if (!Array.isArray(value))
	{
		throw new Error(`Only support Array but ${value}`)
	}

	let changed = false;

	/**
	 * 僅在元素不存在時才 push 並去重，藉此讓 changed 準確反映「本次真的有變動」
	 * Push and dedup only when the element is absent, so `changed` accurately
	 * reflects whether this call actually altered the array
	 */
	if (!value.includes(scope))
	{
		value.push(scope);

		array_unique_overwrite(value);

		changed = true;
	}

	return {
		changed,
		value,
	}
}

/**
 * Removes a scope path from an array if present
 * 
 * @param {string} scope - The scope path to remove / 要移除的範圍路徑
 * @param {string[]} value - The array to modify / 要修改的陣列
 * @returns {ArrayOperationResult<string>} Result with changed flag and modified array / 回傳含變更旗標與修改後陣列的結果
 * 
 * @description
 * Removes the first occurrence of the scope from the array.
 * Returns the modified array and a flag indicating if a change was made.
 * 
 * @example
 * ```typescript
 * const result = arrayRemove('packages/*', ['packages/a/*', 'packages/*']);
 * // result.changed = true
 * // result.value = ['packages/a/*']
 * ```
 */
export function arrayRemove(scope: string, value: string[]): ArrayOperationResult<string>
{
	let changed = false;

	/**
	 * 先確認 scope 確實存在再取索引，避免 indexOf 回傳 -1 時 splice 誤刪最後一個元素
	 * Verify presence before taking the index; otherwise indexOf returning -1
	 * would make splice wrongly delete the last element
	 */
	if (value && value.includes(scope))
	{
		let i = value.indexOf(scope);

		value.splice(i, 1);

		changed = true;
	}

	return {
		changed,
		value,
	}
}

/**
 * @fileoverview Array Manipulation Utilities for Scope Management
 *
 * Provides utility functions for adding and removing items from arrays
 * while tracking changes. Used for managing workspace scope arrays.
 *
 * @module @yarn-tool/ws-scope/util/arrayAdd
 */
/**
 * Result object from array manipulation operations
 *
 * @template T - The array element type
 */
interface ArrayOperationResult<T> {
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
export declare function arrayAdd(scope: string, value?: string[]): ArrayOperationResult<string>;
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
export declare function arrayRemove(scope: string, value: string[]): ArrayOperationResult<string>;
export {};

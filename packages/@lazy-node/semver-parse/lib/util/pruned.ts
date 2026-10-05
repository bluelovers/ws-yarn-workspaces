/**
 * @lazy-node/semver-parse 物件修剪工具
 * Object pruning utility for @lazy-node/semver-parse
 *
 * 此模組提供移除物件中 undefined 屬性的功能
 * This module provides functionality to remove undefined properties from objects
 *
 * @packageDocumentation
 */

import { ISimpleSemVerObjectBase, ISimpleSemVer } from '../types';
import { simpleSemVerKeys } from '../const';
import { isSimpleSemVerObjectLike } from '../checker';

/**
 * 移除物件中的 undefined 屬性
 * Remove undefined properties from an object
 *
 * 返回一個新物件，其中所有 undefined 的屬性都已移除。
 * 這對於序列化和清理 semver 物件非常有用。
 *
 * Returns a new object with all undefined properties removed.
 * This is useful for serializing and cleaning semver objects.
 *
 * @template T - 物件類型 / Object type
 * @param {T} obj - 來源物件 / Source object
 * @param {T} [o] - 目標物件（可選）/ Target object (optional)
 * @returns {T} 修剪後的物件 / Pruned object
 *
 * @example
 * ```typescript
 * pruned({ a: 1, b: undefined, c: 'test' });
 * // => { a: 1, c: 'test' }
 *
 * // 使用目標物件 / Using target object
 * const target = {};
 * pruned({ a: 1, b: undefined }, target);
 * // target => { a: 1 }
 * ```
 */
export function pruned<T>(obj: T, o = {} as T)
{
	// 遍歷物件的所有屬性
	// Iterate over all properties of the object
	for (const key in obj)
	{
		// 只複製非 undefined 的屬性
		// Only copy non-undefined properties
		if ('undefined' !== typeof obj[key])
		{
			o[key] = obj[key];
		}
	}
	return o;
}

/**
 * 修剪 SimpleSemVer 物件
 * Prune a SimpleSemVer object
 *
 * 專門用於 SimpleSemVer 物件的修剪函數。
 * 只保留 simpleSemVerKeys 中定義的標準屬性，並移除 undefined 值。
 *
 * Pruning function specifically for SimpleSemVer objects.
 * Only keeps standard properties defined in simpleSemVerKeys, and removes undefined values.
 *
 * @template T - semver 類型 / Semver type
 * @param {T} obj - 來源 semver 物件 / Source semver object
 * @param {T} [o] - 目標物件（可選）/ Target object (optional)
 * @returns {T} 修剪後的 semver 物件 / Pruned semver object
 *
 * @example
 * ```typescript
 * prunedSimpleSemVer({
 *   major: '1',
 *   minor: undefined,
 *   patch: '0',
 *   extra: 'ignored'  // 非標準屬性會被忽略 / Non-standard properties are ignored
 * });
 * // => { major: '1', patch: '0' }
 *
 * // 保留所有標準屬性 / Keep all standard properties
 * prunedSimpleSemVer({
 *   semver: '>=1.2.3',
 *   operator: '>=',
 *   version: '1.2.3',
 *   major: '1',
 *   minor: '2',
 *   patch: '3',
 *   release: undefined,
 *   build: undefined
 * });
 * // => { semver: '>=1.2.3', operator: '>=', version: '1.2.3', major: '1', minor: '2', patch: '3' }
 * ```
 */
export function prunedSimpleSemVer<T extends ISimpleSemVer>(obj: T, o = {} as T)
{
	// 只遍歷 simpleSemVerKeys 中定義的標準屬性
	// Only iterate over standard properties defined in simpleSemVerKeys
	for (const key of simpleSemVerKeys)
	{
		// 只複製非 undefined 的屬性
		// Only copy non-undefined properties
		if ('undefined' !== typeof obj[key])
		{
			// @ts-ignore
			o[key] = obj[key];
		}
	}

	return o;
}

/**
 * 規範化 semver 輸入物件的 operator 欄位
 * Normalize the `operator` field of a semver input object
 *
 * 正則表達式的運算子群組在「沒有運算子」時會捕獲空字串，
 * 直接留下會讓 operator 從「可能不存在」變成「存在但無意義」，
 * 此函式負責把這類殘留值清除，讓後續字串化與比對不必多分支處理。
 * The operator capture group yields an empty string when no operator is
 * present; leaving it turns `operator` from "maybe absent" into "present but
 * meaningless". This function clears such leftovers so later stringification
 * and comparison need no extra branch.
 *
 * @param obj - 來源 semver 物件（會被原地修正）/ Source semver object (normalized in place)
 * @param opts - 初始化旗標 / Initialization flag
 * @param opts.init - true 表示由解析流程呼叫，會一併檢查空字串 operator / When true (called from the parse flow), empty-string operators are also cleaned up
 * @returns 規範化後的物件 / The normalized object
 */
export function normalizeSemVerObjectInput<T extends ISimpleSemVer>(obj: T, opts: {
	init?: boolean,
} = {})
{
	/**
	 * 非初始化呼叫且已是合法版本物件 → 原樣保留、不做任何修改
	 * （此分支刻意保持空實作，僅留下歷史實驗用的被註解程式碼）。
	 * 邊界情況：此路徑下殘留的空字串 operator 不會被清除。
	 * Not an init call and already a valid version object → keep it untouched
	 * (the branch is intentionally empty; only the commented-out experimental
	 * line remains).
	 * Boundary case: a leftover empty-string operator is NOT cleaned on this
	 * path.
	 */
	if (!opts?.init && isSimpleSemVerObjectLike(obj))
	{
		//o.operator ??= '';
	}
	/**
	 * 其餘情況（初始化呼叫，或物件尚不合法）→ 移除空字串 operator，
	 * 避免序列化時輸出 `operator: ''` 這類無意義欄位。
	 * Other cases (init call, or the object is not yet valid) → drop the empty
	 * operator so serialization never emits a meaningless `operator: ''`.
	 */
	else if (obj.operator === '')
	{
		delete obj.operator
	}

	return obj
}

export default prunedSimpleSemVer

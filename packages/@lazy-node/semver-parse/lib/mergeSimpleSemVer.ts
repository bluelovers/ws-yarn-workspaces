/**
 * @lazy-node/semver-parse 版本合併器
 * Version merger for @lazy-node/semver-parse
 *
 * 此模組提供 semver 物件合併功能
 * This module provides semver object merging functionality
 *
 * **注意：此函數僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This function only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */

/**
 * Created by user on 2020/8/12.
 */

import { ISimpleSemVer, ISimpleSemVerObjectBase, IToSimpleSemVerObject } from './types';
import { assertSimpleSemVerObjectLike, assertSimpleSemVerObjectOrOperatorLike } from './checker';
import { isAllowedMergeAbleValue } from './util/isAllowedMergeAbleValue';
import parseSimpleSemVer from './parseSimpleSemVer';
import {
	ITSRequiredWith,
	ITSPickExtra,
	ITSPartialRecord,
	ITSRequiredPick,
	ITSPartialPick,
} from 'ts-type/lib/type/record';

/**
 * 合併兩個 SimpleSemVer 物件
 * Merge two SimpleSemVer objects
 *
 * 將來源物件的版本屬性合併到目標物件中。
 * 只有當目標和來源的值都允許合併時，才會進行合併。
 *
 * Merges version properties from source object into target object.
 * Only merges when both target and source values are allowed for merging.
 *
 * @template T - semver 類型 / Semver type
 * @param {T} target - 目標 semver 物件 / Target semver object
 * @param {ISimpleSemVerObjectBase} b - 來源 semver 物件 / Source semver object
 * @returns {Object} 合併結果 / Merge result
 * @returns {IToSimpleSemVerObject<T>} .target - 合併後的目標物件 / Merged target object
 * @returns {ITSPartialPick<ISimpleSemVerObjectBase, 'major' | 'minor' | 'patch' | 'release' | 'build'>} .changed - 變更的屬性 / Changed properties
 * @throws {TypeError} 當目標或來源不是有效的版本物件時 / When target or source is not a valid version object
 *
 * @example
 * ```typescript
 * // 合併版本部分 / Merge version parts
 * const target = { major: '1', minor: '0', patch: '0' };
 * const source = { minor: '2', patch: '3' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '2', patch: '3' }, changed: { minor: '2', patch: '3' } }
 *
 * // 合併預發布標籤 / Merge pre-release tag
 * const target = { major: '1', minor: '0', patch: '0' };
 * const source = { minor: '2', release: 'beta.1' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '2', patch: '0', release: 'beta.1' }, changed: { minor: '2', release: 'beta.1' } }
 *
 * // 萬用字元不會被合併 / Wildcards are not merged
 * const target = { major: '1', minor: '2', patch: '3' };
 * const source = { patch: 'x' };
 * mergeSimpleSemVer(target, source);
 * // => { target: { major: '1', minor: '2', patch: '3' }, changed: undefined }
 * ```
 */
export function mergeSimpleSemVer<T extends ISimpleSemVer, R extends ISimpleSemVerObjectBase>(target: T, b: R): {
	target: IToSimpleSemVerObject<T & R>;
	changed: ITSPartialPick<ISimpleSemVerObjectBase, 'major' | 'minor' | 'patch' | 'release' | 'build'>;
}
{
	// 斷言目標和來源都是有效的版本物件
	// Assert both target and source are valid version objects
	assertSimpleSemVerObjectLike(target);
	assertSimpleSemVerObjectLike(b);

	// 記錄變更的屬性
	// Track changed properties
	let changed: ITSPartialPick<ISimpleSemVerObjectBase, 'major' | 'minor' | 'patch' | 'release' | 'build'>;

	// 遍歷所有可合併的版本屬性
	// Iterate over all mergeable version properties
	([
		'major',
		'minor',
		'patch',
		'release',
		'build',
	] as (keyof typeof changed)[]).forEach(key =>
	{
		// 獲取目標和來源的值
		// Get target and source values
		let value1: string = target[key];
		let value2: string = b[key];

		// 只有當兩個值都允許合併時才進行合併
		// Only merge when both values are allowed for merging
		// 允許的值：非空字串且不是 '*' 或 'x'
		// Allowed values: non-empty string and not '*' or 'x'
		if (isAllowedMergeAbleValue(value1) && isAllowedMergeAbleValue(value2))
		{
			changed ??= {};

			// 更新目標物件的值
			// Update target object's value
			target[key] = value2;

			// 記錄變更
			// Record change
			changed[key] = value2;
		}
	});

	return {
		target: target as IToSimpleSemVerObject<T & R>,
		changed,
	}
}

export default mergeSimpleSemVer

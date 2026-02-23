/**
 * @lazy-node/semver-parse SimpleSemVer 類別
 * SimpleSemVer class for @lazy-node/semver-parse
 *
 * 此模組提供 SimpleSemVer 類別，用於封裝 semver 物件並提供便捷方法
 * This module provides the SimpleSemVer class for encapsulating semver objects with convenient methods
 *
 * **注意：此類別僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This class only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */

import {
	ISimpleSemVerObject,
	ISimpleSemVer,
	ISimpleSemVerObjectBase,
	ISimpleSemVerOperator,
	IHasOperator, IOperator, IToSimpleSemVerObject, IToSimpleSemVerOperator, IToSimpleSemVerObjectOrOperator,
} from './types';
import { stringifySimpleSemVer } from './stringifySimpleSemVer';
import { pruned, prunedSimpleSemVer } from './util/pruned';
import {
	hasOperator,
	isSimpleSemVerOperatorLike,
	isSimpleSemVerObjectLike,
	assertSimpleSemVerObjectOrOperatorLike, isSimpleSemVerObjectOrOperatorLike,
} from './checker';
import { parseSimpleSemVer } from './parseSimpleSemVer';

/**
 * SimpleSemVer 類別
 * SimpleSemVer class
 *
 * 封裝 semver 物件，提供類型檢查、序列化和轉換方法
 * Encapsulates semver objects, providing type checking, serialization, and conversion methods
 *
 * @template T - semver 類型 / Semver type
 *
 * @example
 * ```typescript
 * // 從版本字串建立 / Create from version string
 * const semver = SimpleSemVer.create('>=1.2.3-beta.1');
 *
 * // 檢查類型 / Check types
 * if (semver.isValidObject()) {
 *   console.log(semver.major); // '1'
 *   console.log(semver.minor); // '2'
 *   console.log(semver.patch); // '3'
 * }
 *
 * // 序列化 / Serialize
 * semver.toString(); // '1.2.3-beta.1'
 * semver.toFullString(); // '>=1.2.3-beta.1'
 * semver.toJSON(); // { operator: '>=', major: '1', ... }
 * ```
 */
export class SimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer> implements ISimpleSemVerObjectBase
{
	/**
	 * 完整 semver 字串
	 * Full semver string
	 *
	 * 包含運算子的原始版本字串
	 * Original version string including operator
	 */
	readonly semver?: string;

	/**
	 * 版本範圍運算子
	 * Version range operator
	 *
	 * 如 ^, ~, >=, <=, || 等
	 * Such as ^, ~, >=, <=, ||, etc.
	 */
	readonly operator?: IOperator;

	/**
	 * 版本字串
	 * Version string
	 *
	 * 不含運算子的版本字串
	 * Version string without operator
	 */
	readonly version?: string;

	/**
	 * 主版本號
	 * Major version number
	 */
	readonly major?: string;

	/**
	 * 次版本號
	 * Minor version number
	 */
	readonly minor?: string;

	/**
	 * 修補版本號
	 * Patch version number
	 */
	readonly patch?: string;

	/**
	 * 預發布標籤
	 * Pre-release tag
	 *
	 * 如 beta.1, alpha.2 等
	 * Such as beta.1, alpha.2, etc.
	 */
	readonly release?: string;

	/**
	 * 建置元資料
	 * Build metadata
	 *
	 * 如 build.123 等
	 * Such as build.123, etc.
	 */
	readonly build?: string;

	/**
	 * 建構函式
	 * Constructor
	 *
	 * @param {T} obj - semver 物件 / Semver object
	 * @throws {TypeError} 當物件不是有效的 semver 物件或運算子時 / When object is not a valid semver object or operator
	 */
	constructor(obj: T)
	{
		assertSimpleSemVerObjectOrOperatorLike(obj);

		// @ts-ignore
		prunedSimpleSemVer(obj, this as any)
	}

	/**
	 * 從版本字串建立 SimpleSemVer 實例
	 * Create SimpleSemVer instance from version string
	 *
	 * 靜態工廠方法，解析版本字串並建立新實例
	 * Static factory method that parses version string and creates new instance
	 *
	 * @template T - semver 類型 / Semver type
	 * @param {string} version - 版本字串 / Version string
	 * @returns {IToSimpleSemVerObjectOrOperator<SimpleSemVer<T>>} SimpleSemVer 實例 / SimpleSemVer instance
	 *
	 * @example
	 * ```typescript
	 * const semver = SimpleSemVer.create('>=1.2.3');
	 * const operatorOnly = SimpleSemVer.create('||');
	 * ```
	 */
	static create<T extends ISimpleSemVer = ISimpleSemVer>(version: string)
	{
		return new this<T>(parseSimpleSemVer(version) as any) as IToSimpleSemVerObjectOrOperator<SimpleSemVer<T>>
	}

	/**
	 * 檢查是否為有效的 semver 物件或運算子
	 * Check if it's a valid semver object or operator
	 *
	 * @returns {boolean} 是否有效 / Whether it's valid
	 */
	isValid(): this is IToSimpleSemVerObjectOrOperator<SimpleSemVer<IToSimpleSemVerObjectOrOperator<T>>>
	{
		return isSimpleSemVerObjectOrOperatorLike(this)
	}

	/**
	 * 檢查是否為純運算子
	 * Check if it's a pure operator
	 *
	 * @returns {boolean} 是否為運算子 / Whether it's an operator
	 */
	isValidOperator(): this is IToSimpleSemVerOperator<SimpleSemVer<IToSimpleSemVerOperator<T>>>
	{
		return isSimpleSemVerOperatorLike(this)
	}

	/**
	 * 檢查是否為有效的版本物件
	 * Check if it's a valid version object
	 *
	 * @returns {boolean} 是否為版本物件 / Whether it's a version object
	 */
	isValidObject(): this is IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>
	{
		return isSimpleSemVerObjectLike(this)
	}

	/**
	 * 檢查是否具有運算子
	 * Check if it has an operator
	 *
	 * @returns {boolean} 是否具有運算子 / Whether it has an operator
	 */
	hasOperator(): this is IHasOperator<SimpleSemVer<IHasOperator<T>>>
	{
		return hasOperator(this)
	}

	/**
	 * 轉換為 JSON 物件
	 * Convert to JSON object
	 *
	 * 移除所有 undefined 屬性，返回純粹的 semver 物件
	 * Removes all undefined properties, returns a pure semver object
	 *
	 * @returns {T} JSON 物件 / JSON object
	 */
	toJSON(): T
	{
		return prunedSimpleSemVer(this as any);
	}

	/**
	 * 轉換為版本字串
	 * Convert to version string
	 *
	 * 返回不含運算子的版本字串
	 * Returns version string without operator
	 *
	 * @returns {string} 版本字串 / Version string
	 */
	toString()
	{
		return stringifySimpleSemVer(this as any);
	}

	/**
	 * 轉換為完整版本字串
	 * Convert to full version string
	 *
	 * 返回包含運算子的完整版本字串
	 * Returns full version string including operator
	 *
	 * @returns {string} 完整版本字串 / Full version string
	 */
	toFullString()
	{
		return (this.operator ?? '') + this.toString();
	}

}

export default SimpleSemVer

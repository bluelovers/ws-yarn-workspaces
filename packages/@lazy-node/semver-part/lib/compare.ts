/**
 * 版本部分比較工具 / Version part comparison utilities
 * 
 * @module @lazy-node/semver-part/lib/compare
 * 
 * 此模組提供比較 semver 版本部分的功能，支援不完整的版本字串比較。
 * This module provides functionality to compare semver version parts,
 * supporting comparison of incomplete version strings.
 * 
 * @example
 * ```typescript
 * import { compare, eq, gt, gte, lt, lte, neq, cmp } from '@lazy-node/semver-part/lib/compare';
 * 
 * // 比較版本部分 / Compare version parts
 * compare('1.2', '1.3'); // -1
 * eq('1.2', '1.2'); // true
 * gt('1.3', '1.2'); // true
 * lt('1.2', '1.3'); // true
 * 
 * // 使用運算子比較 / Compare with operator
 * cmp('1.2', '>', '1.1'); // true
 * cmp('1.2', '<', '1.3'); // true
 * ```
 */
import { _part } from './_core';

import _compare from 'semver/functions/compare';

import _cmp from 'semver/functions/cmp';
import { Operator as ISemverOperator, Options as ISemverOptions } from 'semver';

export type { ISemverOperator, ISemverOptions };

/**
 * 比較選項或寬鬆模式 / Comparison options or loose mode
 * 
 * 可傳入布林值啟用寬鬆模式，或傳入完整的選項物件
 * Can pass boolean to enable loose mode, or pass complete options object
 */
export type IOptionsOrLoose = boolean | ISemverOptions

/**
 * 比較結果類型 / Comparison result type
 * 
 * - `1`: 第一個版本大於第二個 / First version is greater
 * - `0`: 版本相等 / Versions are equal
 * - `-1`: 第一個版本小於第二個 / First version is less
 */
export type ICompareReturnType = 1 | 0 | -1

/**
 * 比較兩個版本部分
 * Compare two version parts
 * 
 * 將版本部分標準化後進行比較
 * Normalizes version parts before comparison
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果 / Comparison result
 * 
 * @example
 * ```typescript
 * compare('1.2.3', '1.3.0'); // -1
 * compare('1.3.0', '1.2.3'); // 1
 * compare('1.2.3', '1.2.3'); // 0
 * compare('2.3', '2.4'); // -1 (自動補全為 0.2.3 vs 0.2.4)
 * ```
 */
export function compare(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): ICompareReturnType
{
	return _compare(..._part(part1, part2), optionsOrLoose as any)
}

/**
 * 檢查兩個版本部分是否相等
 * Check if two version parts are equal
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否相等 / Whether equal
 * 
 * @example
 * ```typescript
 * eq('1.2.3', '1.2.3'); // true
 * eq('1.2', '1.2.0'); // true (自動補全)
 * eq('1.2', '1.3'); // false
 * ```
 */
export function eq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) === 0
}

/**
 * 檢查兩個版本部分是否不相等
 * Check if two version parts are not equal
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否不相等 / Whether not equal
 * 
 * @example
 * ```typescript
 * neq('1.2', '1.3'); // true
 * neq('1.2', '1.2'); // false
 * ```
 */
export function neq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) !== 0
}

/**
 * 檢查第一個版本部分是否大於第二個
 * Check if first version part is greater than second
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否大於 / Whether greater
 * 
 * @example
 * ```typescript
 * gt('1.3', '1.2'); // true
 * gt('1.2', '1.3'); // false
 * ```
 */
export function gt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) > 0
}

/**
 * 檢查第一個版本部分是否大於或等於第二個
 * Check if first version part is greater than or equal to second
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否大於或等於 / Whether greater or equal
 * 
 * @example
 * ```typescript
 * gte('1.3', '1.2'); // true
 * gte('1.2', '1.2'); // true
 * gte('1.1', '1.2'); // false
 * ```
 */
export function gte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) >= 0
}

/**
 * 檢查第一個版本部分是否小於第二個
 * Check if first version part is less than second
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否小於 / Whether less
 * 
 * @example
 * ```typescript
 * lt('1.2', '1.3'); // true
 * lt('1.3', '1.2'); // false
 * ```
 */
export function lt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) < 0
}

/**
 * 檢查第一個版本部分是否小於或等於第二個
 * Check if first version part is less than or equal to second
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 是否小於或等於 / Whether less or equal
 * 
 * @example
 * ```typescript
 * lte('1.2', '1.3'); // true
 * lte('1.2', '1.2'); // true
 * lte('1.3', '1.2'); // false
 * ```
 */
export function lte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) <= 0
}

/**
 * 使用指定運算子比較兩個版本部分
 * Compare two version parts with specified operator
 * 
 * @param part1 - 第一個版本部分 / First version part
 * @param operator - 比較運算子 / Comparison operator ('>' | '>=' | '<' | '<=' | '=' | '==' | '===' | '!=' | '!==')
 * @param part2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果 / Comparison result
 * 
 * @example
 * ```typescript
 * cmp('1.2', '>', '1.1'); // true
 * cmp('1.2', '<', '1.3'); // true
 * cmp('1.2', '=', '1.2'); // true
 * cmp('1.2', '>=', '1.2'); // true
 * ```
 */
export function cmp(part1: string, operator: ISemverOperator, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	const [v1, v2] = _part(part1, part2)

	return _cmp(v1, operator, v2, optionsOrLoose)
}

/**
 * 嘗試比較兩個版本部分，失敗時返回 undefined
 * Try to compare two version parts, returns undefined on failure
 * 
 * 安全的比較函數，不會拋出異常
 * Safe comparison function that won't throw exceptions
 * 
 * @param v1 - 第一個版本部分 / First version part
 * @param v2 - 第二個版本部分 / Second version part
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 比較結果或 undefined / Comparison result or undefined
 * 
 * @example
 * ```typescript
 * tryCompare('1.2', '1.3'); // -1
 * tryCompare('invalid', '1.2'); // undefined (不拋出異常)
 * ```
 */
export function tryCompare(v1: string, v2: string, optionsOrLoose?: IOptionsOrLoose)
{
	try
	{
		return compare(v1, v2, optionsOrLoose);
	}
	catch (e)
	{}
}

/**
 * @lazy-node/semver-parse 範圍字串化器
 * Range stringifier for @lazy-node/semver-parse
 *
 * 此模組提供 semver 範圍陣列轉換為字串的功能
 * This module provides functionality to convert semver range arrays to strings
 *
 * @packageDocumentation
 */

import { ISimpleSemVer, ISimpleSemVerRuntime } from './types';
import { hasOperator, isSimpleSemVerObjectLike, isSimpleSemVerOperatorLike } from './checker';
import { SimpleSemVer } from './SimpleSemVer';
import { stringifySimpleSemVer, stringifySemverFull } from './stringifySimpleSemVer';

/**
 * 將 semver 物件陣列轉換為範圍字串
 * Convert an array of semver objects to a range string
 *
 * 將 SimpleSemVer 物件陣列轉換為標準版本範圍字串格式。
 * 支援版本物件和邏輯運算子（如 ||）。
 *
 * Converts an array of SimpleSemVer objects to standard version range string format.
 * Supports version objects and logical operators (e.g., ||).
 *
 * @param {ISimpleSemVer[]} arr - semver 物件陣列 / Array of semver objects
 * @returns {string} 範圍字串 / Range string
 * @throws {TypeError} 當陣列包含無效的 semver 物件時 / When array contains invalid semver objects
 *
 * @example
 * ```typescript
 * // 單一版本條件 / Single version condition
 * stringifySimpleSemVerRange([
 *   { operator: '>=', major: '1', minor: '2', patch: '3' }
 * ]);
 * // => '>=1.2.3'
 *
 * // 多個版本條件 / Multiple version conditions
 * stringifySimpleSemVerRange([
 *   { operator: '>=', major: '1', minor: '2', patch: '3' },
 *   { operator: '<', major: '2', minor: '0', patch: '0' }
 * ]);
 * // => '>=1.2.3 <2.0.0'
 *
 * // 使用 || 邏輯運算子 / Using || logical operator
 * stringifySimpleSemVerRange([
 *   { operator: '>=', major: '1', minor: '2', patch: '3' },
 *   { operator: '||' },
 *   { operator: '=', major: '0', minor: '5', patch: '0' }
 * ]);
 * // => '>=1.2.3 || 0.5.0'
 *
 * // 使用 SimpleSemVer 實例 / Using SimpleSemVer instances
 * const semver1 = new SimpleSemVer({ operator: '^', major: '1', minor: '0', patch: '0' });
 * const semver2 = new SimpleSemVer({ operator: '||' });
 * const semver3 = new SimpleSemVer({ operator: '>=', major: '2', minor: '0', patch: '0' });
 * stringifySimpleSemVerRange([semver1, semver2, semver3]);
 * // => '^1.0.0 || >=2.0.0'
 * ```
 */
export function stringifySimpleSemVerRange(arr: ISimpleSemVerRuntime[])
{
	return arr.reduce((a, ver) =>
	{
		// 處理純運算子物件（如 ||）
		// Handle pure operator objects (e.g., ||)
		if (isSimpleSemVerOperatorLike(ver))
		{
			a.push(ver.operator)
		}
		// 處理版本物件
		// Handle version objects
		else if (isSimpleSemVerObjectLike(ver))
		{
			let str: string;

			// 如果是 SimpleSemVer 實例，使用 toFullString 方法
			// If it's a SimpleSemVer instance, use toFullString method
			if (ver instanceof SimpleSemVer)
			{
				str = ver.toFullString()
			}
			else
			{
				// 否則使用 stringifySemverFull 函數
				// Otherwise use stringifySemverFull function
				str = stringifySemverFull(ver);
			}

			a.push(str)
		}
		else
		{
			// 無效的 semver 物件
			// Invalid semver object
			throw new TypeError(`obj not a ISimpleSemVerLike`)
		}

		return a;
	}, [] as string[]).join(' ')
}

export default stringifySimpleSemVerRange

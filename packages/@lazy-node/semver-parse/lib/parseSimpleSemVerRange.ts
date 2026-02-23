/**
 * @lazy-node/semver-parse 範圍解析器
 * Range parser for @lazy-node/semver-parse
 *
 * 此模組提供 semver 版本範圍字串解析功能
 * This module provides semver version range string parsing functionality
 *
 * **此函數支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **This function supports multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若只需解析單一版本範圍，可使用 `parseSimpleSemVer` 函數。
 * For parsing single version range only, use the `parseSimpleSemVer` function.
 *
 * @packageDocumentation
 */

import { SimpleSemVer } from './SimpleSemVer';
import { reSemverRange, EnumVersionExtra } from './const';
import { ISimpleSemVer, IOperator, IToSimpleSemVerObjectOrOperator, ISimpleSemVerObjectBase } from './types';
import { pruned } from './util/pruned';

/**
 * 解析 semver 版本範圍字串
 * Parse a semver version range string
 *
 * 將版本範圍字串解析為 SimpleSemVer 物件陣列。
 * 支援多個版本條件和邏輯運算子（||, -）。
 *
 * Parses a version range string into an array of SimpleSemVer objects.
 * Supports multiple version conditions and logical operators (||, -).
 *
 * @param {string} str - 要解析的範圍字串 / Range string to parse
 * @returns {IToSimpleSemVerObjectOrOperator<SimpleSemVer>[]} SimpleSemVer 物件陣列 / Array of SimpleSemVer objects
 *
 * @example
 * ```typescript
 * // 單一版本條件 / Single version condition
 * parseSimpleSemVerRange('>=1.2.3');
 * // => [SimpleSemVer { operator: '>=', major: '1', minor: '2', patch: '3' }]
 *
 * // 多個版本條件 / Multiple version conditions
 * parseSimpleSemVerRange('>=1.2.3 <2.0.0');
 * // => [
 * //   SimpleSemVer { operator: '>=', major: '1', minor: '2', patch: '3' },
 * //   SimpleSemVer { operator: '<', major: '2', minor: '0', patch: '0' }
 * // ]
 *
 * // 使用 || 邏輯運算子 / Using || logical operator
 * parseSimpleSemVerRange('>=1.2.3 || 0.5.0');
 * // => [
 * //   SimpleSemVer { operator: '>=', major: '1', minor: '2', patch: '3' },
 * //   SimpleSemVer { operator: '||' },
 * //   SimpleSemVer { operator: '=', major: '0', minor: '5', patch: '0' }
 * // ]
 *
 * // 使用萬用字元 / Using wildcards
 * parseSimpleSemVerRange('1.2.x');
 * // => [SimpleSemVer { major: '1', minor: '2', patch: 'x' }]
 *
 * // 同時包含預發布標籤和建置元資料 / With both pre-release and build metadata
 * parseSimpleSemVerRange('1.0.0-alpha+build.123');
 * // => [SimpleSemVer { major: '1', minor: '0', patch: '0', release: 'alpha', build: 'build.123' }]
 * ```
 */
export function parseSimpleSemVerRange(str: string)
{
	let m: RegExpExecArray;
	const arr: (IToSimpleSemVerObjectOrOperator<SimpleSemVer>)[] = [];

	// 使用全域正規表達式迭代匹配所有版本條件
	// Use global regex to iteratively match all version conditions
	while (m = reSemverRange.exec(str))
	{
		// 捕獲組索引說明 / Capture group index explanation:
		// m[2] = 邏輯運算子 (|| 或 -) / Logical operator (|| or -)
		// m[3] = 完整版本部分（含運算子） / Full version part (with operator)
		// m[4] = 比較運算子 / Comparison operator
		// m[5] = v 前綴 / v prefix
		// m[6] = major 版本 / major version
		// m[8] = minor 版本 / minor version
		// m[10] = patch 版本 / patch version
		// m[12] = release 內容 (不含 -) / release content (without -)
		// m[14] = build 內容 (不含 +) / build content (without +)

		// 建構 semver 字串（只包含版本部分，不含運算子）
		// Build semver string (version part only, without operator)
		let semver = '';

		/*
		if (m[5]) semver += m[5]; // v 前綴 / v prefix
		semver += m[6]; // major
		if (m[8] !== undefined) semver += '.' + m[8]; // minor
		if (m[10] !== undefined) semver += '.' + m[10]; // patch
		if (m[12]) semver += '-' + m[12]; // release
		if (m[14]) semver += '+' + m[14]; // build
		*/

		// 建立基礎 semver 物件
		// Build base semver object
		let obj: ISimpleSemVer = {
			semver: m[3]
			, operator: (m[4] || m[2]) as IOperator
			, major: m[6]
			, minor: m[8]
			, patch: m[10],
		};

		// 處理預發布標籤 / Handle pre-release tag
		if (m[12])
		{
			obj.release = m[12];
		}

		// 處理建置元資料 / Handle build metadata
		if (m[14])
		{
			obj.build = m[14];
		}

		// 建立 SimpleSemVer 實例並加入陣列
		// Create SimpleSemVer instance and add to array
		arr.push(new SimpleSemVer(obj) as any);
	}

	return arr;
}

export default parseSimpleSemVerRange

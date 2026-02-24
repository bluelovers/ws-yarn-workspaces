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
import { reSemverRange } from './const';
import { IOperator, ISimpleSemVer, IToSimpleSemVerObjectOrOperator } from './types';
import { normalizeSemVerObjectInput } from './util/pruned';
import { isSemverWildcard, isValidVersion } from './checker';

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
	const arr: (IToSimpleSemVerObjectOrOperator<SimpleSemVer>)[] = [];

	// 處理純萬用字元情況（只有 `*` 或 `x`）
	// Handle pure wildcard case (only `*` or `x`)
	if (isSemverWildcard(str))
	{
		arr.push(new SimpleSemVer({
			semver: str,
		} as any) as any);
		return arr;
	}

	// 檢查是否包含 || 運算子，如果有的話需要分割處理
	// Check if it contains || operator, if so need to split and process
	if (str.includes('||'))
	{
		// 使用正則表達式分割，保留 ||
		// Split using regex, preserve ||
		const parts = str.split(/\s*(\|\|)\s*/);

		for (const part of parts)
		{
			if (part === '||')
			{
				arr.push(new SimpleSemVer({
					operator: '||' as IOperator,
				} as any) as any);
			}
			else if (part.trim())
			{
				// 遞迴調用 parseSimpleSemVerRange 來處理 AND 範圍
				// Recursively call parseSimpleSemVerRange to handle AND ranges
				const result = parseSimpleSemVerRange(part.trim());
				if (result.length === 0)
				{
					// 無效版本，返回空陣列
					// Invalid version, return empty array
					return [];
				}
				// 將結果展開加入陣列
				// Flatten the result into the array
				arr.push(...result);
			}
		}

		return arr;
	}

	// 不包含 || 的情況，使用原本的邏輯
	// No || case, use original logic
	let m: RegExpExecArray;
	reSemverRange.lastIndex = 0;

	// 記錄已匹配的字元範圍，用於檢查是否覆蓋整個字串
	// Track matched character ranges to check if entire string is covered
	let totalMatchedLength = 0;

	// 使用全域正規表達式迭代匹配所有版本條件
	// Use global regex to iteratively match all version conditions
	while ((m = reSemverRange.exec(str)) !== null)
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

		// 計算匹配的字元數（包含空白）
		// Count matched characters (including whitespace)
		totalMatchedLength += m[0].length;

		// 如果是邏輯運算子（|| 或 -），需要特殊處理
		// If it's a logical operator (|| or -), need special handling
		if (m[2] && !m[3])
		{
			// 對於 `-` 運算子，需要檢查它是否真的是邏輯運算子
			// For `-` operator, need to check if it's really a logical operator
			// 如果 `-` 後面沒有版本，則視為無效
			// If there's no version after `-`, treat as invalid
			if (m[2] === '-')
			{
				// 檢查 `-` 後面是否還有內容
				// Check if there's content after `-`
				const afterDash = str.substring(m.index + m[0].length).trim();
				if (!afterDash)
				{
					// `-` 後面沒有內容，視為無效版本
					// No content after `-`, treat as invalid version
					return [];
				}
			}

			arr.push(new SimpleSemVer({
				operator: m[2] as IOperator,
			} as any) as any);
			continue;
		}

		// 如果沒有版本部分，跳過
		// If no version part, skip
		if (!m[3])
		{
			continue;
		}

		const major = m[6];
		const minor = m[8];
		const patch = m[10];
		const release = m[12];
		const build = m[14];

		// 驗證版本是否有效
		// Validate if version is valid
		if (!isValidVersion(str, major, minor, patch, release, build))
		{
			// 無效版本，返回空陣列
			// Invalid version, return empty array
			return [];
		}

		// 建立基礎 semver 物件
		// Build base semver object
		let obj: ISimpleSemVer = {
			semver: m[3]
			, operator: m[4] as IOperator
			, major: major
			, minor: minor
			, patch: patch,
		};

		// 處理預發布標籤 / Handle pre-release tag
		if (release)
		{
			obj.release = release;
		}

		// 處理建置元資料 / Handle build metadata
		if (build)
		{
			obj.build = build;
		}

		normalizeSemVerObjectInput(obj, {
			init: true,
		});

		// 建立 SimpleSemVer 實例並加入陣列
		// Create SimpleSemVer instance and add to array
		arr.push(new SimpleSemVer(obj) as any);
	}

	// 檢查是否覆蓋整個字串（比較原始字串長度）
	// Check if entire string is covered (compare original string length)
	if (totalMatchedLength !== str.length)
	{
		return [];
	}

	return arr;
}

export default parseSimpleSemVerRange

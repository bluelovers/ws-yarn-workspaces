/**
 * @lazy-node/semver-parse 版本解析器
 * Version parser for @lazy-node/semver-parse
 *
 * 此模組提供 semver 版本字串解析功能
 * This module provides semver version string parsing functionality
 *
 * **注意：此函數僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This function only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */

import { reSemver, reSemverWithRange } from './const';
import { SimpleSemVer } from './SimpleSemVer';
import { pruned } from './util/pruned';
import { ISimpleSemVer, ISimpleSemVerObject, IToSimpleSemVerObject } from './types';
import { assertSimpleSemVerObjectLike } from './checker';

/**
 * 解析 semver 版本字串
 * Parse a semver version string
 *
 * 將 semver 版本字串解析為結構化的 SimpleSemVer 物件。
 * 支援選擇性的 v 前綴和範圍運算子。
 *
 * Parses a semver version string into a structured SimpleSemVer object.
 * Supports optional v prefix and range operators.
 *
 * @template T - semver 物件類型 / Semver object type
 * @param {string} version - 要解析的版本字串 / Version string to parse
 * @returns {IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>} 解析後的 SimpleSemVer 物件 / Parsed SimpleSemVer object
 *
 * @example
 * ```typescript
 * // 基本版本解析 / Basic version parsing
 * parseSimpleSemVer('1.2.3');
 * // => SimpleSemVer { major: '1', minor: '2', patch: '3' }
 *
 * // 帶 v 前綴 / With v prefix
 * parseSimpleSemVer('v1.2.3');
 * // => SimpleSemVer { major: '1', minor: '2', patch: '3', semver: 'v1.2.3' }
 *
 * // 帶運算子 / With operator
 * parseSimpleSemVer('>=1.2.3');
 * // => SimpleSemVer { operator: '>=', major: '1', minor: '2', patch: '3' }
 *
 * // 帶預發布標籤和建置元資料 / With pre-release tag and build metadata
 * parseSimpleSemVer('1.2.3-beta.1+build.123');
 * // => SimpleSemVer {
 * //   major: '1', minor: '2', patch: '3',
 * //   release: 'beta.1', build: 'build.123'
 * // }
 * ```
 */
export function parseSimpleSemVer<T extends ISimpleSemVerObject = ISimpleSemVerObject>(version: string): IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>
{
	// semver, major, minor, patch
	// 相關參考資料 / Related references:
	// https://github.com/mojombo/semver/issues/32
	// https://github.com/isaacs/node-semver/issues/10
	// 可選的 v 前綴 / Optional v prefix

	// 使用正規表達式匹配版本字串
	// Use regex to match version string
	const m = reSemverWithRange.exec(version);
	let ver: IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>;

	if (m?.length > 0)
	{
		// 解構匹配結果 / Destructure match results
		// m[0] = 完整匹配 / Full match
		// m[1] = 運算子 / Operator
		// m[2] = 版本字串 / Version string
		// m[3] = 主版本號 / Major version
		// m[4] = 次版本號 / Minor version
		// m[5] = 修補版本號 / Patch version
		// m[6] = 預發布標籤 / Pre-release tag
		// m[7] = 建置元資料 / Build metadata
		let [semver, operator, version, major, minor, patch, release, build] = m;

		// 建立 SimpleSemVer 實例
		// Create SimpleSemVer instance
		ver = new SimpleSemVer({
			operator,
			semver,
			version,
			major,
			minor,
			patch,
			release,
			build,
		}) as any

		// 斷言解析結果為有效的版本物件
		// Assert parsed result is a valid version object
		assertSimpleSemVerObjectLike(ver);
	}

	return ver;
}

export default parseSimpleSemVer

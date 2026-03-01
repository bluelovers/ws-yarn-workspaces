/**
 * 版本解析工具 / Version parsing utilities
 * 
 * @module @lazy-node/semver-part/lib/parse
 * 
 * 此模組提供解析和比較版本差異的功能，可用於判斷版本變更的位置和方向。
 * This module provides functionality to parse and compare version differences,
 * useful for determining where and how versions have changed.
 * 
 * @example
 * ```typescript
 * import { parseVersions, parseVersionsAndCompare } from '@lazy-node/semver-part/lib/parse';
 * 
 * // 解析版本差異 / Parse version differences
 * parseVersions('1.2.3', '1.3.0');
 * // { versionOld: '1.2.3', versionNew: '1.3.0', partsOld: ['1', '2', '3'], partsNew: ['1', '3', '0'], index: 1 }
 * 
 * // 解析並比較版本 / Parse and compare versions
 * parseVersionsAndCompare('1.2.3', '1.3.0');
 * // { ..., comp: -1 } 表示新版較舊版小（此例中 minor 版本變大，但 index 指向變化處）
 * ```
 */
import { versionToParts } from './_core';
import { tryCompare, IOptionsOrLoose, ICompareReturnType } from './compare';

/**
 * 版本差異索引類型 / Version difference index type
 * 
 * 表示版本差異發生在哪個部分：
 * - `0`: major 版本 / Major version
 * - `1`: minor 版本 / Minor version
 * - `2`: patch 版本 / Patch version
 */
export type IParseVersionsFindIndex = 0 | 1 | 2;

/**
 * 解析兩個版本並找出差異位置
 * Parse two versions and find the difference position
 * 
 * 將版本分割為部分陣列，並找出第一個不同的部分索引
 * Splits versions into part arrays and finds the index of the first differing part
 * 
 * @param versionOld - 舊版本字串 / Old version string
 * @param versionNew - 新版本字串 / New version string
 * @returns 包含版本資訊和差異位置的物件 / Object containing version info and difference position
 * 
 * @example
 * ```typescript
 * parseVersions('1.2.3', '2.0.0');
 * // { versionOld: '1.2.3', versionNew: '2.0.0', partsOld: ['1', '2', '3'], partsNew: ['2', '0', '0'], index: 0 }
 * 
 * parseVersions('1.2.3', '1.3.0');
 * // { versionOld: '1.2.3', versionNew: '1.3.0', partsOld: ['1', '2', '3'], partsNew: ['1', '3', '0'], index: 1 }
 * 
 * parseVersions('1.2.3', '1.2.4');
 * // { versionOld: '1.2.3', versionNew: '1.2.4', partsOld: ['1', '2', '3'], partsNew: ['1', '2', '4'], index: 2 }
 * 
 * parseVersions('1.2.3', '1.2.3');
 * // { versionOld: '1.2.3', versionNew: '1.2.3', partsOld: ['1', '2', '3'], partsNew: ['1', '2', '3'], index: 3 }
 * ```
 */
export function parseVersions(versionOld: string, versionNew: string)
{
	const partsNew = versionToParts(versionNew);
	const partsOld = versionToParts(versionOld);

	let index: IParseVersionsFindIndex = partsNew.findIndex((part, i) => part !== partsOld[i]) as any;

	index = index >= 0 ? index : partsNew.length as any;

	return {
		versionOld,
		versionNew,

		partsOld,
		partsNew,

		index,
	}
}

/**
 * 解析兩個版本、找出差異位置並比較差異部分
 * Parse two versions, find difference position and compare the differing parts
 * 
 * 結合 parseVersions 和 tryCompare 功能，提供完整的版本差異分析
 * Combines parseVersions and tryCompare for complete version difference analysis
 * 
 * @param versionOld - 舊版本字串 / Old version string
 * @param versionNew - 新版本字串 / New version string
 * @param optionsOrLoose - 比較選項或寬鬆模式 / Comparison options or loose mode
 * @returns 包含版本資訊、差異位置和比較結果的物件 / Object with version info, difference position, and comparison result
 * 
 * @example
 * ```typescript
 * parseVersionsAndCompare('1.2.3', '1.3.0');
 * // {
 * //   versionOld: '1.2.3',
 * //   versionNew: '1.3.0',
 * //   partsOld: ['1', '2', '3'],
 * //   partsNew: ['1', '3', '0'],
 * //   index: 1,
 * //   comp: -1  // 舊版本 < 新版本（與 semver.compare 行為一致）
 * // }
 * 
 * parseVersionsAndCompare('2.0.0', '1.0.0');
 * // { ..., index: 0, comp: 1 }  // 舊版本 > 新版本（與 semver.compare 行為一致）
 * ```
 */
export function parseVersionsAndCompare(versionOld: string, versionNew: string, optionsOrLoose?: IOptionsOrLoose): {
	comp: ICompareReturnType;
	versionOld: string;
	versionNew: string;
	partsOld: string[];
	partsNew: string[];
	index: IParseVersionsFindIndex;
}
{
	const data = parseVersions(versionOld, versionNew)

	let comp = tryCompare(data.partsOld[data.index], data.partsNew[data.index], optionsOrLoose);

	return {
		...data,
		comp,
	}
}

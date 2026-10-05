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

	/**
	 * 找出第一個不相同的段落索引；findIndex 回傳 -1 表示兩者完全相同，
	 * 此處以 `as any` 暫時窄化，實際語意在下一行才決定。
	 * Find the index of the first differing segment; findIndex returns -1 when
	 * the versions are identical, so the `as any` cast defers the real typing
	 * decision to the next line.
	 */
	let index: IParseVersionsFindIndex = partsNew.findIndex((part, i) => part !== partsOld[i]) as any;

	/**
	 * 完全相同時以 partsNew.length 當作索引（慣例上為 3），
	 * 讓呼叫端可用「index 是否超出段落範圍」判斷「無差異」，
	 * 而不必另行比較兩個版本字串。
	 * When identical, use partsNew.length (conventionally 3) as the index, so
	 * callers can detect "no difference" via an out-of-range index instead of
	 * comparing the version strings again.
	 */
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
	/**
	 * 差異段落的比較結果（semver 語意：舊 vs 新）/ Comparison result of the differing segment (semver semantics: old vs new)
	 */
	comp: ICompareReturnType;
	/**
	 * 舊版本字串 / Old version string
	 */
	versionOld: string;
	/**
	 * 新版本字串 / New version string
	 */
	versionNew: string;
	/**
	 * 舊版本的段落陣列 / Segment array of the old version
	 */
	partsOld: string[];
	/**
	 * 新版本的段落陣列 / Segment array of the new version
	 */
	partsNew: string[];
	/**
	 * 差異發生的段落索引；兩者相同時為 partsNew.length / Segment index where the difference occurs; equals partsNew.length when identical
	 */
	index: IParseVersionsFindIndex;
}
{
	const data = parseVersions(versionOld, versionNew)

	/**
	 * 只比較差異那一段即可代表整體方向，且即使該段不是合法 semver，
	 * tryCompare 也只會回傳 undefined 而不會中斷呼叫。
	 * Comparing only the differing segment represents the overall direction,
	 * and even when that segment is not valid semver, tryCompare merely
	 * returns undefined instead of interrupting the caller.
	 */
	let comp = tryCompare(data.partsOld[data.index], data.partsNew[data.index], optionsOrLoose);

	return {
		...data,
		comp,
	}
}

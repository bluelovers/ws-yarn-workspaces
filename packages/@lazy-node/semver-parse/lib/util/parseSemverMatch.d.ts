/**
 * @lazy-node/semver-parse 共用解析函數
 * Shared parsing functions for @lazy-node/semver-parse
 *
 * 此模組提供共用的 semver 解析邏輯，供 parseSimpleSemVer 和 parseSimpleSemVerRange 使用
 * This module provides shared semver parsing logic for parseSimpleSemVer and parseSimpleSemVerRange
 *
 * @packageDocumentation
 */
import { SimpleSemVer } from '../SimpleSemVer';
import { ISimpleSemVer } from '../types';
/**
 * 從正則表達式匹配結果建立 ISimpleSemVer 物件
 * Create ISimpleSemVer object from regex match result
 *
 * 此函數從 reSemverWithRangeAndWildcards 或 reSemverRange 的匹配結果中
 * 提取版本資訊並建立 ISimpleSemVer 物件。
 *
 * This function extracts version information from match results of
 * reSemverWithRangeAndWildcards or reSemverRange and creates ISimpleSemVer object.
 *
 * @param m - 正則表達式匹配結果 / Regex match result
 * @param operatorIndex - 運算子在匹配結果中的索引 / Operator index in match result
 * @param majorIndex - major 版本在匹配結果中的索引 / Major version index in match result
 * @param minorIndex - minor 版本在匹配結果中的索引 / Minor version index in match result
 * @param patchIndex - patch 版本在匹配結果中的索引 / Patch version index in match result
 * @param releaseIndex - release 在匹配結果中的索引 / Release index in match result
 * @param buildIndex - build 在匹配結果中的索引 / Build index in match result
 * @param semverIndex - semver 字串在匹配結果中的索引（可選，若無則自動構建）/ Semver string index in match result (optional, auto-built if not provided)
 * @param input - 原始輸入字串（用於構建 semver）/ Original input string (used to build semver)
 * @returns {ISimpleSemVer} 解析後的 semver 物件 / Parsed semver object
 *
 * @example
 * ```typescript
 * const m = reSemverWithRangeAndWildcards.exec('>=1.2.3');
 * const obj = createSemVerFromMatch(m, 1, 3, 5, 7, 9, 11);
 * // => { operator: '>=', major: '1', minor: '2', patch: '3' }
 * ```
 */
export declare function createSemVerFromMatch(m: RegExpExecArray, operatorIndex: number, majorIndex: number, minorIndex: number, patchIndex: number, releaseIndex: number, buildIndex: number, semverIndex?: number, input?: string): ISimpleSemVer;
/**
 * 從正則表達式匹配結果建立 SimpleSemVer 實例
 * Create SimpleSemVer instance from regex match result
 *
 * 此函數是 createSemVerFromMatch 的包裝函數，直接返回 SimpleSemVer 實例。
 * This function is a wrapper of createSemVerFromMatch that returns SimpleSemVer instance directly.
 *
 * @param m - 正則表達式匹配結果 / Regex match result
 * @param operatorIndex - 運算子在匹配結果中的索引 / Operator index in match result
 * @param majorIndex - major 版本在匹配結果中的索引 / Major version index in match result
 * @param minorIndex - minor 版本在匹配結果中的索引 / Minor version index in match result
 * @param patchIndex - patch 版本在匹配結果中的索引 / Patch version index in match result
 * @param releaseIndex - release 在匹配結果中的索引 / Release index in match result
 * @param buildIndex - build 在匹配結果中的索引 / Build index in match result
 * @param semverIndex - semver 字串在匹配結果中的索引（可選）/ Semver string index in match result (optional)
 * @param input - 原始輸入字串（用於構建 semver）/ Original input string (used to build semver)
 * @returns {SimpleSemVer} SimpleSemVer 實例 / SimpleSemVer instance
 */
export declare function createSimpleSemVerFromMatch(m: RegExpExecArray, operatorIndex: number, majorIndex: number, minorIndex: number, patchIndex: number, releaseIndex: number, buildIndex: number, semverIndex?: number, input?: string): SimpleSemVer;
export default createSemVerFromMatch;

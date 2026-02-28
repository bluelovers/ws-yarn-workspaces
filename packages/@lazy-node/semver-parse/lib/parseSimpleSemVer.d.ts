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
import { SimpleSemVer } from './SimpleSemVer';
import { ISimpleSemVerObject, IToSimpleSemVerObject } from './types';
/**
 * 解析 semver 版本字串
 * Parse a semver version string
 *
 * 將 semver 版本字串解析為結構化的 SimpleSemVer 物件。
 * 支援選擇性的 v 前綴、範圍運算子和萬用字元。
 *
 * Parses a semver version string into a structured SimpleSemVer object.
 * Supports optional v prefix, range operators, and wildcards.
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
 *
 * // 帶萬用字元 / With wildcards
 * parseSimpleSemVer('1.2.x');
 * // => SimpleSemVer { major: '1', minor: '2', patch: 'x' }
 *
 * parseSimpleSemVer('1.*');
 * // => SimpleSemVer { major: '1', minor: '*' }
 * ```
 */
export declare function parseSimpleSemVer<T extends ISimpleSemVerObject = ISimpleSemVerObject>(version: string): IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>;
export default parseSimpleSemVer;

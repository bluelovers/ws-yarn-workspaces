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
import { ISimpleSemVer, IToSimpleSemVerObjectOrOperator } from './types';
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
export declare function parseSimpleSemVerRange(str: string): IToSimpleSemVerObjectOrOperator<SimpleSemVer<ISimpleSemVer>>[];
export default parseSimpleSemVerRange;

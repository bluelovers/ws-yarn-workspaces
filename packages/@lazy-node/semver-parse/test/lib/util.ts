/**
 * @lazy-node/semver-parse 測試工具函數
 * Test utility functions for @lazy-node/semver-parse
 *
 * 此模組提供測試所需的輔助函數
 * This module provides helper functions for testing
 *
 * @packageDocumentation
 */

import { SemVer } from "semver";
import { parseSimpleSemVer } from '../../lib/parseSimpleSemVer';
import { parseSimpleSemVerRange } from '../../lib/parseSimpleSemVerRange';

/**
 * 延遲執行函數並返回結果或錯誤
 * Lazily execute function and return result or error
 *
 * 安全地執行函數，捕獲任何錯誤並返回結構化結果
 * Safely executes function, catches any errors and returns structured result
 *
 * @template T - 函數返回類型 / Function return type
 * @param {Function} fn - 要執行的函數 / Function to execute
 * @param {string} input - 輸入字串 / Input string
 * @returns {Object} 執行結果物件 / Execution result object
 * @returns {string} .input - 原始輸入 / Original input
 * @returns {T} [.result] - 成功時的結果 / Result on success
 * @returns {Error} [.err] - 失敗時的錯誤 / Error on failure
 *
 * @example
 * ```typescript
 * const result = _lazyReturnResult(parseSimpleSemVer, '1.2.3');
 * // => { input: '1.2.3', result: SimpleSemVer { ... } }
 *
 * const errorResult = _lazyReturnResult(parseSimpleSemVer, 'invalid');
 * // => { input: 'invalid', err: Error }
 * ```
 */
export function _lazyReturnResult<T extends any>(fn: (...argv) => T, input: string)
{
	let result: T;
	try
	{
		result = fn(input);
	}
	catch(err)
	{
		return {
			input,
			err: err as Error,
		} as const
	}

	return {
		input,
		result,
	} as const
}

/**
 * 使用標準 semver 套件解析版本
 * Parse version using standard semver package
 *
 * 建立標準 SemVer 實例，用於與本套件的解析結果進行比較
 * Creates standard SemVer instance for comparison with this package's parsing results
 *
 * @param {string} input - 版本字串 / Version string
 * @returns {SemVer} SemVer 實例 / SemVer instance
 */
export function fnOriginalSemver(input: string)
{
	return new SemVer(input)
}

/**
 * 延遲執行所有解析函數並返回綜合結果
 * Lazily execute all parse functions and return comprehensive result
 *
 * 同時執行標準 semver 和本套件的解析函數，方便比較結果
 * Executes both standard semver and this package's parse functions for easy comparison
 *
 * @param {string} input - 版本字串 / Version string
 * @returns {Object} 綜合結果物件 / Comprehensive result object
 * @returns {string} .input - 原始輸入 / Original input
 * @returns {Object} .originalSemver - 標準 semver 解析結果 / Standard semver parse result
 * @returns {Object} .parseSimpleSemVer - 本套件單一版本解析結果 / This package's single version parse result
 * @returns {Object} .parseSimpleSemVerRange - 本套件範圍解析結果 / This package's range parse result
 *
 * @example
 * ```typescript
 * const results = _lazyReturnResultAll('>=1.2.3');
 * // => {
 * //   input: '>=1.2.3',
 * //   originalSemver: { input: '>=1.2.3', result: SemVer { ... } },
 * //   parseSimpleSemVer: { input: '>=1.2.3', result: SimpleSemVer { ... } },
 * //   parseSimpleSemVerRange: { input: '>=1.2.3', result: [SimpleSemVer { ... }] }
 * // }
 * ```
 */
export function _lazyReturnResultAll(input: string)
{
	return {
		input,
		// 標準 semver 套件解析結果 / Standard semver package parse result
		originalSemver: _lazyReturnResult(fnOriginalSemver, input),
		// 本套件單一版本解析結果 / This package's single version parse result
		parseSimpleSemVer: _lazyReturnResult(parseSimpleSemVer, input),
		// 本套件範圍解析結果 / This package's range parse result
		parseSimpleSemVerRange: _lazyReturnResult(parseSimpleSemVerRange, input),
	} as const
}

/**
 * 延遲拋出錯誤
 * Lazily throw an error
 *
 * 用於在表達式中拋出錯誤，例如三元運算子
 * Used to throw errors in expressions, e.g., ternary operators
 *
 * @template E - 錯誤類型 / Error type
 * @param {E} e - 要拋出的錯誤 / Error to throw
 * @throws {E} 總是拋出傳入的錯誤 / Always throws the passed error
 *
 * @example
 * ```typescript
 * const result = success ? value : _lazyThrowError(new Error('Failed'));
 * ```
 */
export function _lazyThrowError<E extends Error>(e: E)
{
	throw e
}

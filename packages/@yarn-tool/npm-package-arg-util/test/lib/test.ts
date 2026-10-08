/**
 * @fileoverview Test utility functions for npm-package-arg-util
 * @description npm-package-arg-util 的測試工具函數
 */

import assert from 'node:assert/strict';
import test, { getTestContext, type TestContext } from 'node:test';
import { IResult, npa2 } from '../..';
import { getSemverFromNpaResult } from '../../lib/getSemverFromNpaResult';
import {
	isNpmPackageArgResult,
	isAliasResult,
	isFileResult,
	isRegistryResult,
	isHostedGitResult,
	isURLResult, isRawSpecIsEmpty, isInputSpecIsEmpty, isNameSameAsRaw, isInputSpecIsStar,
} from '../../lib/detect';
import { _parsePackageNameCore } from '../../lib/parseArgvPkgName';

/**
 * jest `expect.any(String)` 的原生替代 sentinel
 * Native sentinel replacing jest's `expect.any(String)`
 *
 * 僅供 propertyMatchers 使用，由 `_assertPropertyMatchers` 解析；
 * 以 symbol 承載、以 string 呈現，故可直接放入 `Partial<IResult>` 且不會與真實字串相等
 *
 * Only used inside propertyMatchers and resolved by `_assertPropertyMatchers`.
 * It is carried as a symbol but typed as `string`, so it can be assigned into
 * `Partial<IResult>` while never equaling a real string value
 */
export const anyString = Symbol('anyString') as unknown as string;

/**
 * 以 `node:assert` 遞迴比對 partial property matchers
 * Recursively assert partial property matchers with `node:assert`
 *
 * 為 jest `toMatchSnapshot(propertyMatchers)` 的原生替代：
 * 物件屬性遞迴比對、`anyString` 僅檢查型別、其餘值以 `deepStrictEqual` 比對
 *
 * Native replacement for jest's `toMatchSnapshot(propertyMatchers)`: objects are
 * compared key by key, `anyString` only checks the type, and every other value
 * goes through `deepStrictEqual`
 */
export function _assertPropertyMatchers(actual: unknown, expected: unknown, path: string): void
{
	if (expected === anyString)
	{
		assert.strictEqual(typeof actual, 'string', `${path} should be a string`);
		return;
	}

	if (expected !== null && typeof expected === 'object')
	{
		assert.ok(actual !== null && typeof actual === 'object', `${path} should be an object`);

		for (const [key, value] of Object.entries(expected))
		{
			_assertPropertyMatchers((actual as Record<string, unknown>)[key], value, `${path}.${key}`);
		}

		return;
	}

	assert.deepStrictEqual(actual, expected, path);
}

/**
 * Options for lazy test functions
 * 懶惰測試函數的選項
 */
export interface ILazyTestOptions<T extends IResult = IResult>
{
	/**
	 * Partial property matchers asserted with `node:assert`
	 * 以 `node:assert` 比對的 partial property matchers
	 */
	propertyMatchers?: Partial<T>;

	/**
	 * The type guard function to test
	 * 要測試的類型守衛函數
	 */
	fn?: (result: IResult) => boolean;

	actualExpected?: boolean;
}

/**
 * Generic lazy test function for type guards
 * 類型守衛的通用懶惰測試函數
 *
 * @template T - The result type
 * @param {string} inputSpec - The package spec to test
 * @param {ILazyTestOptions<T>} options - Test options
 * @returns The test result
 */
export function _lazyTestNpaTypeGuard<T extends IResult = IResult>(
	inputSpec: string,
	options: ILazyTestOptions<T> = {},
)
{
	let { propertyMatchers, fn = isNpmPackageArgResult, actualExpected } = options;
	const result: T = npa2(inputSpec);
	const actual = fn(result);

	actualExpected ??= true;

	if (propertyMatchers)
	{
		if (propertyMatchers.type === 'directory' || propertyMatchers.type === 'file')
		{
			propertyMatchers.fetchSpec = anyString;
			propertyMatchers.saveSpec = anyString;
			// @ts-ignore
			propertyMatchers.where ??= anyString;
		}

		for (const key of [
			'escapedName',
			'name',
			'gitCommittish',
			'gitRange',
			'gitSubdir',
			'hosted',
		])
		{
			if (propertyMatchers[key] == null)
			{
				delete propertyMatchers[key];
			}
		}
	}

	const ret = {
		inputSpec,
		result,
		actual,

		getSemverFromNpaResult: getSemverFromNpaResult(result),
		_parsePackageNameCore: result.name && _parsePackageNameCore(result),

		isRawSpecIsEmpty: isRawSpecIsEmpty(result),
		isInputSpecIsEmpty: isInputSpecIsEmpty(result),
		isNameSameAsRaw: isNameSameAsRaw(result),
		isInputSpecIsStar: isInputSpecIsStar(result),

	};

	/**
	 * 原生斷言取代 jest 的 `toMatchSnapshot(propertyMatchers)`：
	 * `actual` 與預期型別守衛結果比對，`propertyMatchers` 以 `node:assert` 遞迴比對，
	 * 最後再以 node:test 的 snapshot 記錄完整結果
	 *
	 * Native replacement for jest's `toMatchSnapshot(propertyMatchers)`: `actual`
	 * is checked against the expected type-guard result, `propertyMatchers` is
	 * asserted recursively with `node:assert`, then the full result is recorded
	 * through node:test's snapshot
	 */
	assert.strictEqual(actual, actualExpected, `${inputSpec}: type guard should return ${actualExpected}`);

	if (propertyMatchers)
	{
		_assertPropertyMatchers(result, propertyMatchers, `${inputSpec} => result`);
	}

	(getTestContext() as test.TestContext).assert.snapshot(ret);

	return ret;
}

/**
 * Test helper for isNpmPackageArgResult
 * isNpmPackageArgResult 的測試輔助函數
 *
 * @deprecated
 */
export function _lazyTestNpmPackageArgResult001<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	fn = isNpmPackageArgResult,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, { propertyMatchers, fn });
}

/**
 * Test helper for isAliasResult
 * isAliasResult 的測試輔助函數
 */
export function _lazyTestIsAliasResult<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	actualExpected?: boolean,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, {
		propertyMatchers,
		fn: isAliasResult,
		actualExpected,
	});
}

/**
 * Test helper for isFileResult
 * isFileResult 的測試輔助函數
 */
export function _lazyTestIsFileResult<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	actualExpected?: boolean,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, {
		propertyMatchers,
		fn: isFileResult,
		actualExpected,
	});
}

/**
 * Test helper for isRegistryResult
 * isRegistryResult 的測試輔助函數
 */
export function _lazyTestIsRegistryResult<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	actualExpected?: boolean,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, {
		propertyMatchers,
		fn: isRegistryResult,
		actualExpected,
	});
}

/**
 * Test helper for isHostedGitResult
 * isHostedGitResult 的測試輔助函數
 */
export function _lazyTestIsHostedGitResult<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	actualExpected?: boolean,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, {
		propertyMatchers,
		fn: isHostedGitResult,
		actualExpected,
	});
}

/**
 * Test helper for isURLResult
 * isURLResult 的測試輔助函數
 */
export function _lazyTestIsURLResult<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
	actualExpected?: boolean,
)
{
	return _lazyTestNpaTypeGuard<T>(inputSpec, {
		propertyMatchers,
		fn: isURLResult,
		actualExpected,
	});
}

/**
 * Test helper for npa function
 * npa 函數的測試輔助函數
 *
 * @template T - The result type
 * @param {string} inputSpec - The package spec to parse
 * @param {Partial<T>} propertyMatchers - Partial matchers asserted with `node:assert`
 * @returns The parsed result
 */
export function _lazyTestNpa<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
)
{
	const result: T = npa2(inputSpec);
	const ret = {
		inputSpec,
		result,
	};

	/**
	 * 原生斷言 propertyMatchers，再以 node:test snapshot 記錄
	 * Assert propertyMatchers natively, then record via node:test's snapshot
	 */
	if (propertyMatchers)
	{
		_assertPropertyMatchers(result, propertyMatchers, `${inputSpec} => result`);
	}

	(getTestContext() as test.TestContext).assert.snapshot(ret);

	return ret;
}

/**
 * Test helper for getSemverFromNpaResult function
 * getSemverFromNpaResult 函數的測試輔助函數
 *
 * @param {string} inputSpec - The package spec to parse
 * @returns The extracted semver and result
 */
export function _lazyTestGetSemver(inputSpec: string)
{
	const result = npa2(inputSpec);
	const semver = getSemverFromNpaResult(result);
	const ret = {
		inputSpec,
		semver,
	};

	/**
	 * 以 node:test 的 snapshot 記錄取代 jest 的 `toMatchSnapshot()`
	 * Replace jest's `toMatchSnapshot()` with node:test's snapshot
	 */
	(getTestContext() as test.TestContext).assert.snapshot(ret);

	return {
		inputSpec,
		result,
		semver,
	};
}

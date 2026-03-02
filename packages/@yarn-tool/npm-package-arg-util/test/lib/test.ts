/**
 * @fileoverview Test utility functions for npm-package-arg-util
 * @description npm-package-arg-util 的測試工具函數
 */

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
 * Options for lazy test functions
 * 懶惰測試函數的選項
 */
export interface ILazyTestOptions<T extends IResult = IResult>
{
	/**
	 * Property matchers for snapshot
	 * snapshot 的屬性匹配器
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
			propertyMatchers.fetchSpec = expect.any(String);
			propertyMatchers.saveSpec = expect.any(String);
			// @ts-ignore
			propertyMatchers.where ??= expect.any(String);
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

	expect(ret).toMatchSnapshot(propertyMatchers ? {
		result: propertyMatchers,
		actual: actualExpected,
	} : {
		actual: actualExpected,
	});

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
 * @param {Partial<T>} propertyMatchers - Property matchers for snapshot
 * @returns The parsed result
 */
export function _lazyTestNpa<T extends IResult = IResult>(
	inputSpec: string,
	propertyMatchers?: Partial<T>,
)
{
	const result: T = npa2(inputSpec);

	expect({
		inputSpec,
		result,
	}).toMatchSnapshot(propertyMatchers ? {
		result: propertyMatchers,
	} : {});

	return {
		inputSpec,
		result,
	};
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

	expect({
		inputSpec,
		semver,
	}).toMatchSnapshot();

	return {
		inputSpec,
		result,
		semver,
	};
}

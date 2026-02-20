/**
 * @fileoverview Assertion functions for npm-package-arg results
 * @description npm-package-arg 結果的斷言函數
 *
 * This module provides assertion functions to validate npm-package-arg
 * parsing results and ensure they meet expected criteria.
 *
 * 本模組提供斷言函數，用於驗證 npm-package-arg 解析結果
 * 並確保它們符合預期條件。
 */

import { FileResult, HostedGitResult } from 'npm-package-arg';
import { IResult } from './types';
import assert from 'assert';
import { isHostedGitResult } from './detect';

/**
 * Assert that an npm-package-arg result has a valid name property
 * 斷言 npm-package-arg 結果具有有效的名稱屬性
 *
 * This function validates that the parsed package result contains
 * a non-empty name property. It's used to ensure that the parsed
 * argument represents a valid package reference.
 *
 * 此函數驗證解析的套件結果包含非空的名稱屬性。
 * 用於確保解析的參數代表有效的套件引用。
 *
 * @template T - The type of result to validate, extends IResult
 * @template T - 要驗證的結果類型，繼承自 IResult
 *
 * @param {T} result - The npm-package-arg result to validate
 * @param {T} result - 要驗證的 npm-package-arg 結果
 *
 * @throws {Error} Throws if the result has no name or empty name
 * @throws {Error} 如果結果沒有名稱或名稱為空則拋出錯誤
 *
 * @example
 * // Valid package with name
 * // 具有名稱的有效套件
 * const result = npa('lodash@4.17.21');
 * assertNpaResultHasName(result); // Passes silently
 *
 * @example
 * // Invalid package without name
 * // 沒有名稱的無效套件
 * const result = npa('github:user/repo#branch');
 * // This may throw if the result has no name
 * // 如果結果沒有名稱，這可能會拋出錯誤
 */
export function assertNpaResultHasName<T extends IResult>(result: T): asserts result is T & {
	name: string
}
{
	// Check if the result has a valid non-empty name
	// 檢查結果是否具有有效的非空名稱
	if (!result.name?.length)
	{
		throw new Error(`Invalid input: ${result.raw}`)
	}
}

export function assertNpaResultByType<T extends IResult, TT extends IResult['type']>(result: T, type: TT): asserts result is Extract<T, {
	type: TT
}>
{
	assert.strictEqual(result.type, type, `Invalid type: ${result.type}`);

	assertNpaResultAll(result);
}

export function assertNpaResultAll<T extends IResult>(result: T): asserts result is T
{
	if (result.type === 'git')
	{
		assert.ok(result.hosted, 'hosted is required for git type');
		assert.ok(isHostedGitResult(result), 'hosted.domain is required for git type');
	}
	else if (result.type === 'directory')
	{
		assert.ok(result.where, 'where is required for directory type');
	}
	else
	{
		assertNpaResultHasName(result);
	}

	// assert.ok(result.saveSpec, 'saveSpec is required');
}

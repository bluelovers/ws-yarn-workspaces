/**
 * @fileoverview Tests for type guard functions
 * @description 類型守衛函數的測試
 */

import npa from '../index';
import {
	isAliasResult,
	isFileResult,
	isRegistryResult,
	isHostedGitResult,
	isURLResult,
	isNpmPackageArgResult,
} from '../lib/detect';

/**
 * Tests for isAliasResult function
 * isAliasResult 函數的測試
 */
describe('isAliasResult', () =>
{
	test('should return true for alias packages', () =>
	{
		const result = npa('my-lodash@npm:lodash@4.17.21');
		const actual = isAliasResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return false for non-alias packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isAliasResult(result);

		expect(actual).toMatchSnapshot();
	});
});

/**
 * Tests for isFileResult function
 * isFileResult 函數的測試
 */
describe('isFileResult', () =>
{
	test('should return true for file packages', () =>
	{
		const result = npa('./packages/my-pkg');
		const actual = isFileResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for directory packages', () =>
	{
		const result = npa('../other-pkg');
		const actual = isFileResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return false for registry packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isFileResult(result);

		expect(actual).toMatchSnapshot();
	});
});

/**
 * Tests for isRegistryResult function
 * isRegistryResult 函數的測試
 */
describe('isRegistryResult', () =>
{
	test('should return true for version packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isRegistryResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for range packages', () =>
	{
		const result = npa('lodash@^4.17.0');
		const actual = isRegistryResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for tag packages', () =>
	{
		const result = npa('lodash@beta');
		const actual = isRegistryResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for packages without version (defaults to tag)', () =>
	{
		const result = npa('lodash');
		const actual = isRegistryResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return false for git packages', () =>
	{
		const result = npa('bluelovers/ws-yarn-workspaces');
		const actual = isRegistryResult(result);

		expect(actual).toMatchSnapshot();
	});
});

/**
 * Tests for isHostedGitResult function
 * isHostedGitResult 函數的測試
 */
describe('isHostedGitResult', () =>
{
	test('should return true for GitHub shorthand', () =>
	{
		const result = npa('bluelovers/ws-yarn-workspaces');
		const actual = isHostedGitResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for GitHub URL', () =>
	{
		const result = npa('github:bluelovers/ws-yarn-workspaces');
		const actual = isHostedGitResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return false for registry packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isHostedGitResult(result);

		expect(actual).toMatchSnapshot();
	});
});

/**
 * Tests for isURLResult function
 * isURLResult 函數的測試
 */
describe('isURLResult', () =>
{
	test('should return false for GitHub shorthand (hosted)', () =>
	{
		const result = npa('bluelovers/ws-yarn-workspaces');
		const actual = isURLResult(result);

		// GitHub shorthand is hosted, not URL
		// GitHub 簡寫是託管的，不是 URL
		expect(actual).toMatchSnapshot();
	});

	test('should return false for registry packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isURLResult(result);

		expect(actual).toMatchSnapshot();
	});
});

/**
 * Tests for isNpmPackageArgResult function
 * isNpmPackageArgResult 函數的測試
 */
describe('isNpmPackageArgResult', () =>
{
	test('should return true for registry packages', () =>
	{
		const result = npa('lodash@4.17.21');
		const actual = isNpmPackageArgResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for git packages', () =>
	{
		const result = npa('bluelovers/ws-yarn-workspaces');
		const actual = isNpmPackageArgResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for alias packages', () =>
	{
		const result = npa('my-lodash@npm:lodash@4.17.21');
		const actual = isNpmPackageArgResult(result);

		expect(actual).toMatchSnapshot();
	});

	test('should return true for file packages', () =>
	{
		const result = npa('./packages/my-pkg');
		const actual = isNpmPackageArgResult(result);

		expect(actual).toMatchSnapshot();
	});
});
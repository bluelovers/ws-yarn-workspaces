/**
 * @fileoverview Tests for generatePackageArg functions
 * @description generatePackageArg 函數的測試
 */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { generatePackageArg, _allowedResultType } from '../lib/generatePackageArg';

/**
 * Tests for generatePackageArg function
 * generatePackageArg 函數的測試
 */
describe('generatePackageArg', () =>
{
	/**
	 * Test generating package argument without version
	 * 測試生成不含版本的套件參數
	 */
	describe('without version', () =>
	{
		test('should generate package name only', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash' });

			t.assert.snapshot(result);
		});

		test('should generate scoped package name', (t) =>
		{
			const result = generatePackageArg({ name: '@types/node' });

			t.assert.snapshot(result);
		});
	});

	/**
	 * Test generating package argument with version
	 * 測試生成含版本的套件參數
	 */
	describe('with version', () =>
	{
		test('should generate package with version when includeVersion is true', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, true);

			t.assert.snapshot(result);
		});

		test('should generate scoped package with version', (t) =>
		{
			const result = generatePackageArg({ name: '@types/node', semver: '18.0.0' }, true);

			t.assert.snapshot(result);
		});

		test('should not include version when includeVersion is false', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, false);

			t.assert.snapshot(result);
		});

		test('should not include version when includeVersion is not provided', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' });

			t.assert.snapshot(result);
		});
	});

	/**
	 * Test edge cases
	 * 測試邊界情況
	 */
	describe('edge cases', () =>
	{
		test('should handle empty semver', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '' }, true);

			t.assert.snapshot(result);
		});

		test('should handle undefined semver', (t) =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: undefined }, true);

			t.assert.snapshot(result);
		});
	});
});

/**
 * Tests for _allowedResultType function
 * _allowedResultType 函數的測試
 */
describe('_allowedResultType', () =>
{
	test('should return true for version type', () =>
	{
		const result = _allowedResultType('version');

		assert.ok(result);
	});

	test('should return true for range type', () =>
	{
		const result = _allowedResultType('range');

		assert.ok(result);
	});

	test('should return true for tag type', () =>
	{
		const result = _allowedResultType('tag');

		assert.ok(result);
	});

	test('should return false for git type', () =>
	{
		const result = _allowedResultType('git');

		assert.ok(!result);
	});

	test('should return false for file type', () =>
	{
		const result = _allowedResultType('file');

		assert.ok(!result);
	});

	test('should return false for directory type', () =>
	{
		const result = _allowedResultType('directory');

		assert.ok(!result);
	});

	test('should return false for alias type', () =>
	{
		const result = _allowedResultType('alias');

		assert.ok(!result);
	});

	test('should return false for remote type', () =>
	{
		const result = _allowedResultType('remote');

		assert.ok(!result);
	});
});

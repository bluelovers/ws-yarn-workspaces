/**
 * @fileoverview Tests for parseArgvPkgName functions
 * @description parseArgvPkgName 函數的測試
 */

import { describe, test } from 'node:test';
import { parsePackageName, parseArgvPkgName } from '../lib/parseArgvPkgName';

/**
 * Tests for parsePackageName function
 * parsePackageName 函數的測試
 */
describe('parsePackageName', () =>
{
	/**
	 * Test parsing simple packages
	 * 測試解析簡單套件
	 */
	describe('simple packages', () =>
	{
		test('should parse package without version', (t) =>
		{
			const result = parsePackageName('lodash');

			t.assert.snapshot(result);
		});

		test('should parse package with version', (t) =>
		{
			const result = parsePackageName('lodash@4.17.21');

			t.assert.snapshot(result);
		});

		test('should parse package with version range', (t) =>
		{
			const result = parsePackageName('lodash@^4.17.0');

			t.assert.snapshot(result);
		});
	});

	/**
	 * Test parsing scoped packages
	 * 測試解析範圍套件
	 */
	describe('scoped packages', () =>
	{
		test('should parse scoped package without version', (t) =>
		{
			const result = parsePackageName('@types/node');

			t.assert.snapshot(result);
		});

		test('should parse scoped package with version', (t) =>
		{
			const result = parsePackageName('@types/node@18.0.0');

			t.assert.snapshot(result);
		});

		test('should parse scoped package with range', (t) =>
		{
			const result = parsePackageName('@types/node@^18.0.0');

			t.assert.snapshot(result);
		});
	});
});

/**
 * Tests for parseArgvPkgName function (deprecated)
 * parseArgvPkgName 函數的測試（已棄用）
 */
describe('parseArgvPkgName', () =>
{
	test('should parse package name and version', (t) =>
	{
		const result = parseArgvPkgName('lodash@4.17.21');

		t.assert.snapshot(result);
	});

	test('should parse scoped package', (t) =>
	{
		const result = parseArgvPkgName('@types/node@^18.0.0');

		t.assert.snapshot(result);
	});
});

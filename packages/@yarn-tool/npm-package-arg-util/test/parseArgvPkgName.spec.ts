/**
 * @fileoverview Tests for parseArgvPkgName functions
 * @description parseArgvPkgName 函數的測試
 */

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
		test('should parse package without version', () =>
		{
			const result = parsePackageName('lodash');

			expect(result).toMatchSnapshot();
		});

		test('should parse package with version', () =>
		{
			const result = parsePackageName('lodash@4.17.21');

			expect(result).toMatchSnapshot();
		});

		test('should parse package with version range', () =>
		{
			const result = parsePackageName('lodash@^4.17.0');

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test parsing scoped packages
	 * 測試解析範圍套件
	 */
	describe('scoped packages', () =>
	{
		test('should parse scoped package without version', () =>
		{
			const result = parsePackageName('@types/node');

			expect(result).toMatchSnapshot();
		});

		test('should parse scoped package with version', () =>
		{
			const result = parsePackageName('@types/node@18.0.0');

			expect(result).toMatchSnapshot();
		});

		test('should parse scoped package with range', () =>
		{
			const result = parsePackageName('@types/node@^18.0.0');

			expect(result).toMatchSnapshot();
		});
	});
});

/**
 * Tests for parseArgvPkgName function (deprecated)
 * parseArgvPkgName 函數的測試（已棄用）
 */
describe('parseArgvPkgName', () =>
{
	test('should parse package name and version', () =>
	{
		const result = parseArgvPkgName('lodash@4.17.21');

		expect(result).toMatchSnapshot();
	});

	test('should parse scoped package', () =>
	{
		const result = parseArgvPkgName('@types/node@^18.0.0');

		expect(result).toMatchSnapshot();
	});
});
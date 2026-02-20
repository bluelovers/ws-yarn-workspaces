/**
 * @fileoverview Tests for main npa functions
 * @description 主要 npa 函數的測試
 */

import npa, { npaTry, getSemverFromNpaResult } from '../index';

/**
 * Tests for npa function
 * npa 函數的測試
 */
describe('npa', () =>
{
	/**
	 * Test parsing simple package names
	 * 測試解析簡單套件名稱
	 */
	describe('simple packages', () =>
	{
		test('should parse package name without version', () =>
		{
			const result = npa('lodash');

			expect(result).toMatchSnapshot();
		});

		test('should parse package name with exact version', () =>
		{
			const result = npa('lodash@4.17.21');

			expect(result).toMatchSnapshot();
		});

		test('should parse package name with version range', () =>
		{
			const result = npa('lodash@^4.17.0');

			expect(result).toMatchSnapshot();
		});

		test('should parse package name with tag', () =>
		{
			const result = npa('lodash@beta');

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test parsing scoped package names
	 * 測試解析範圍套件名稱
	 */
	describe('scoped packages', () =>
	{
		test('should parse scoped package without version', () =>
		{
			const result = npa('@types/node');

			expect(result).toMatchSnapshot();
		});

		test('should parse scoped package with version', () =>
		{
			const result = npa('@types/node@18.0.0');

			expect(result).toMatchSnapshot();
		});

		test('should parse scoped package with range', () =>
		{
			const result = npa('@types/node@^18.0.0');

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test parsing git repositories
	 * 測試解析 git 儲存庫
	 */
	describe('git packages', () =>
	{
		test('should parse GitHub shorthand', () =>
		{
			const result = npa('bluelovers/ws-yarn-workspaces');

			expect(result).toMatchSnapshot();
		});

		test('should parse GitHub shorthand with package name', () =>
		{
			const result = npa('ws-yarn-workspaces@bluelovers/ws-yarn-workspaces');

			expect(result).toMatchSnapshot();
		});

		test('should parse GitHub URL', () =>
		{
			const result = npa('github:bluelovers/ws-yarn-workspaces');

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test parsing alias packages
	 * 測試解析別名套件
	 */
	describe('alias packages', () =>
	{
		test('should parse npm alias', () =>
		{
			const result = npa('my-lodash@npm:lodash@4.17.21');

			expect(result).toMatchSnapshot({
				"name": "my-lodash",
				"subSpec": {
					"name": "lodash",
					"rawSpec": "4.17.21",
				}
			});
		});
	});
});

/**
 * Tests for npaTry function
 * npaTry 函數的測試
 */
describe('npaTry', () =>
{
	test('should return result for valid package', () =>
	{
		const result = npaTry('lodash@4.17.21');

		expect(result).toMatchSnapshot();
	});

	test('should return undefined for invalid package without throwing', () =>
	{
		// This should not throw and return undefined
		// 這不應該拋出錯誤，而是返回 undefined
		const result = npaTry('invalid:package:format');

		expect(result).toBeUndefined();
	});
});

/**
 * Tests for getSemverFromNpaResult function
 * getSemverFromNpaResult 函數的測試
 */
describe('getSemverFromNpaResult', () =>
{
	test('should extract version from version type', () =>
	{
		const result = npa('lodash@4.17.21');
		const semver = getSemverFromNpaResult(result);

		expect(semver).toMatchSnapshot();
	});

	test('should extract version from range type', () =>
	{
		const result = npa('lodash@^4.17.0');
		const semver = getSemverFromNpaResult(result);

		expect(semver).toMatchSnapshot();
	});

	test('should extract version from tag type', () =>
	{
		const result = npa('lodash@beta');
		const semver = getSemverFromNpaResult(result);

		expect(semver).toMatchSnapshot();
	});

	test('should extract version from alias type', () =>
	{
		const result = npa('my-lodash@npm:lodash@4.17.21');
		const semver = getSemverFromNpaResult(result);

		expect(semver).toMatchSnapshot();
	});

	test('should return empty string for package without version', () =>
	{
		const result = npa('lodash');
		const semver = getSemverFromNpaResult(result);

		expect(semver).toMatchSnapshot();
	});
});
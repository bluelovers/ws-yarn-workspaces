/**
 * @fileoverview Tests for main npa functions
 * @description 主要 npa 函數的測試
 */

import { npaTry } from '../index';
import { _lazyTestNpa, _lazyTestGetSemver } from './lib/test';

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
			_lazyTestNpa('lodash');
		});

		test('should parse package name with exact version', () =>
		{
			_lazyTestNpa('lodash@4.17.21', {
				type: 'version',
			});
		});

		test('should parse package name with version range', () =>
		{
			_lazyTestNpa('lodash@^4.17.0', {
				type: 'range',
			});
		});

		test('should parse package name with tag', () =>
		{
			_lazyTestNpa('lodash@beta', {
				type: 'tag',
			});
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
			_lazyTestNpa('@types/node', {
				scope: '@types',
			});
		});

		test('should parse scoped package with version', () =>
		{
			_lazyTestNpa('@types/node@18.0.0', {
				type: 'version',
				scope: '@types',
			});
		});

		test('should parse scoped package with range', () =>
		{
			_lazyTestNpa('@types/node@^18.0.0', {
				type: 'range',
				scope: '@types',
			});
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
			_lazyTestNpa('bluelovers/ws-yarn-workspaces', {
				type: 'git',
			});
		});

		test('should parse GitHub shorthand with package name', () =>
		{
			_lazyTestNpa('ws-yarn-workspaces@bluelovers/ws-yarn-workspaces', {
				type: 'git',
			});
		});

		test('should parse GitHub URL', () =>
		{
			_lazyTestNpa('github:bluelovers/ws-yarn-workspaces', {
				type: 'git',
			});
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
			_lazyTestNpa('my-lodash@npm:lodash@4.17.21', {
				type: 'alias',
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
		_lazyTestGetSemver('lodash@4.17.21');
	});

	test('should extract version from range type', () =>
	{
		_lazyTestGetSemver('lodash@^4.17.0');
	});

	test('should extract version from tag type', () =>
	{
		_lazyTestGetSemver('lodash@beta');
	});

	test('should extract version from alias type', () =>
	{
		_lazyTestGetSemver('my-lodash@npm:lodash@4.17.21');
	});

	test('should return latest for package without version', () =>
	{
		_lazyTestGetSemver('lodash');
	});
});
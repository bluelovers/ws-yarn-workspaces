/**
 * @fileoverview Tests for generatePackageArg functions
 * @description generatePackageArg 函數的測試
 */

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
		test('should generate package name only', () =>
		{
			const result = generatePackageArg({ name: 'lodash' });

			expect(result).toMatchSnapshot();
		});

		test('should generate scoped package name', () =>
		{
			const result = generatePackageArg({ name: '@types/node' });

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test generating package argument with version
	 * 測試生成含版本的套件參數
	 */
	describe('with version', () =>
	{
		test('should generate package with version when includeVersion is true', () =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, true);

			expect(result).toMatchSnapshot();
		});

		test('should generate scoped package with version', () =>
		{
			const result = generatePackageArg({ name: '@types/node', semver: '18.0.0' }, true);

			expect(result).toMatchSnapshot();
		});

		test('should not include version when includeVersion is false', () =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, false);

			expect(result).toMatchSnapshot();
		});

		test('should not include version when includeVersion is not provided', () =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '^4.17.0' });

			expect(result).toMatchSnapshot();
		});
	});

	/**
	 * Test edge cases
	 * 測試邊界情況
	 */
	describe('edge cases', () =>
	{
		test('should handle empty semver', () =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: '' }, true);

			expect(result).toMatchSnapshot();
		});

		test('should handle undefined semver', () =>
		{
			const result = generatePackageArg({ name: 'lodash', semver: undefined }, true);

			expect(result).toMatchSnapshot();
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

		expect(result).toMatchSnapshot();
	});

	test('should return true for range type', () =>
	{
		const result = _allowedResultType('range');

		expect(result).toMatchSnapshot();
	});

	test('should return true for tag type', () =>
	{
		const result = _allowedResultType('tag');

		expect(result).toMatchSnapshot();
	});

	test('should return false for git type', () =>
	{
		const result = _allowedResultType('git');

		expect(result).toMatchSnapshot();
	});

	test('should return false for file type', () =>
	{
		const result = _allowedResultType('file');

		expect(result).toMatchSnapshot();
	});

	test('should return false for directory type', () =>
	{
		const result = _allowedResultType('directory');

		expect(result).toMatchSnapshot();
	});

	test('should return false for alias type', () =>
	{
		const result = _allowedResultType('alias');

		expect(result).toMatchSnapshot();
	});

	test('should return false for remote type', () =>
	{
		const result = _allowedResultType('remote');

		expect(result).toMatchSnapshot();
	});
});
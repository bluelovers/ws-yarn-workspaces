/**
 * 測試 ampersand (&) 語法支援 / Test ampersand (&) syntax support
 */
import { satisfies, validRange, handleAmpersandAndSpaces } from '../index';
import { Range } from '../lib/Range';

describe(`ampersand syntax support`, () =>
{

	describe('satisfies with ampersand', () =>
	{

		test('should work with single ampersand condition', () =>
		{
			expect(satisfies('1.2.3', '>=1.0.0 & <2.0.0')).toBe(true);
			expect(satisfies('2.0.0', '>=1.0.0 & <2.0.0')).toBe(false);
			expect(satisfies('0.9.0', '>=1.0.0 & <2.0.0')).toBe(false);
		});

		test('should work with multiple ampersand conditions', () =>
		{
			expect(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & >1.2.0')).toBe(true);
			expect(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & >1.2.4')).toBe(false);
			expect(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & <1.2.2')).toBe(false);
		});

		test('should work with caret and ampersand', () =>
		{
			expect(satisfies('1.2.3', '^1.0.0 & >=1.2.0')).toBe(true);
			expect(satisfies('1.1.0', '^1.0.0 & >=1.2.0')).toBe(false);
		});

		test('should work with tilde and ampersand', () =>
		{
			expect(satisfies('1.2.5', '~1.2.0 & >=1.2.3')).toBe(true);
			expect(satisfies('1.3.0', '~1.2.0 & >=1.2.3')).toBe(false);
		});

		test('should work with mixed || and &', () =>
		{
			expect(satisfies('1.2.3', '>=1.0.0 & <2.0.0 || >=3.0.0')).toBe(true);
			expect(satisfies('2.5.0', '>=1.0.0 & <2.0.0 || >=3.0.0')).toBe(false);
			expect(satisfies('3.5.0', '>=1.0.0 & <2.0.0 || >=3.0.0')).toBe(true);
		});

	});

	describe('validRange with ampersand', () =>
	{

		test('should validate ampersand ranges', () =>
		{
			expect(validRange('>=1.0.0 & <2.0.0')).not.toBeNull();
			expect(validRange('>=1.0.0 & invalid')).toBeNull();
		});

		test('should validate complex ampersand ranges', () =>
		{
			expect(validRange('^1.0.0 & >=1.2.0')).not.toBeNull();
			expect(validRange('~1.2.0 & >=1.2.3 & <1.3.0')).not.toBeNull();
		});

	});

	describe('handleAmpersandAndSpaces', () =>
	{

		test('should handle ampersand in range string', () =>
		{
			const result = handleAmpersandAndSpaces('>=1.0.0 & <2.0.0');
			expect(result).toBeDefined();
		});

		test('should handle spaces in range string', () =>
		{
			const result = handleAmpersandAndSpaces('>=1.0.0 <2.0.0');
			expect(result).toBeDefined();
		});

	});

	describe('Range class with ampersand', () =>
	{

		test('should create Range with ampersand syntax', () =>
		{
			const range = new Range('>=1.0.0 & <2.0.0');

			expect(range.test('1.5.0')).toBe(true);
			expect(range.test('2.0.0')).toBe(false);
			expect(range.test('0.9.0')).toBe(false);
		});

		test('should handle complex ranges with ampersand', () =>
		{
			const range = new Range('^1.0.0 & >=1.2.0');

			expect(range.test('1.2.3')).toBe(true);
			expect(range.test('1.1.0')).toBe(false);
			expect(range.test('2.0.0')).toBe(false);
		});

		test('should convert ampersand range to string', () =>
		{
			const range = new Range('>=1.0.0 & <2.0.0');
			const str = range.toString();

			expect(str).toBeDefined();
			expect(typeof str).toBe('string');
		});

	});

});

describe('comparison with standard semver', () =>
{

	test('ampersand should be equivalent to space for simple ranges', () =>
	{
		const version = '1.5.0';
		const rangeWithSpace = '>=1.0.0 <2.0.0';
		const rangeWithAmpersand = '>=1.0.0 & <2.0.0';

		expect(satisfies(version, rangeWithSpace)).toBe(satisfies(version, rangeWithAmpersand));
	});

	test('ampersand should work with prerelease versions', () =>
	{
		// prerelease 版本能正確匹配包含 prerelease 的 range
		expect(satisfies('1.0.0-alpha.1', '>=1.0.0-alpha.0 & <1.0.0')).toBe(true);
		expect(satisfies('1.0.0-beta.1', '>=1.0.0-alpha.0 & <1.0.0')).toBe(true);
		expect(satisfies('1.0.0-alpha.5', '>=1.0.0-alpha.3 & <1.0.0-alpha.10')).toBe(true);
		
		// prerelease 版本不會匹配不包含 prerelease 的 range
		expect(satisfies('1.0.0-alpha.1', '>=1.0.0 & <2.0.0')).toBe(false);
		expect(satisfies('1.0.0-beta.1', '>=1.0.0 & <2.0.0')).toBe(false);
		
		// 正式版本能正確匹配
		expect(satisfies('1.0.0', '>=1.0.0-alpha.0 & <2.0.0')).toBe(true);
	});

});
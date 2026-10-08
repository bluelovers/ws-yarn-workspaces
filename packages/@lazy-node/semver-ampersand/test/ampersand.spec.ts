/**
 * 測試 ampersand (&) 語法支援 / Test ampersand (&) syntax support
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { satisfies, validRange, handleAmpersandAndSpaces } from '../index';
import { Range } from '../lib/Range';

describe(`ampersand syntax support`, () =>
{

	describe('satisfies with ampersand', () =>
	{

		test('should work with single ampersand condition', (t: test.TestContext) =>
		{
			assert.strictEqual(satisfies('1.2.3', '>=1.0.0 & <2.0.0'), true);
			assert.strictEqual(satisfies('2.0.0', '>=1.0.0 & <2.0.0'), false);
			t.assert.strictEqual(satisfies('0.9.0', '>=1.0.0 & <2.0.0'), false);
			
		});

		test('should work with multiple ampersand conditions', () =>
		{
			assert.strictEqual(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & >1.2.0'), true);
			assert.strictEqual(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & >1.2.4'), false);
			assert.strictEqual(satisfies('1.2.3', '>=1.0.0 & <2.0.0 & <1.2.2'), false);
		});

		test('should work with caret and ampersand', () =>
		{
			assert.strictEqual(satisfies('1.2.3', '^1.0.0 & >=1.2.0'), true);
			assert.strictEqual(satisfies('1.1.0', '^1.0.0 & >=1.2.0'), false);
		});

		test('should work with tilde and ampersand', () =>
		{
			assert.strictEqual(satisfies('1.2.5', '~1.2.0 & >=1.2.3'), true);
			assert.strictEqual(satisfies('1.3.0', '~1.2.0 & >=1.2.3'), false);
		});

		test('should work with mixed || and &', () =>
		{
			assert.strictEqual(satisfies('1.2.3', '>=1.0.0 & <2.0.0 || >=3.0.0'), true);
			assert.strictEqual(satisfies('2.5.0', '>=1.0.0 & <2.0.0 || >=3.0.0'), false);
			assert.strictEqual(satisfies('3.5.0', '>=1.0.0 & <2.0.0 || >=3.0.0'), true);
		});

	});

	describe('validRange with ampersand', () =>
	{

		test('should validate ampersand ranges', () =>
		{
			assert.notStrictEqual(validRange('>=1.0.0 & <2.0.0'), null);
			assert.strictEqual(validRange('>=1.0.0 & invalid'), null);
		});

		test('should validate complex ampersand ranges', () =>
		{
			assert.notStrictEqual(validRange('^1.0.0 & >=1.2.0'), null);
			assert.notStrictEqual(validRange('~1.2.0 & >=1.2.3 & <1.3.0'), null);
		});

	});

	describe('handleAmpersandAndSpaces', () =>
	{

		test('should handle ampersand in range string', () =>
		{
			const result = handleAmpersandAndSpaces('>=1.0.0 & <2.0.0');
			assert.notStrictEqual(result, undefined);
		});

		test('should handle spaces in range string', () =>
		{
			const result = handleAmpersandAndSpaces('>=1.0.0 <2.0.0');
			assert.notStrictEqual(result, undefined);
		});

	});

	describe('Range class with ampersand', () =>
	{

		test('should create Range with ampersand syntax', () =>
		{
			const range = new Range('>=1.0.0 & <2.0.0');

			assert.strictEqual(range.test('1.5.0'), true);
			assert.strictEqual(range.test('2.0.0'), false);
			assert.strictEqual(range.test('0.9.0'), false);
		});

		test('should handle complex ranges with ampersand', () =>
		{
			const range = new Range('^1.0.0 & >=1.2.0');

			assert.strictEqual(range.test('1.2.3'), true);
			assert.strictEqual(range.test('1.1.0'), false);
			assert.strictEqual(range.test('2.0.0'), false);
		});

		test('should convert ampersand range to string', () =>
		{
			const range = new Range('>=1.0.0 & <2.0.0');
			const str = range.toString();

			assert.notStrictEqual(str, undefined);
			assert.strictEqual(typeof str, 'string');
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

		assert.strictEqual(satisfies(version, rangeWithSpace), satisfies(version, rangeWithAmpersand));
	});

	test('ampersand should work with prerelease versions', () =>
	{
		// prerelease 版本能正確匹配包含 prerelease 的 range
		assert.strictEqual(satisfies('1.0.0-alpha.1', '>=1.0.0-alpha.0 & <1.0.0'), true);
		assert.strictEqual(satisfies('1.0.0-beta.1', '>=1.0.0-alpha.0 & <1.0.0'), true);
		assert.strictEqual(satisfies('1.0.0-alpha.5', '>=1.0.0-alpha.3 & <1.0.0-alpha.10'), true);

		// prerelease 版本不會匹配不包含 prerelease 的 range
		assert.strictEqual(satisfies('1.0.0-alpha.1', '>=1.0.0 & <2.0.0'), false);
		assert.strictEqual(satisfies('1.0.0-beta.1', '>=1.0.0 & <2.0.0'), false);

		// 正式版本能正確匹配
		assert.strictEqual(satisfies('1.0.0', '>=1.0.0-alpha.0 & <2.0.0'), true);
	});

});

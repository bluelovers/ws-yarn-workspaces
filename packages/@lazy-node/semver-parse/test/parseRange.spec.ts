/**
 * 測試 parseRange 功能 / Test parseRange functionality
 * 
 * 此測試檔案專注於 parseRange 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the parseRange function
 */
import { parseRange, stringifyRange } from '../index';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('parseRange', () =>
{
	describe('單一版本解析 / Single version parsing', () =>
	{
		test('should parse exact version', (t) =>
		{
			const result = parseRange('1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse version with v prefix', (t) =>
		{
			const result = parseRange('v1.2.3');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});
	});

	describe('運算子解析 / Operator parsing', () =>
	{
		test('should parse >= operator', (t) =>
		{
			const result = parseRange('>=1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse <= operator', (t) =>
		{
			const result = parseRange('<=2.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse > operator', (t) =>
		{
			const result = parseRange('>1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse < operator', (t) =>
		{
			const result = parseRange('<2.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse = operator', (t) =>
		{
			const result = parseRange('=1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse ^ (caret) operator', (t) =>
		{
			const result = parseRange('^1.2.3');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse ~ (tilde) operator', (t) =>
		{
			const result = parseRange('~1.2.3');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse ~> operator', (t) =>
		{
			const result = parseRange('~>1.2.3');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse operator with space', (t) =>
		{
			const result = parseRange('>= 1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse operator with v prefix', (t) =>
		{
			const result = parseRange('>= v1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse tilde with v prefix', (t) =>
		{
			const result = parseRange('~v1.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});
	});

	describe('預發布版本與建構元資料 / Pre-release and build metadata', () =>
	{
		test('should parse pre-release version', (t) =>
		{
			const result = parseRange('1.0.0-rc1');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse pre-release with hyphens', (t) =>
		{
			const result = parseRange('1.0.0-rc-2');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse build metadata', (t) =>
		{
			const result = parseRange('2.0.0+build.1848');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse pre-release and build together', (t) =>
		{
			const result = parseRange('1.0.0-alpha+build.123');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});
	});

	describe('範圍組合 / Range combinations', () =>
	{
		test('should parse AND range (space separated)', (t) =>
		{
			const result = parseRange('>=1.0.0 <2.0.0');
			assert.strictEqual(result.length, 2);
			t.assert.snapshot(result[0]);
			t.assert.snapshot(result[1]);
		});

		test('should parse OR range (|| separated)', (t) =>
		{
			const result = parseRange('~1.0.0 || ~2.0.0');
			assert.strictEqual(result.length, 3);
			t.assert.snapshot(result[0]);
			t.assert.snapshot(result[1]);
			t.assert.snapshot(result[2]);
		});

		test('should parse hyphen range', (t) =>
		{
			const result = parseRange('1.0.0 - 2.0.0');
			assert.strictEqual(result.length, 3);
			t.assert.snapshot(result[0]);
			t.assert.snapshot(result[1]);
			t.assert.snapshot(result[2]);
		});

		test('should parse complex range', (t) =>
		{
			const result = parseRange('>= 1.1.7 < 2.0.0 || 1.1.3');
			assert.strictEqual(result.length, 4);
			t.assert.snapshot(result);
		});

		test('should parse caret range with OR', (t) =>
		{
			const result = parseRange('^1.2.0 || >=2.0.0 <3.0.0');
			t.assert.snapshot(result);
		});
	});

	describe('萬用字元與 x 範圍 / Wildcard and x ranges', () =>
	{
		test('should parse * wildcard', (t) =>
		{
			const result = parseRange('*');
			t.assert.snapshot(result);
		});

		test('should parse x range (major.x)', (t) =>
		{
			const result = parseRange('1.x');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse * range (major.*)', (t) =>
		{
			const result = parseRange('1.*');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse x.x range', (t) =>
		{
			const result = parseRange('1.2.x');
			t.assert.snapshot(result);
		});

		test('should parse *.* range', (t) =>
		{
			const result = parseRange('1.2.*');
			t.assert.snapshot(result);
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should parse 0.x version', (t) =>
		{
			const result = parseRange('0.0.1');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should parse version 0.0.0', (t) =>
		{
			const result = parseRange('0.0.0');
			assert.strictEqual(result.length, 1);
			t.assert.snapshot(result[0]);
		});

		test('should handle extra whitespace', (t) =>
		{
			const result = parseRange('  >=  1.0.0  <  2.0.0  ');
			t.assert.snapshot(result);
		});
	});

	describe('與 stringifyRange 整合 / Integration with stringifyRange', () =>
	{
		test('should be reversible with simple range', () =>
		{
			const range = '>=1.0.0 <2.0.0';
			const result = parseRange(range);
			assert.strictEqual(stringifyRange(result), '>=1.0.0 <2.0.0');
		});

		test('should be reversible with OR range', () =>
		{
			const range = '~1.0.0 || ~2.0.0';
			const result = parseRange(range);
			assert.strictEqual(stringifyRange(result), '~1.0.0 || ~2.0.0');
		});

		test('should be reversible with hyphen range', () =>
		{
			const range = '1.0.0 - 2.0.0';
			const result = parseRange(range);
			assert.strictEqual(stringifyRange(result), '1.0.0 - 2.0.0');
		});

		test('should be reversible with caret range', () =>
		{
			const range = '^1.2.3';
			const result = parseRange(range);
			assert.strictEqual(stringifyRange(result), '^1.2.3');
		});

		test('should be reversible with complex range', (t) =>
		{
			const range = '>= 1.1.7 < 2.0.0 || 1.1.3';
			const result = parseRange(range);
			// Note: stringifyRange normalizes spacing
			t.assert.snapshot(stringifyRange(result));
		});
	});

	describe('實際套件版本範例 / Real package version examples', () =>
	{
		test('should parse typical npm dependency range', (t) =>
		{
			const result = parseRange('^16.8.0');
			t.assert.snapshot(result);
		});

		test('should parse peer dependency range', (t) =>
		{
			const result = parseRange('>=16.0.0 <18.0.0');
			t.assert.snapshot(result);
		});

		test('should parse dev dependency range', (t) =>
		{
			const result = parseRange('~4.4.0 || ~5.0.0');
			t.assert.snapshot(result);
		});

		test('should parse exact version with build', (t) =>
		{
			const result = parseRange('1.0.0+build.1848');
			t.assert.snapshot(result);
		});
	});
});
/**
 * 測試 parse 功能 / Test parse functionality
 *
 * 此測試檔案專注於 parse 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the parse function
 */
import { parse } from '../index';
import { stringify, stringifyFull } from '../index';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('parse', () =>
{
	describe('基本版本解析 / Basic version parsing', () =>
	{
		test('should parse a simple 3-part version', (t) =>
		{
			const result = parse('1.0.0');
			t.assert.snapshot(result);
		});

		test('should parse version with different numbers', (t) =>
		{
			const result = parse('2.3.4');
			t.assert.snapshot(result);
		});

		test('should parse version with v prefix', (t) =>
		{
			const result = parse('v1.2.3');
			t.assert.snapshot(result);
		});

		test('should parse version with large numbers', (t) =>
		{
			const result = parse('100.200.300');
			t.assert.snapshot(result);
		});
	});

	describe('運算子解析 / Operator parsing', () =>
	{
		test('should parse >= operator', (t) =>
		{
			const result = parse('>=1.0.0');
			t.assert.snapshot(result);
		});

		test('should parse <= operator', (t) =>
		{
			const result = parse('<=2.0.0');
			t.assert.snapshot(result);
		});

		test('should parse > operator', (t) =>
		{
			const result = parse('>1.5.0');
			t.assert.snapshot(result);
		});

		test('should parse < operator', (t) =>
		{
			const result = parse('<3.0.0');
			t.assert.snapshot(result);
		});

		test('should parse = operator', (t) =>
		{
			const result = parse('=1.0.0');
			t.assert.snapshot(result);
		});

		test('should parse ^ (caret) operator', (t) =>
		{
			const result = parse('^1.2.3');
			t.assert.snapshot(result);
		});

		test('should parse ~ (tilde) operator', (t) =>
		{
			const result = parse('~1.2.3');
			t.assert.snapshot(result);
		});

		test('should parse ~> operator', (t) =>
		{
			const result = parse('~>1.2.3');
			t.assert.snapshot(result);
		});

		test('should parse operator with space', (t) =>
		{
			const result = parse('>= 1.0.0');
			t.assert.snapshot(result);
		});

		test('should parse operator with v prefix', (t) =>
		{
			const result = parse('>=v1.0.0');
			t.assert.snapshot(result);
		});
	});

	describe('預發布版本解析 / Pre-release version parsing', () =>
	{
		test('should parse alpha pre-release', (t) =>
		{
			const result = parse('1.0.0-alpha');
			t.assert.snapshot(result);
		});

		test('should parse beta pre-release', (t) =>
		{
			const result = parse('1.0.0-beta');
			t.assert.snapshot(result);
		});

		test('should parse rc pre-release', (t) =>
		{
			const result = parse('1.0.0-rc.1');
			t.assert.snapshot(result);
		});

		test('should parse pre-release with numbers', (t) =>
		{
			const result = parse('1.0.0-alpha.1');
			t.assert.snapshot(result);
		});

		test('should parse pre-release with hyphens', (t) =>
		{
			const result = parse('1.0.0-beta-2');
			t.assert.snapshot(result);
		});

		test('should parse complex pre-release', (t) =>
		{
			const result = parse('4.0.0-dev.20200615');
			t.assert.snapshot(result);
		});

		test('should parse pre-release with dots', (t) =>
		{
			const result = parse('1.0.0-alpha.beta.1');
			t.assert.snapshot(result);
		});
	});

	describe('建構元資料解析 / Build metadata parsing', () =>
	{
		test('should parse build metadata', (t) =>
		{
			const result = parse('1.0.0+build.123');
			t.assert.snapshot(result);
		});

		test('should parse build with numbers', (t) =>
		{
			const result = parse('1.0.0+20130313144700');
			t.assert.snapshot(result);
		});

		test('should parse build with dots', (t) =>
		{
			const result = parse('1.0.0+build.1.2.3');
			t.assert.snapshot(result);
		});

		test('should parse build with hyphens', (t) =>
		{
			const result = parse('1.0.6+build-623');
			t.assert.snapshot(result);
		});
	});

	describe('預發布與建構元資料組合 / Pre-release and build combination', () =>
	{
		test('should parse pre-release and build together', (t) =>
		{
			const result = parse('1.0.0-alpha+build.123');
			t.assert.snapshot(result);
		});

		test('should parse complex pre-release with build', (t) =>
		{
			const result = parse('1.2.3-beta.1+build.456');
			t.assert.snapshot(result);
		});

		test('should parse with operator, pre-release and build', (t) =>
		{
			const result = parse('>=1.2.3-beta.1+build.123');
			t.assert.snapshot(result);
		});
	});

	describe('無效版本處理 / Invalid version handling', () =>
	{
		test('should return undefined for invalid versions', () =>
		{
			assert.strictEqual(parse('a.b.c'), undefined);
			// 注意：'1' 和 '1.0' 現在是有效部分版本 / Note: '1' and '1.0' are now valid partial versions
			// expect(parse('1')).toBeUndefined();
			// expect(parse('1.0')).toBeUndefined();
			assert.strictEqual(parse('1.0.0b'), undefined);
			// expect(parse('1.0.0+build-abc.')).toBeUndefined();
		});

		test('should return undefined for empty string', () =>
		{
			assert.strictEqual(parse(''), undefined);
		});

		test('should return undefined for only operator', () =>
		{
			assert.strictEqual(parse('>='), undefined);
			assert.strictEqual(parse('^'), undefined);
		});

		test('should return undefined for random strings', () =>
		{
			assert.strictEqual(parse('not-a-version'), undefined);
			assert.strictEqual(parse('version 1.0.0'), undefined);
		});

		test('should NOT parse multi-range versions (use parseRange instead)', () =>
		{
			// parseSimpleSemVer 只解析單一版本，不支援多範圍
			// parseSimpleSemVer only parses single version, does not support multi-range
			// 多範圍應該使用 parseRange / Multi-range should use parseRange

			// 這些多範圍輸入不應該被 parse 成功解析
			// These multi-range inputs should not be successfully parsed by parse
			assert.strictEqual(parse('>=1.0.0 <2.0.0'), undefined);
			assert.strictEqual(parse('~1.0.0 || ~2.0.0'), undefined);
			assert.strictEqual(parse('1.0.0 - 2.0.0'), undefined);
			assert.strictEqual(parse('^1.0.0 || >=2.0.0'), undefined);
		});
	});

	describe('與 stringify 函數整合 / Integration with stringify functions', () =>
	{
		test('should be reversible with stringify', () =>
		{
			const version = '1.2.3';
			const result = parse(version);
			assert.strictEqual(stringify(result), version);
		});

		test('should be reversible with stringifyFull for versions with operator', () =>
		{
			const version = '>=1.2.3';
			const result = parse(version);
			assert.strictEqual(stringifyFull(result), version);
		});

		test('should be reversible with pre-release', () =>
		{
			const version = '1.2.3-alpha.1';
			const result = parse(version);
			assert.strictEqual(stringify(result), version);
		});

		test('should be reversible with build metadata', () =>
		{
			const version = '1.2.3+build.123';
			const result = parse(version);
			assert.strictEqual(stringify(result), version);
		});

		test('should be reversible with pre-release and build', () =>
		{
			const version = '1.2.3-beta.1+build.456';
			const result = parse(version);
			assert.strictEqual(stringify(result), version);
		});

		test('should be reversible with caret operator', () =>
		{
			const version = '^4.0.0-dev.20200615';
			const result = parse(version);
			assert.strictEqual(stringifyFull(result), version);
		});
	});
});
/**
 * 測試 stringifyRange 功能 / Test stringifyRange functionality
 * 
 * 此測試檔案專注於 stringifyRange 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the stringifyRange function
 */
import { stringifyRange, parseRange } from '../index';
import { SimpleSemVer } from '../lib/SimpleSemVer';

describe('stringifyRange', () =>
{
	describe('單一版本字串化 / Single version stringification', () =>
	{
		test('should stringify simple version', () =>
		{
			const result = stringifyRange([
				{ major: '1', minor: '0', patch: '0' },
			]);
			expect(result).toBe('1.0.0');
		});

		test('should stringify version with operator', () =>
		{
			const result = stringifyRange([
				{ operator: '^', major: '1', minor: '2', patch: '3' },
			]);
			expect(result).toBe('^1.2.3');
		});

		test('should stringify version with tilde operator', () =>
		{
			const result = stringifyRange([
				{ operator: '~', major: '2', minor: '0', patch: '0' },
			]);
			expect(result).toBe('~2.0.0');
		});

		test('should stringify version with comparison operator', () =>
		{
			const result = stringifyRange([
				{ operator: '>=', major: '1', minor: '0', patch: '0' },
			]);
			expect(result).toBe('>=1.0.0');
		});
	});

	describe('預發布與建構元資料 / Pre-release and build metadata', () =>
	{
		test('should stringify version with pre-release', () =>
		{
			const result = stringifyRange([
				{ major: '1', minor: '0', patch: '0', release: 'alpha.1' },
			]);
			expect(result).toBe('1.0.0-alpha.1');
		});

		test('should stringify version with build', () =>
		{
			const result = stringifyRange([
				{ major: '1', minor: '0', patch: '0', build: 'build.123' },
			]);
			expect(result).toBe('1.0.0+build.123');
		});

		test('should stringify version with pre-release and build', () =>
		{
			const result = stringifyRange([
				{ major: '1', minor: '2', patch: '3', release: 'beta.1', build: 'build.456' },
			]);
			expect(result).toBe('1.2.3-beta.1+build.456');
		});

		test('should stringify with operator and pre-release', () =>
		{
			const result = stringifyRange([
				{ operator: '^', major: '4', minor: '0', patch: '0', release: 'dev.20200615' },
			]);
			expect(result).toBe('^4.0.0-dev.20200615');
		});
	});

	describe('範圍組合字串化 / Range combination stringification', () =>
	{
		test('should stringify AND range', () =>
		{
			const result = stringifyRange([
				{ operator: '>=', major: '1', minor: '0', patch: '0' },
				{ operator: '<', major: '2', minor: '0', patch: '0' },
			]);
			expect(result).toBe('>=1.0.0 <2.0.0');
		});

		test('should stringify OR range', () =>
		{
			const result = stringifyRange([
				{ operator: '~', major: '1', minor: '0', patch: '0' },
				{ operator: '||' },
				{ operator: '~', major: '2', minor: '0', patch: '0' },
			]);
			expect(result).toBe('~1.0.0 || ~2.0.0');
		});

		test('should stringify hyphen range', () =>
		{
			const result = stringifyRange([
				{ major: '1', minor: '0', patch: '0' },
				{ operator: '-' },
				{ major: '2', minor: '0', patch: '0' },
			]);
			expect(result).toBe('1.0.0 - 2.0.0');
		});

		test('should stringify complex range', () =>
		{
			const result = stringifyRange([
				{ operator: '>=', major: '1', minor: '1', patch: '7' },
				{ operator: '<', major: '2', minor: '0', patch: '0' },
				{ operator: '||' },
				{ major: '1', minor: '1', patch: '3' },
			]);
			expect(result).toBe('>=1.1.7 <2.0.0 || 1.1.3');
		});
	});

	describe('使用 SimpleSemVer 實例 / Using SimpleSemVer instances', () =>
	{
		test('should stringify SimpleSemVer instance', () =>
		{
			const semver = new SimpleSemVer({
				operator: '^',
				major: '1',
				minor: '2',
				patch: '3',
			});
			const result = stringifyRange([semver as any]);
			expect(result).toBe('^1.2.3');
		});

		test('should stringify mixed SimpleSemVer and plain objects', () =>
		{
			const semver1 = new SimpleSemVer({
				operator: '>=',
				major: '1',
				minor: '0',
				patch: '0',
			});
			const semver2 = {
				operator: '<',
				major: '2',
				minor: '0',
				patch: '0',
			};
			const result = stringifyRange([semver1 as any, semver2 as any]);
			expect(result).toBe('>=1.0.0 <2.0.0');
		});
	});

	describe('與 parseRange 整合 / Integration with parseRange', () =>
	{
		test('should be reversible for simple range', () =>
		{
			const original = '^1.2.3';
			const parsed = parseRange(original);
			const result = stringifyRange(parsed);
			expect(result).toBe(original);
		});

		test('should be reversible for AND range', () =>
		{
			const original = '>=1.0.0 <2.0.0';
			const parsed = parseRange(original);
			const result = stringifyRange(parsed);
			expect(result).toBe(original);
		});

		test('should be reversible for OR range', () =>
		{
			const original = '~1.0.0 || ~2.0.0';
			const parsed = parseRange(original);
			const result = stringifyRange(parsed);
			expect(result).toBe(original);
		});

		test('should be reversible for hyphen range', () =>
		{
			const original = '1.0.0 - 2.0.0';
			const parsed = parseRange(original);
			const result = stringifyRange(parsed);
			expect(result).toBe(original);
		});

		test('should be reversible for complex range', () =>
		{
			const original = '>=1.1.7 <2.0.0 || 1.1.3';
			const parsed = parseRange(original);
			const result = stringifyRange(parsed);
			expect(result).toBe(original);
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should handle empty array', () =>
		{
			const result = stringifyRange([]);
			expect(result).toBe('');
		});

		test('should handle version 0.0.0', () =>
		{
			const result = stringifyRange([
				{ major: '0', minor: '0', patch: '0' },
			]);
			expect(result).toBe('0.0.0');
		});

		test('should handle large version numbers', () =>
		{
			const result = stringifyRange([
				{ major: '100', minor: '200', patch: '300' },
			]);
			expect(result).toBe('100.200.300');
		});
	});

	describe('錯誤處理 / Error handling', () =>
	{
		test('should throw for invalid object', () =>
		{
			expect(() =>
			{
				stringifyRange([{ invalid: 'object' } as any]);
			}).toThrow();
		});

		test('should throw for object without major or operator', () =>
		{
			expect(() =>
			{
				stringifyRange([{ version: '1.0.0' } as any]);
			}).toThrow();
		});
	});
});

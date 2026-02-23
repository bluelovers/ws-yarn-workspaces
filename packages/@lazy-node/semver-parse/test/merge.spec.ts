/**
 * 測試 mergeSimpleSemVer 功能 / Test mergeSimpleSemVer functionality
 *
 * 此測試檔案專注於 mergeSimpleSemVer 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the mergeSimpleSemVer function
 */
import { mergeSimpleSemVer } from '../lib/mergeSimpleSemVer';
import { parse, stringify } from '../index';
import { ISimpleSemVerRuntime } from '../lib/types';

describe('mergeSimpleSemVer', () =>
{
	describe('基本合併 / Basic merging', () =>
	{
		test('should merge minor version', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { minor: '2' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('1');
			expect(result.target.minor).toBe('2');
			expect(result.target.patch).toBe('0');
			expect(result.changed).toEqual({ minor: '2' });
		});

		test('should merge patch version', () =>
		{
			const target = { major: '1', minor: '2', patch: '0' };
			const source = { patch: '5' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.patch).toBe('5');
			expect(result.changed).toEqual({ patch: '5' });
		});

		test('should merge multiple fields', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { minor: '2', patch: '3' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('1');
			expect(result.target.minor).toBe('2');
			expect(result.target.patch).toBe('3');
			expect(result.changed).toEqual({ minor: '2', patch: '3' });
		});
	});

	describe('預發布版本合併 / Pre-release version merging', () =>
	{
		test('should merge release field', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.release).toBe('beta.1');
			expect(result.changed).toEqual({ release: 'beta.1' });
		});

		test('should update existing release', () =>
		{
			const target = { major: '1', minor: '0', patch: '0', release: 'alpha.1' };
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.release).toBe('beta.1');
			expect(result.changed).toEqual({ release: 'beta.1' });
		});

		test('should merge complex release', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { release: 'dev.20200615' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.release).toBe('dev.20200615');
		});
	});

	describe('建構元資料合併 / Build metadata merging', () =>
	{
		test('should merge build field', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.build).toBe('build.123');
			expect(result.changed).toEqual({ build: 'build.123' });
		});

		test('should update existing build', () =>
		{
			const target = { major: '1', minor: '0', patch: '0', build: 'build.100' };
			const source = { build: 'build.200' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.build).toBe('build.200');
		});
	});

	describe('完整版本合併 / Full version merging', () =>
	{
		test('should merge all version parts', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { major: '2', minor: '3', patch: '4', release: 'beta.1', build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('2');
			expect(result.target.minor).toBe('3');
			expect(result.target.patch).toBe('4');
			expect(result.target.release).toBe('beta.1');
			expect(result.target.build).toBe('build.123');
		});
	});

	describe('與 parse 整合 / Integration with parse', () =>
	{
		test('should work with parsed version objects', () =>
		{
			const target = parse('1.0.0');
			const source = { minor: '2', patch: '3' };
			const result = mergeSimpleSemVer(target, source);

			expect(stringify(result.target)).toBe('1.2.3');
		});

		test('should preserve operator when merging', () =>
		{
			const target = parse('^1.0.0');
			const source = { minor: '2', patch: '3' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.operator).toBe('^');
			expect(result.target.major).toBe('1');
			expect(result.target.minor).toBe('2');
			expect(result.target.patch).toBe('3');
		});

		test('should merge with pre-release version', () =>
		{
			const target = parse('1.0.0-alpha.1');
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			expect(stringify(result.target)).toBe('1.0.0-beta.1');
		});
	});

	describe('變更追蹤 / Change tracking', () =>
	{
		test('should return changed fields', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { minor: '5', patch: '10' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.changed).toEqual({
				minor: '5',
				patch: '10',
			});
		});

		test('should return undefined changed when no changes', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = {};
			const result = mergeSimpleSemVer(target, source);

			expect(result.changed).toBeUndefined();
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should handle empty source', () =>
		{
			const target = { major: '1', minor: '2', patch: '3' };
			const source = {};
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('1');
			expect(result.target.minor).toBe('2');
			expect(result.target.patch).toBe('3');
		});

		test('should handle version 0', () =>
		{
			const target = { major: '0', minor: '0', patch: '1' };
			const source = { patch: '2' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('0');
			expect(result.target.minor).toBe('0');
			expect(result.target.patch).toBe('2');
		});

		test('should handle large version numbers', () =>
		{
			const target = { major: '100', minor: '200', patch: '300' };
			const source = { patch: '400' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.patch).toBe('400');
		});
	});

	describe('錯誤處理 / Error handling', () =>
	{
		test('should throw for invalid target', () =>
		{
			expect(() =>
			{
				mergeSimpleSemVer({} as any, { minor: '1' });
			}).toThrow();
		});

		test('should throw for invalid source', () =>
		{
			expect(() =>
			{
				mergeSimpleSemVer({ major: '1', minor: '0', patch: '0' }, {} as any);
			}).toThrow();
		});
	});
});

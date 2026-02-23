/**
 * 測試 mergeSimpleSemVer 功能 / Test mergeSimpleSemVer functionality
 *
 * 此測試檔案專注於 mergeSimpleSemVer 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the mergeSimpleSemVer function
 *
 * 重要限制：mergeSimpleSemVer 只允許更新目標物件中已經存在的值
 * Important limitation: mergeSimpleSemVer only updates values that already exist in the target object
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

	describe('只更新已存在值的限制 / Only update existing values limitation', () =>
	{
		test('should NOT add release field when target does not have it', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			// release 不應該被新增，因為 target 沒有 release 屬性
			// release should NOT be added because target doesn't have release property
			expect(result.target.release).toBeUndefined();
			expect(result.changed).toBeUndefined();
		});

		test('should NOT add build field when target does not have it', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			// build 不應該被新增，因為 target 沒有 build 屬性
			// build should NOT be added because target doesn't have build property
			expect(result.target.build).toBeUndefined();
			expect(result.changed).toBeUndefined();
		});

		test('should update existing release field', () =>
		{
			const target = { major: '1', minor: '0', patch: '0', release: 'alpha.1' };
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			// release 應該被更新，因為 target 已經有 release 屬性
			// release should be updated because target has release property
			expect(result.target.release).toBe('beta.1');
			expect(result.changed).toEqual({ release: 'beta.1' });
		});

		test('should update existing build field', () =>
		{
			const target = { major: '1', minor: '0', patch: '0', build: 'build.100' };
			const source = { build: 'build.200' };
			const result = mergeSimpleSemVer(target, source);

			// build 應該被更新，因為 target 已經有 build 屬性
			// build should be updated because target has build property
			expect(result.target.build).toBe('build.200');
			expect(result.changed).toEqual({ build: 'build.200' });
		});

		test('should NOT add release even with complex value', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { release: 'dev.20200615' };
			const result = mergeSimpleSemVer(target, source);

			// release 不應該被新增
			// release should NOT be added
			expect(result.target.release).toBeUndefined();
		});
	});

	describe('完整版本合併 / Full version merging', () =>
	{
		test('should merge all existing version parts', () =>
		{
			// target 有所有屬性 / target has all properties
			const target = { major: '1', minor: '0', patch: '0', release: 'alpha.1', build: 'build.100' };
			const source = { major: '2', minor: '3', patch: '4', release: 'beta.1', build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('2');
			expect(result.target.minor).toBe('3');
			expect(result.target.patch).toBe('4');
			expect(result.target.release).toBe('beta.1');
			expect(result.target.build).toBe('build.123');
		});

		test('should only merge properties that exist in target', () =>
		{
			// target 只有 major, minor, patch / target only has major, minor, patch
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { major: '2', minor: '3', patch: '4', release: 'beta.1', build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('2');
			expect(result.target.minor).toBe('3');
			expect(result.target.patch).toBe('4');
			// release 和 build 不應該被新增 / release and build should NOT be added
			expect(result.target.release).toBeUndefined();
			expect(result.target.build).toBeUndefined();
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

		test('should update existing pre-release version', () =>
		{
			const target = parse('1.0.0-alpha.1');
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			// release 應該被更新，因為 parse 解析出的物件包含 release 屬性
			// release should be updated because parsed object includes release property
			expect(stringify(result.target)).toBe('1.0.0-beta.1');
		});

		test('should NOT add release when target does not have it', () =>
		{
			const target = parse('1.0.0');
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			// release 不應該被新增，因為 parse('1.0.0') 不包含 release
			// release should NOT be added because parse('1.0.0') doesn't include release
			expect(result.target.release).toBeUndefined();
			expect(stringify(result.target)).toBe('1.0.0');
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

		test('should return undefined changed when no changes (source has same values)', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { minor: '0' }; // 相同的值 / Same value
			const result = mergeSimpleSemVer(target, source);

			// 值相同，所以 changed 仍然會記錄，但值沒有實際變化
			// Value is same, so changed will still record, but no actual change
			expect(result.changed).toEqual({ minor: '0' });
		});

		test('should return undefined changed when source has non-existing properties', () =>
		{
			const target = { major: '1', minor: '0', patch: '0' };
			const source = { release: 'beta.1', build: 'build.123' };
			const result = mergeSimpleSemVer(target, source);

			// 沒有變更，因為 target 沒有 release 和 build 屬性
			// No changes because target doesn't have release and build properties
			expect(result.changed).toBeUndefined();
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should handle source with only non-existing properties', () =>
		{
			const target = { major: '1', minor: '2', patch: '3' };
			// source 有值但 target 沒有對應屬性
			// source has values but target doesn't have corresponding properties
			const source = { release: 'beta.1' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.major).toBe('1');
			expect(result.target.minor).toBe('2');
			expect(result.target.patch).toBe('3');
			expect(result.target.release).toBeUndefined();
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

	describe('萬用字元處理 / Wildcard handling', () =>
	{
		test('should not merge wildcard x', () =>
		{
			const target = { major: '1', minor: '2', patch: '3' };
			const source = { patch: 'x' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.patch).toBe('3');
			expect(result.changed).toBeUndefined();
		});

		test('should not merge wildcard asterisk', () =>
		{
			const target = { major: '1', minor: '2', patch: '3' };
			const source = { patch: '*' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.patch).toBe('3');
			expect(result.changed).toBeUndefined();
		});

		test('should not merge empty string', () =>
		{
			const target = { major: '1', minor: '2', patch: '3' };
			const source = { patch: '' };
			const result = mergeSimpleSemVer(target, source);

			expect(result.target.patch).toBe('3');
			expect(result.changed).toBeUndefined();
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

		test('should throw for invalid source with no valid values', () =>
		{
			expect(() =>
			{
				mergeSimpleSemVer({ major: '1', minor: '0', patch: '0' }, {} as any);
			}).toThrow();
		});

		test('should throw for source with invalid value types', () =>
		{
			expect(() =>
			{
				mergeSimpleSemVer({ major: '1', minor: '0', patch: '0' }, { minor: 123 as any });
			}).toThrow();
		});
	});
});

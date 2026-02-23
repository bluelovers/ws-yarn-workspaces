/**
 * 測試 replaceSimpleSemVerVersion 功能 / Test replaceSimpleSemVerVersion functionality
 * 
 * 此測試檔案專注於 replaceSimpleSemVerVersion 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the replaceSimpleSemVerVersion function
 */
import { replaceSimpleSemVerVersion } from '../lib/replaceSimpleSemVerVersion';
import { parse, stringify, stringifyFull } from '../index';

describe('replaceSimpleSemVerVersion', () =>
{
	describe('從字串取代 / Replace from string', () =>
	{
		test('should replace version from string input', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0', '2.3.4');
			
			expect(result.major).toBe('2');
			expect(result.minor).toBe('3');
			expect(result.patch).toBe('4');
			expect(result.operator).toBe('>=');
		});

		test('should replace version preserving caret operator', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '2.0.0');
			
			expect(result.operator).toBe('^');
			expect(result.major).toBe('2');
		});

		test('should replace version preserving tilde operator', () =>
		{
			const result = replaceSimpleSemVerVersion('~1.2.3', '3.4.5');
			
			expect(result.operator).toBe('~');
			expect(result.major).toBe('3');
			expect(result.minor).toBe('4');
			expect(result.patch).toBe('5');
		});

		test('should replace version without operator', () =>
		{
			const result = replaceSimpleSemVerVersion('1.0.0', '2.0.0');
			
			expect(result.major).toBe('2');
			expect(result.minor).toBe('0');
			expect(result.patch).toBe('0');
		});
	});

	describe('從物件取代 / Replace from object', () =>
	{
		test('should replace version from parsed object', () =>
		{
			const parsed = parse('>=1.0.0');
			const result = replaceSimpleSemVerVersion(parsed, '2.3.4');
			
			expect(result.major).toBe('2');
			expect(result.minor).toBe('3');
			expect(result.patch).toBe('4');
			expect(result.operator).toBe('>=');
		});

		test('should replace version from object with caret', () =>
		{
			const parsed = parse('^1.2.3');
			const result = replaceSimpleSemVerVersion(parsed, '4.5.6');
			
			expect(result.operator).toBe('^');
			expect(result.major).toBe('4');
		});
	});

	describe('預發布版本取代 / Pre-release version replacement', () =>
	{
		test('should replace with pre-release version', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '2.0.0-beta.1');
			
			expect(result.major).toBe('2');
			expect(result.minor).toBe('0');
			expect(result.patch).toBe('0');
			expect(result.release).toBe('beta.1');
			expect(result.operator).toBe('^');
		});

		test('should replace pre-release with stable version', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0-alpha.1', '2.0.0');
			
			expect(result.major).toBe('2');
			expect(result.release).toBeUndefined();
		});
	});

	describe('建構元資料取代 / Build metadata replacement', () =>
	{
		test('should replace with build metadata', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '2.0.0+build.123');
			
			expect(result.major).toBe('2');
			expect(result.build).toBe('build.123');
			expect(result.operator).toBe('^');
		});

		test('should replace build with new version', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0+build.100', '2.0.0+build.200');
			
			expect(result.major).toBe('2');
			expect(result.build).toBe('build.200');
		});
	});

	describe('完整版本取代 / Full version replacement', () =>
	{
		test('should replace with full semver', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '2.3.4-beta.1+build.123');
			
			expect(result.major).toBe('2');
			expect(result.minor).toBe('3');
			expect(result.patch).toBe('4');
			expect(result.release).toBe('beta.1');
			expect(result.build).toBe('build.123');
			expect(result.operator).toBe('^');
		});
	});

	describe('與 stringify 函數整合 / Integration with stringify functions', () =>
	{
		test('should produce correct string with stringifyFull', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0', '2.3.4');
			expect(stringifyFull(result)).toBe('>=2.3.4');
		});

		test('should produce correct string with pre-release', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '2.0.0-beta.1');
			expect(stringifyFull(result)).toBe('^2.0.0-beta.1');
		});

		test('should produce correct string with build', () =>
		{
			const result = replaceSimpleSemVerVersion('~1.0.0', '2.0.0+build.123');
			expect(stringifyFull(result)).toBe('~2.0.0+build.123');
		});

		test('should produce correct string with full version', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0', '2.3.4-beta.1+build.123');
			expect(stringifyFull(result)).toBe('>=2.3.4-beta.1+build.123');
		});
	});

	describe('運算子保留 / Operator preservation', () =>
	{
		test('should preserve >= operator', () =>
		{
			const result = replaceSimpleSemVerVersion('>=1.0.0', '2.0.0');
			expect(result.operator).toBe('>=');
		});

		test('should preserve <= operator', () =>
		{
			const result = replaceSimpleSemVerVersion('<=1.0.0', '2.0.0');
			expect(result.operator).toBe('<=');
		});

		test('should preserve > operator', () =>
		{
			const result = replaceSimpleSemVerVersion('>1.0.0', '2.0.0');
			expect(result.operator).toBe('>');
		});

		test('should preserve < operator', () =>
		{
			const result = replaceSimpleSemVerVersion('<1.0.0', '2.0.0');
			expect(result.operator).toBe('<');
		});

		test('should preserve = operator', () =>
		{
			const result = replaceSimpleSemVerVersion('=1.0.0', '2.0.0');
			expect(result.operator).toBe('=');
		});

		test('should preserve ~> operator', () =>
		{
			const result = replaceSimpleSemVerVersion('~>1.0.0', '2.0.0');
			expect(result.operator).toBe('~>');
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should handle version 0.0.0', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '0.0.0');
			
			expect(result.major).toBe('0');
			expect(result.minor).toBe('0');
			expect(result.patch).toBe('0');
		});

		test('should handle large version numbers', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', '100.200.300');
			
			expect(result.major).toBe('100');
			expect(result.minor).toBe('200');
			expect(result.patch).toBe('300');
		});

		test('should handle v prefix in new version', () =>
		{
			const result = replaceSimpleSemVerVersion('^1.0.0', 'v2.0.0');
			
			expect(result.major).toBe('2');
		});
	});

	describe('實際使用案例 / Real-world use cases', () =>
	{
		test('should update dependency version', () =>
		{
			// 模擬更新套件版本 / Simulating package version update
			const oldDep = '^16.8.0';
			const newVersion = '18.2.0';
			const result = replaceSimpleSemVerVersion(oldDep, newVersion);
			
			expect(stringifyFull(result)).toBe('^18.2.0');
		});

		test('should update single version constraint', () =>
		{
			// 模擬更新單一版本約束 / Simulating single version constraint update
			const oldConstraint = '>=16.0.0';
			const newVersion = '17.0.0';
			const result = replaceSimpleSemVerVersion(oldConstraint, newVersion);
			
			expect(result.operator).toBe('>=');
			expect(result.major).toBe('17');
		});
	});

	describe('輸入限制 / Input limitations', () =>
	{
		test('should only accept single version input (NOT multi-version range)', () =>
		{
			// replaceSimpleSemVerVersion 只接受單一版本輸入
			// replaceSimpleSemVerVersion only accepts single version input
			// 多版本範圍字串如 ">=1.0.0 <2.0.0" 不是有效的輸入
			// Multi-version range strings like ">=1.0.0 <2.0.0" are NOT valid inputs
			// 若需處理多版本範圍，請使用 parseRange
			// Use parseRange for multi-version ranges
			
			// 單一版本輸入才是正確用法 / Single version input is the correct usage
			const validInput = '^1.0.0';
			const result = replaceSimpleSemVerVersion(validInput, '2.0.0');
			
			expect(result.operator).toBe('^');
			expect(result.major).toBe('2');
		});

		test('should accept version with operator', () =>
		{
			// 接受帶運算子的單一版本 / Accepts single version with operator
			const result = replaceSimpleSemVerVersion('>=1.0.0', '2.0.0');
			expect(result.operator).toBe('>=');
		});

		test('should accept version without operator', () =>
		{
			// 接受不帶運算子的單一版本 / Accepts single version without operator
			const result = replaceSimpleSemVerVersion('1.0.0', '2.0.0');
			expect(result.major).toBe('2');
		});

		test('should accept version with pre-release', () =>
		{
			// 接受預發布版本 / Accepts pre-release version
			const result = replaceSimpleSemVerVersion('1.0.0-alpha.1', '2.0.0');
			expect(result.major).toBe('2');
		});

		test('should accept version with build metadata', () =>
		{
			// 接受帶建構元資料的版本 / Accepts version with build metadata
			const result = replaceSimpleSemVerVersion('1.0.0+build.123', '2.0.0');
			expect(result.major).toBe('2');
		});
	});
});

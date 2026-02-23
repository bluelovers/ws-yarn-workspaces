/**
 * 測試 parse 功能 / Test parse functionality
 * 
 * 此測試檔案專注於 parse 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the parse function
 */
import { parse } from '../index';
import { stringify, stringifyFull } from '../index';

describe('parse', () =>
{
	describe('基本版本解析 / Basic version parsing', () =>
	{
		test('should parse a simple 3-part version', () =>
		{
			const result = parse('1.0.0');
			expect(result).toMatchSnapshot({
				major: '1',
				minor: '0',
				patch: '0',
			});
		});

		test('should parse version with different numbers', () =>
		{
			const result = parse('2.3.4');
			expect(result).toMatchSnapshot({
				major: '2',
				minor: '3',
				patch: '4',
			});
		});

		test('should parse version with v prefix', () =>
		{
			const result = parse('v1.2.3');
			expect(result).toMatchSnapshot({
				major: '1',
				minor: '2',
				patch: '3',
			});
		});

		test('should parse version with large numbers', () =>
		{
			const result = parse('100.200.300');
			expect(result).toMatchSnapshot({
				major: '100',
				minor: '200',
				patch: '300',
			});
		});
	});

	describe('運算子解析 / Operator parsing', () =>
	{
		test('should parse >= operator', () =>
		{
			const result = parse('>=1.0.0');
			expect(result).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});

		test('should parse <= operator', () =>
		{
			const result = parse('<=2.0.0');
			expect(result).toMatchSnapshot({
				operator: '<=',
				major: '2',
			});
		});

		test('should parse > operator', () =>
		{
			const result = parse('>1.5.0');
			expect(result).toMatchSnapshot({
				operator: '>',
				major: '1',
			});
		});

		test('should parse < operator', () =>
		{
			const result = parse('<3.0.0');
			expect(result).toMatchSnapshot({
				operator: '<',
				major: '3',
			});
		});

		test('should parse = operator', () =>
		{
			const result = parse('=1.0.0');
			expect(result).toMatchSnapshot({
				operator: '=',
				major: '1',
			});
		});

		test('should parse ^ (caret) operator', () =>
		{
			const result = parse('^1.2.3');
			expect(result).toMatchSnapshot({
				operator: '^',
				major: '1',
			});
		});

		test('should parse ~ (tilde) operator', () =>
		{
			const result = parse('~1.2.3');
			expect(result).toMatchSnapshot({
				operator: '~',
				major: '1',
			});
		});

		test('should parse ~> operator', () =>
		{
			const result = parse('~>1.2.3');
			expect(result).toMatchSnapshot({
				operator: '~>',
				major: '1',
			});
		});

		test('should parse operator with space', () =>
		{
			const result = parse('>= 1.0.0');
			expect(result).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});

		test('should parse operator with v prefix', () =>
		{
			const result = parse('>=v1.0.0');
			expect(result).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});
	});

	describe('預發布版本解析 / Pre-release version parsing', () =>
	{
		test('should parse alpha pre-release', () =>
		{
			const result = parse('1.0.0-alpha');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'alpha',
			});
		});

		test('should parse beta pre-release', () =>
		{
			const result = parse('1.0.0-beta');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'beta',
			});
		});

		test('should parse rc pre-release', () =>
		{
			const result = parse('1.0.0-rc.1');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'rc.1',
			});
		});

		test('should parse pre-release with numbers', () =>
		{
			const result = parse('1.0.0-alpha.1');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'alpha.1',
			});
		});

		test('should parse pre-release with hyphens', () =>
		{
			const result = parse('1.0.0-beta-2');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'beta-2',
			});
		});

		test('should parse complex pre-release', () =>
		{
			const result = parse('4.0.0-dev.20200615');
			expect(result).toMatchSnapshot({
				major: '4',
				release: 'dev.20200615',
			});
		});

		test('should parse pre-release with dots', () =>
		{
			const result = parse('1.0.0-alpha.beta.1');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'alpha.beta.1',
			});
		});
	});

	describe('建構元資料解析 / Build metadata parsing', () =>
	{
		test('should parse build metadata', () =>
		{
			const result = parse('1.0.0+build.123');
			expect(result).toMatchSnapshot({
				major: '1',
				build: 'build.123',
			});
		});

		test('should parse build with numbers', () =>
		{
			const result = parse('1.0.0+20130313144700');
			expect(result).toMatchSnapshot({
				major: '1',
				build: '20130313144700',
			});
		});

		test('should parse build with dots', () =>
		{
			const result = parse('1.0.0+build.1.2.3');
			expect(result).toMatchSnapshot({
				major: '1',
				build: 'build.1.2.3',
			});
		});

		test('should parse build with hyphens', () =>
		{
			const result = parse('1.0.6+build-623');
			expect(result).toMatchSnapshot({
				major: '1',
				build: 'build-623',
			});
		});
	});

	describe('預發布與建構元資料組合 / Pre-release and build combination', () =>
	{
		test('should parse pre-release and build together', () =>
		{
			const result = parse('1.0.0-alpha+build.123');
			expect(result).toMatchSnapshot({
				major: '1',
				release: 'alpha',
				build: 'build.123',
			});
		});

		test('should parse complex pre-release with build', () =>
		{
			const result = parse('1.2.3-beta.1+build.456');
			expect(result).toMatchSnapshot({
				major: '1',
				minor: '2',
				patch: '3',
				release: 'beta.1',
				build: 'build.456',
			});
		});

		test('should parse with operator, pre-release and build', () =>
		{
			const result = parse('>=1.2.3-beta.1+build.123');
			expect(result).toMatchSnapshot({
				operator: '>=',
				major: '1',
				release: 'beta.1',
				build: 'build.123',
			});
		});
	});

	describe('無效版本處理 / Invalid version handling', () =>
	{
		test('should return undefined for invalid versions', () =>
		{
			expect(parse('a.b.c')).toBeUndefined();
			expect(parse('1')).toBeUndefined();
			expect(parse('1.0')).toBeUndefined();
			expect(parse('1.0.0b')).toBeUndefined();
			expect(parse('1.0.0+build-abc.')).toBeUndefined();
		});

		test('should return undefined for empty string', () =>
		{
			expect(parse('')).toBeUndefined();
		});

		test('should return undefined for only operator', () =>
		{
			expect(parse('>=')).toBeUndefined();
			expect(parse('^')).toBeUndefined();
		});

		test('should return undefined for random strings', () =>
		{
			expect(parse('not-a-version')).toBeUndefined();
			expect(parse('version 1.0.0')).toBeUndefined();
		});

		test('should NOT parse multi-range versions (use parseRange instead)', () =>
		{
			// parseSimpleSemVer 只解析單一版本，不支援多範圍
			// parseSimpleSemVer only parses single version, does not support multi-range
			// 多範圍應該使用 parseRange / Multi-range should use parseRange
			
			// 這些多範圍輸入不應該被 parse 成功解析
			// These multi-range inputs should not be successfully parsed by parse
			expect(parse('>=1.0.0 <2.0.0')).toBeUndefined();
			expect(parse('~1.0.0 || ~2.0.0')).toBeUndefined();
			expect(parse('1.0.0 - 2.0.0')).toBeUndefined();
			expect(parse('^1.0.0 || >=2.0.0')).toBeUndefined();
		});
	});

	describe('與 stringify 函數整合 / Integration with stringify functions', () =>
	{
		test('should be reversible with stringify', () =>
		{
			const version = '1.2.3';
			const result = parse(version);
			expect(stringify(result)).toBe(version);
		});

		test('should be reversible with stringifyFull for versions with operator', () =>
		{
			const version = '>=1.2.3';
			const result = parse(version);
			expect(stringifyFull(result)).toBe(version);
		});

		test('should be reversible with pre-release', () =>
		{
			const version = '1.2.3-alpha.1';
			const result = parse(version);
			expect(stringify(result)).toBe(version);
		});

		test('should be reversible with build metadata', () =>
		{
			const version = '1.2.3+build.123';
			const result = parse(version);
			expect(stringify(result)).toBe(version);
		});

		test('should be reversible with pre-release and build', () =>
		{
			const version = '1.2.3-beta.1+build.456';
			const result = parse(version);
			expect(stringify(result)).toBe(version);
		});

		test('should be reversible with caret operator', () =>
		{
			const version = '^4.0.0-dev.20200615';
			const result = parse(version);
			expect(stringifyFull(result)).toBe(version);
		});
	});
});

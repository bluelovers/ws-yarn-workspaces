/**
 * 測試 parseRange 功能 / Test parseRange functionality
 * 
 * 此測試檔案專注於 parseRange 函數的完整測試覆蓋
 * This test file focuses on complete test coverage for the parseRange function
 */
import { parseRange, stringifyRange } from '../index';

describe('parseRange', () =>
{
	describe('單一版本解析 / Single version parsing', () =>
	{
		test('should parse exact version', () =>
		{
			const result = parseRange('1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				minor: '0',
				patch: '0',
			});
		});

		test('should parse version with v prefix', () =>
		{
			const result = parseRange('v1.2.3');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				minor: '2',
				patch: '3',
			});
		});
	});

	describe('運算子解析 / Operator parsing', () =>
	{
		test('should parse >= operator', () =>
		{
			const result = parseRange('>=1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});

		test('should parse <= operator', () =>
		{
			const result = parseRange('<=2.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '<=',
				major: '2',
			});
		});

		test('should parse > operator', () =>
		{
			const result = parseRange('>1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '>',
				major: '1',
			});
		});

		test('should parse < operator', () =>
		{
			const result = parseRange('<2.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '<',
				major: '2',
			});
		});

		test('should parse = operator', () =>
		{
			const result = parseRange('=1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '=',
				major: '1',
			});
		});

		test('should parse ^ (caret) operator', () =>
		{
			const result = parseRange('^1.2.3');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '^',
				major: '1',
			});
		});

		test('should parse ~ (tilde) operator', () =>
		{
			const result = parseRange('~1.2.3');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '~',
				major: '1',
			});
		});

		test('should parse ~> operator', () =>
		{
			const result = parseRange('~>1.2.3');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '~>',
				major: '1',
			});
		});

		test('should parse operator with space', () =>
		{
			const result = parseRange('>= 1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});

		test('should parse operator with v prefix', () =>
		{
			const result = parseRange('>= v1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
		});

		test('should parse tilde with v prefix', () =>
		{
			const result = parseRange('~v1.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				operator: '~',
				major: '1',
			});
		});
	});

	describe('預發布版本與建構元資料 / Pre-release and build metadata', () =>
	{
		test('should parse pre-release version', () =>
		{
			const result = parseRange('1.0.0-rc1');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				release: 'rc1',
			});
		});

		test('should parse pre-release with hyphens', () =>
		{
			const result = parseRange('1.0.0-rc-2');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				release: 'rc-2',
			});
		});

		test('should parse build metadata', () =>
		{
			const result = parseRange('2.0.0+build.1848');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '2',
				build: 'build.1848',
			});
		});

		test('should parse pre-release and build together', () =>
		{
			const result = parseRange('1.0.0-alpha+build.123');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				release: 'alpha',
				build: 'build.123',
			});
		});
	});

	describe('範圍組合 / Range combinations', () =>
	{
		test('should parse AND range (space separated)', () =>
		{
			const result = parseRange('>=1.0.0 <2.0.0');
			expect(result).toHaveLength(2);
			expect(result[0]).toMatchSnapshot({
				operator: '>=',
				major: '1',
			});
			expect(result[1]).toMatchSnapshot({
				operator: '<',
				major: '2',
			});
		});

		test('should parse OR range (|| separated)', () =>
		{
			const result = parseRange('~1.0.0 || ~2.0.0');
			expect(result).toHaveLength(3);
			expect(result[0]).toMatchSnapshot({
				operator: '~',
				major: '1',
			});
			expect(result[1]).toMatchSnapshot({
				operator: '||',
			});
			expect(result[2]).toMatchSnapshot({
				operator: '~',
				major: '2',
			});
		});

		test('should parse hyphen range', () =>
		{
			const result = parseRange('1.0.0 - 2.0.0');
			expect(result).toHaveLength(3);
			expect(result[0]).toMatchSnapshot({
				major: '1',
			});
			expect(result[1]).toMatchSnapshot({
				operator: '-',
			});
			expect(result[2]).toMatchSnapshot({
				major: '2',
			});
		});

		test('should parse complex range', () =>
		{
			const result = parseRange('>= 1.1.7 < 2.0.0 || 1.1.3');
			expect(result).toHaveLength(4);
			expect(result).toMatchSnapshot();
		});

		test('should parse caret range with OR', () =>
		{
			const result = parseRange('^1.2.0 || >=2.0.0 <3.0.0');
			expect(result).toMatchSnapshot();
		});
	});

	describe('萬用字元與 x 範圍 / Wildcard and x ranges', () =>
	{
		test('should parse * wildcard', () =>
		{
			const result = parseRange('*');
			expect(result).toMatchSnapshot();
		});

		test('should parse x range (major.x)', () =>
		{
			const result = parseRange('1.x');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				minor: 'x',
			});
		});

		test('should parse * range (major.*)', () =>
		{
			const result = parseRange('1.*');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '1',
				minor: '*',
			});
		});

		test('should parse x.x range', () =>
		{
			const result = parseRange('1.2.x');
			expect(result).toMatchSnapshot();
		});

		test('should parse *.* range', () =>
		{
			const result = parseRange('1.2.*');
			expect(result).toMatchSnapshot();
		});
	});

	describe('邊界案例 / Edge cases', () =>
	{
		test('should parse 0.x version', () =>
		{
			const result = parseRange('0.0.1');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '0',
				minor: '0',
				patch: '1',
			});
		});

		test('should parse version 0.0.0', () =>
		{
			const result = parseRange('0.0.0');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchSnapshot({
				major: '0',
				minor: '0',
				patch: '0',
			});
		});

		test('should handle extra whitespace', () =>
		{
			const result = parseRange('  >=  1.0.0  <  2.0.0  ');
			expect(result).toMatchSnapshot();
		});
	});

	describe('與 stringifyRange 整合 / Integration with stringifyRange', () =>
	{
		test('should be reversible with simple range', () =>
		{
			const range = '>=1.0.0 <2.0.0';
			const result = parseRange(range);
			expect(stringifyRange(result)).toBe('>=1.0.0 <2.0.0');
		});

		test('should be reversible with OR range', () =>
		{
			const range = '~1.0.0 || ~2.0.0';
			const result = parseRange(range);
			expect(stringifyRange(result)).toBe('~1.0.0 || ~2.0.0');
		});

		test('should be reversible with hyphen range', () =>
		{
			const range = '1.0.0 - 2.0.0';
			const result = parseRange(range);
			expect(stringifyRange(result)).toBe('1.0.0 - 2.0.0');
		});

		test('should be reversible with caret range', () =>
		{
			const range = '^1.2.3';
			const result = parseRange(range);
			expect(stringifyRange(result)).toBe('^1.2.3');
		});

		test('should be reversible with complex range', () =>
		{
			const range = '>= 1.1.7 < 2.0.0 || 1.1.3';
			const result = parseRange(range);
			// Note: stringifyRange normalizes spacing
			expect(stringifyRange(result)).toMatchSnapshot();
		});
	});

	describe('實際套件版本範例 / Real package version examples', () =>
	{
		test('should parse typical npm dependency range', () =>
		{
			const result = parseRange('^16.8.0');
			expect(result).toMatchSnapshot();
		});

		test('should parse peer dependency range', () =>
		{
			const result = parseRange('>=16.0.0 <18.0.0');
			expect(result).toMatchSnapshot();
		});

		test('should parse dev dependency range', () =>
		{
			const result = parseRange('~4.4.0 || ~5.0.0');
			expect(result).toMatchSnapshot();
		});

		test('should parse exact version with build', () =>
		{
			const result = parseRange('1.0.0+build.1848');
			expect(result).toMatchSnapshot();
		});
	});
});

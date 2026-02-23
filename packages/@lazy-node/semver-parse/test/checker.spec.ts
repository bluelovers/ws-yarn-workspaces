/**
 * 測試 checker 功能 / Test checker functionality
 * 
 * 此測試檔案專注於 checker 模組的完整測試覆蓋
 * This test file focuses on complete test coverage for the checker module
 */
import {
	isSimpleSemVerObjectLike,
	assertSimpleSemVerObjectLike,
	isSimpleSemVerOperatorLike,
	assertSimpleSemVerOperatorLike,
	isSimpleSemVerObjectWithOperatorLike,
	assertSimpleSemVerObjectWithOperatorLike,
	hasOperator,
	assertHasOperator,
	isSimpleSemVerObjectOrOperatorLike,
	assertSimpleSemVerObjectOrOperatorLike,
} from '../lib/checker';
import { parse, parseRange } from '../index';

describe('checker', () =>
{
	describe('isSimpleSemVerObjectLike', () =>
	{
		test('should return true for valid semver object', () =>
		{
			const parsed = parse('1.0.0');
			expect(isSimpleSemVerObjectLike(parsed)).toBe(true);
		});

		test('should return true for object with major', () =>
		{
			expect(isSimpleSemVerObjectLike({ major: '1' })).toBe(true);
		});

		test('should return true for object with major, minor, patch', () =>
		{
			expect(isSimpleSemVerObjectLike({ major: '1', minor: '0', patch: '0' })).toBe(true);
		});

		test('should return false for object without major', () =>
		{
			expect(isSimpleSemVerObjectLike({})).toBe(false);
		});

		test('should return false for object with empty major', () =>
		{
			expect(isSimpleSemVerObjectLike({ major: '' })).toBe(false);
		});

		test('should return false for operator-only object', () =>
		{
			expect(isSimpleSemVerObjectLike({ operator: '||' })).toBe(false);
		});
	});

	describe('assertSimpleSemVerObjectLike', () =>
	{
		test('should not throw for valid semver object', () =>
		{
			const parsed = parse('1.0.0');
			expect(() => assertSimpleSemVerObjectLike(parsed)).not.toThrow();
		});

		test('should throw for invalid object', () =>
		{
			expect(() => assertSimpleSemVerObjectLike({})).toThrow('obj not a SimpleSemVerObject');
		});

		test('should not throw when notThrow is true', () =>
		{
			expect(() => assertSimpleSemVerObjectLike({}, true)).not.toThrow();
		});
	});

	describe('hasOperator', () =>
	{
		test('should return true for object with operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(hasOperator(parsed)).toBe(true);
		});

		test('should return true for || operator', () =>
		{
			expect(hasOperator({ operator: '||' })).toBe(true);
		});

		test('should return false for object without operator', () =>
		{
			const parsed = parse('1.0.0');
			expect(hasOperator(parsed)).toBe(false);
		});

		test('should return false for object with empty operator', () =>
		{
			expect(hasOperator({ operator: '' })).toBe(false);
		});

		test('should return false for empty object', () =>
		{
			expect(hasOperator({})).toBe(false);
		});
	});

	describe('assertHasOperator', () =>
	{
		test('should not throw for object with operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(() => assertHasOperator(parsed)).not.toThrow();
		});

		test('should throw for object without operator', () =>
		{
			expect(() => assertHasOperator({})).toThrow('obj not has operator');
		});

		test('should not throw when notThrow is true', () =>
		{
			expect(() => assertHasOperator({}, true)).not.toThrow();
		});
	});

	describe('isSimpleSemVerOperatorLike', () =>
	{
		test('should return true for operator-only object', () =>
		{
			expect(isSimpleSemVerOperatorLike({ operator: '||' })).toBe(true);
		});

		test('should return true for operator object without major', () =>
		{
			expect(isSimpleSemVerOperatorLike({ operator: '-' })).toBe(true);
		});

		test('should return false for semver object with major', () =>
		{
			const parsed = parse('^1.0.0');
			expect(isSimpleSemVerOperatorLike(parsed)).toBe(false);
		});

		test('should return false for object without operator', () =>
		{
			expect(isSimpleSemVerOperatorLike({ major: '1' })).toBe(false);
		});

		test('should return false for empty object', () =>
		{
			expect(isSimpleSemVerOperatorLike({})).toBe(false);
		});
	});

	describe('assertSimpleSemVerOperatorLike', () =>
	{
		test('should not throw for operator-only object', () =>
		{
			expect(() => assertSimpleSemVerOperatorLike({ operator: '||' })).not.toThrow();
		});

		test('should throw for semver object', () =>
		{
			const parsed = parse('1.0.0');
			expect(() => assertSimpleSemVerOperatorLike(parsed)).toThrow();
		});

		test('should not throw when notThrow is true', () =>
		{
			expect(() => assertSimpleSemVerOperatorLike({}, true)).not.toThrow();
		});
	});

	describe('isSimpleSemVerObjectWithOperatorLike', () =>
	{
		test('should return true for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(isSimpleSemVerObjectWithOperatorLike(parsed)).toBe(true);
		});

		test('should return true for >= operator', () =>
		{
			const parsed = parse('>=1.0.0');
			expect(isSimpleSemVerObjectWithOperatorLike(parsed)).toBe(true);
		});

		test('should return false for semver without operator', () =>
		{
			const parsed = parse('1.0.0');
			expect(isSimpleSemVerObjectWithOperatorLike(parsed)).toBe(false);
		});

		test('should return false for operator-only object', () =>
		{
			expect(isSimpleSemVerObjectWithOperatorLike({ operator: '||' })).toBe(false);
		});

		test('should return false for empty object', () =>
		{
			expect(isSimpleSemVerObjectWithOperatorLike({})).toBe(false);
		});
	});

	describe('assertSimpleSemVerObjectWithOperatorLike', () =>
	{
		test('should not throw for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(() => assertSimpleSemVerObjectWithOperatorLike(parsed)).not.toThrow();
		});

		test('should throw for semver without operator', () =>
		{
			const parsed = parse('1.0.0');
			expect(() => assertSimpleSemVerObjectWithOperatorLike(parsed)).toThrow();
		});

		test('should not throw when notThrow is true', () =>
		{
			expect(() => assertSimpleSemVerObjectWithOperatorLike({}, true)).not.toThrow();
		});
	});

	describe('isSimpleSemVerObjectOrOperatorLike', () =>
	{
		test('should return true for semver object', () =>
		{
			const parsed = parse('1.0.0');
			expect(isSimpleSemVerObjectOrOperatorLike(parsed)).toBe(true);
		});

		test('should return true for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(isSimpleSemVerObjectOrOperatorLike(parsed)).toBe(true);
		});

		test('should return true for operator-only object', () =>
		{
			expect(isSimpleSemVerObjectOrOperatorLike({ operator: '||' })).toBe(true);
		});

		test('should return false for empty object', () =>
		{
			expect(isSimpleSemVerObjectOrOperatorLike({})).toBe(false);
		});

		test('should return true for parsed range items', () =>
		{
			const range = parseRange('^1.0.0 || >=2.0.0');
			range.forEach(item =>
			{
				expect(isSimpleSemVerObjectOrOperatorLike(item)).toBe(true);
			});
		});
	});

	describe('assertSimpleSemVerObjectOrOperatorLike', () =>
	{
		test('should not throw for semver object', () =>
		{
			const parsed = parse('1.0.0');
			expect(() => assertSimpleSemVerObjectOrOperatorLike(parsed)).not.toThrow();
		});

		test('should not throw for operator-only object', () =>
		{
			expect(() => assertSimpleSemVerObjectOrOperatorLike({ operator: '||' })).not.toThrow();
		});

		test('should throw for empty object', () =>
		{
			expect(() => assertSimpleSemVerObjectOrOperatorLike({})).toThrow();
		});

		test('should not throw when notThrow is true', () =>
		{
			expect(() => assertSimpleSemVerObjectOrOperatorLike({}, true)).not.toThrow();
		});
	});

	describe('與 parseRange 整合 / Integration with parseRange', () =>
	{
		test('should correctly identify range components', () =>
		{
			const range = parseRange('>=1.0.0 <2.0.0');
			
			expect(isSimpleSemVerObjectWithOperatorLike(range[0])).toBe(true);
			expect(hasOperator(range[0])).toBe(true);
			expect(isSimpleSemVerObjectLike(range[0])).toBe(true);
			
			expect(isSimpleSemVerObjectWithOperatorLike(range[1])).toBe(true);
			expect(hasOperator(range[1])).toBe(true);
		});

		test('should correctly identify OR operator in range', () =>
		{
			const range = parseRange('~1.0.0 || ~2.0.0');
			
			expect(isSimpleSemVerObjectLike(range[0])).toBe(true);
			expect(hasOperator(range[0])).toBe(true);
			
			expect(isSimpleSemVerOperatorLike(range[1])).toBe(true);
			expect(hasOperator(range[1])).toBe(true);
			expect(isSimpleSemVerObjectLike(range[1])).toBe(false);
			
			expect(isSimpleSemVerObjectLike(range[2])).toBe(true);
		});

		test('should correctly identify hyphen range', () =>
		{
			const range = parseRange('1.0.0 - 2.0.0');
			
			expect(isSimpleSemVerObjectLike(range[0])).toBe(true);
			expect(hasOperator(range[0])).toBe(false);
			
			expect(isSimpleSemVerOperatorLike(range[1])).toBe(true);
			expect(range[1].operator).toBe('-');
			
			expect(isSimpleSemVerObjectLike(range[2])).toBe(true);
		});
	});

	describe('所有運算子類型 / All operator types', () =>
	{
		test('should recognize caret operator', () =>
		{
			const parsed = parse('^1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('^');
		});

		test('should recognize tilde operator', () =>
		{
			const parsed = parse('~1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('~');
		});

		test('should recognize >= operator', () =>
		{
			const parsed = parse('>=1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('>=');
		});

		test('should recognize <= operator', () =>
		{
			const parsed = parse('<=1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('<=');
		});

		test('should recognize > operator', () =>
		{
			const parsed = parse('>1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('>');
		});

		test('should recognize < operator', () =>
		{
			const parsed = parse('<1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('<');
		});

		test('should recognize = operator', () =>
		{
			const parsed = parse('=1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('=');
		});

		test('should recognize ~> operator', () =>
		{
			const parsed = parse('~>1.0.0');
			expect(hasOperator(parsed)).toBe(true);
			expect(parsed.operator).toBe('~>');
		});
	});
});

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
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('checker', () =>
{
	describe('isSimpleSemVerObjectLike', () =>
	{
		test('should return true for valid semver object', () =>
		{
			const parsed = parse('1.0.0');
			assert.strictEqual(isSimpleSemVerObjectLike(parsed), true);
		});

		test('should return true for object with major', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectLike({ major: '1' }), true);
		});

		test('should return true for object with major, minor, patch', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectLike({ major: '1', minor: '0', patch: '0' }), true);
		});

		test('should return false for object without major', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectLike({}), false);
		});

		test('should return false for object with empty major', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectLike({ major: '' }), false);
		});

		test('should return false for operator-only object', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectLike({ operator: '||' }), false);
		});
	});

	describe('assertSimpleSemVerObjectLike', () =>
	{
		test('should not throw for valid semver object', () =>
		{
			const parsed = parse('1.0.0');
			assert.doesNotThrow(() => assertSimpleSemVerObjectLike(parsed));
		});

		test('should throw for invalid object', () =>
		{
			assert.throws(() => assertSimpleSemVerObjectLike({}), 'obj not a SimpleSemVerObject');
		});

		test('should not throw when notThrow is true', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerObjectLike({}, true));
		});
	});

	describe('hasOperator', () =>
	{
		test('should return true for object with operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
		});

		test('should return true for || operator', () =>
		{
			assert.strictEqual(hasOperator({ operator: '||' }), true);
		});

		test('should return false for object without operator', () =>
		{
			const parsed = parse('1.0.0');
			assert.strictEqual(hasOperator(parsed), false);
		});

		test('should return false for object with empty operator', () =>
		{
			assert.strictEqual(hasOperator({ operator: '' }), false);
		});

		test('should return false for empty object', () =>
		{
			assert.strictEqual(hasOperator({}), false);
		});
	});

	describe('assertHasOperator', () =>
	{
		test('should not throw for object with operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.doesNotThrow(() => assertHasOperator(parsed));
		});

		test('should throw for object without operator', () =>
		{
			assert.throws(() => assertHasOperator({}));
		});

		test('should not throw when notThrow is true', () =>
		{
			assert.doesNotThrow(() => assertHasOperator({}, true));
		});
	});

	describe('isSimpleSemVerOperatorLike', () =>
	{
		test('should return true for operator-only object', () =>
		{
			assert.strictEqual(isSimpleSemVerOperatorLike({ operator: '||' }), true);
		});

		test('should return true for operator object without major', () =>
		{
			assert.strictEqual(isSimpleSemVerOperatorLike({ operator: '-' }), true);
		});

		test('should return false for semver object with major', () =>
		{
			const parsed = parse('^1.0.0');
			assert.strictEqual(isSimpleSemVerOperatorLike(parsed), false);
		});

		test('should return false for object without operator', () =>
		{
			assert.strictEqual(isSimpleSemVerOperatorLike({ major: '1' }), false);
		});

		test('should return false for empty object', () =>
		{
			assert.strictEqual(isSimpleSemVerOperatorLike({}), false);
		});
	});

	describe('assertSimpleSemVerOperatorLike', () =>
	{
		test('should not throw for operator-only object', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerOperatorLike({ operator: '||' }));
		});

		test('should throw for semver object', () =>
		{
			const parsed = parse('1.0.0');
			assert.throws(() => assertSimpleSemVerOperatorLike(parsed));
		});

		test('should not throw when notThrow is true', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerOperatorLike({}, true));
		});
	});

	describe('isSimpleSemVerObjectWithOperatorLike', () =>
	{
		test('should return true for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike(parsed), true);
		});

		test('should return true for >= operator', () =>
		{
			const parsed = parse('>=1.0.0');
			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike(parsed), true);
		});

		test('should return false for semver without operator', () =>
		{
			const parsed = parse('1.0.0');
			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike(parsed), false);
		});

		test('should return false for operator-only object', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike({ operator: '||' }), false);
		});

		test('should return false for empty object', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike({}), false);
		});
	});

	describe('assertSimpleSemVerObjectWithOperatorLike', () =>
	{
		test('should not throw for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.doesNotThrow(() => assertSimpleSemVerObjectWithOperatorLike(parsed));
		});

		test('should throw for semver without operator', () =>
		{
			const parsed = parse('1.0.0');
			assert.throws(() => assertSimpleSemVerObjectWithOperatorLike(parsed));
		});

		test('should not throw when notThrow is true', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerObjectWithOperatorLike({}, true));
		});
	});

	describe('isSimpleSemVerObjectOrOperatorLike', () =>
	{
		test('should return true for semver object', () =>
		{
			const parsed = parse('1.0.0');
			assert.strictEqual(isSimpleSemVerObjectOrOperatorLike(parsed), true);
		});

		test('should return true for semver with operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.strictEqual(isSimpleSemVerObjectOrOperatorLike(parsed), true);
		});

		test('should return true for operator-only object', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectOrOperatorLike({ operator: '||' }), true);
		});

		test('should return false for empty object', () =>
		{
			assert.strictEqual(isSimpleSemVerObjectOrOperatorLike({}), false);
		});

		test('should return true for parsed range items', () =>
		{
			const range = parseRange('^1.0.0 || >=2.0.0');
			range.forEach(item =>
			{
				assert.strictEqual(isSimpleSemVerObjectOrOperatorLike(item), true);
			});
		});
	});

	describe('assertSimpleSemVerObjectOrOperatorLike', () =>
	{
		test('should not throw for semver object', () =>
		{
			const parsed = parse('1.0.0');
			assert.doesNotThrow(() => assertSimpleSemVerObjectOrOperatorLike(parsed));
		});

		test('should not throw for operator-only object', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerObjectOrOperatorLike({ operator: '||' }));
		});

		test('should throw for empty object', () =>
		{
			assert.throws(() => assertSimpleSemVerObjectOrOperatorLike({}));
		});

		test('should not throw when notThrow is true', () =>
		{
			assert.doesNotThrow(() => assertSimpleSemVerObjectOrOperatorLike({}, true));
		});
	});

	describe('與 parseRange 整合 / Integration with parseRange', () =>
	{
		test('should correctly identify range components', () =>
		{
			const range = parseRange('>=1.0.0 <2.0.0');

			assert.strictEqual(range.length, 2);

			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike(range[0]), true);
			assert.strictEqual(hasOperator(range[0]), true);
			assert.strictEqual(isSimpleSemVerObjectLike(range[0]), true);

			assert.strictEqual(isSimpleSemVerObjectWithOperatorLike(range[1]), true);
			assert.strictEqual(hasOperator(range[1]), true);
		});

		test('should correctly identify OR operator in range', () =>
		{
			const range = parseRange('~1.0.0 || ~2.0.0');

			assert.strictEqual(isSimpleSemVerObjectLike(range[0]), true);
			assert.strictEqual(hasOperator(range[0]), true);

			assert.strictEqual(isSimpleSemVerOperatorLike(range[1]), true);
			assert.strictEqual(hasOperator(range[1]), true);
			assert.strictEqual(isSimpleSemVerObjectLike(range[1]), false);

			assert.strictEqual(isSimpleSemVerObjectLike(range[2]), true);
		});

		test('should correctly identify hyphen range', () =>
		{
			const range = parseRange('1.0.0 - 2.0.0');

			assert.strictEqual(range.length, 3);

			assert.strictEqual(isSimpleSemVerObjectLike(range[0]), true);
			assert.strictEqual(hasOperator(range[0]), false);

			assert.strictEqual(isSimpleSemVerOperatorLike(range[1]), true);
			assert.strictEqual(range[1].operator, '-');

			assert.strictEqual(isSimpleSemVerObjectLike(range[2]), true);
		});
	});

	describe('所有運算子類型 / All operator types', () =>
	{
		test('should recognize caret operator', () =>
		{
			const parsed = parse('^1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '^');
		});

		test('should recognize tilde operator', () =>
		{
			const parsed = parse('~1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '~');
		});

		test('should recognize >= operator', () =>
		{
			const parsed = parse('>=1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '>=');
		});

		test('should recognize <= operator', () =>
		{
			const parsed = parse('<=1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '<=');
		});

		test('should recognize > operator', () =>
		{
			const parsed = parse('>1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '>');
		});

		test('should recognize < operator', () =>
		{
			const parsed = parse('<1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '<');
		});

		test('should recognize = operator', () =>
		{
			const parsed = parse('=1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '=');
		});

		test('should recognize ~> operator', () =>
		{
			const parsed = parse('~>1.0.0');
			assert.strictEqual(hasOperator(parsed), true);
			assert.strictEqual(parsed.operator, '~>');
		});
	});
});

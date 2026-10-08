/**
 * 測試比較函數 / Test comparison functions
 */
import { eq, neq, gt, gte, lt, lte, cmp, tryCompare } from '../lib/compare';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`comparison functions`, () =>
{

	describe('eq', () =>
	{

		test('should return true for equal versions', () =>
		{
			assert.strictEqual(eq('1.2.3', '1.2.3'), true);
		});

		test('should return true for equal partial versions', () =>
		{
			assert.strictEqual(eq('2.3', '2.3'), true);
		});

		test('should return false for different versions', () =>
		{
			assert.strictEqual(eq('1.2.3', '1.2.4'), false);
		});

		test('should return false for different partial versions', () =>
		{
			assert.strictEqual(eq('2.3', '2.4'), false);
		});

	});

	describe('neq', () =>
	{

		test('should return true for different versions', () =>
		{
			assert.strictEqual(neq('1.2.3', '1.2.4'), true);
		});

		test('should return false for equal versions', () =>
		{
			assert.strictEqual(neq('1.2.3', '1.2.3'), false);
		});

	});

	describe('gt', () =>
	{

		test('should return true when first version is greater', () =>
		{
			assert.strictEqual(gt('1.3.0', '1.2.0'), true);
			assert.strictEqual(gt('2.0.0', '1.0.0'), true);
			assert.strictEqual(gt('1.2.4', '1.2.3'), true);
		});

		test('should return false when first version is not greater', () =>
		{
			assert.strictEqual(gt('1.2.0', '1.3.0'), false);
			assert.strictEqual(gt('1.2.3', '1.2.3'), false);
		});

	});

	describe('gte', () =>
	{

		test('should return true when first version is greater or equal', () =>
		{
			assert.strictEqual(gte('1.3.0', '1.2.0'), true);
			assert.strictEqual(gte('1.2.3', '1.2.3'), true);
		});

		test('should return false when first version is less', () =>
		{
			assert.strictEqual(gte('1.2.0', '1.3.0'), false);
		});

	});

	describe('lt', () =>
	{

		test('should return true when first version is less', () =>
		{
			assert.strictEqual(lt('1.2.0', '1.3.0'), true);
			assert.strictEqual(lt('1.0.0', '2.0.0'), true);
			assert.strictEqual(lt('1.2.3', '1.2.4'), true);
		});

		test('should return false when first version is not less', () =>
		{
			assert.strictEqual(lt('1.3.0', '1.2.0'), false);
			assert.strictEqual(lt('1.2.3', '1.2.3'), false);
		});

	});

	describe('lte', () =>
	{

		test('should return true when first version is less or equal', () =>
		{
			assert.strictEqual(lte('1.2.0', '1.3.0'), true);
			assert.strictEqual(lte('1.2.3', '1.2.3'), true);
		});

		test('should return false when first version is greater', () =>
		{
			assert.strictEqual(lte('1.3.0', '1.2.0'), false);
		});

	});

	describe('cmp', () =>
	{

		test('should work with > operator', () =>
		{
			assert.strictEqual(cmp('1.3.0', '>', '1.2.0'), true);
			assert.strictEqual(cmp('1.2.0', '>', '1.3.0'), false);
		});

		test('should work with >= operator', () =>
		{
			assert.strictEqual(cmp('1.3.0', '>=', '1.2.0'), true);
			assert.strictEqual(cmp('1.2.3', '>=', '1.2.3'), true);
		});

		test('should work with < operator', () =>
		{
			assert.strictEqual(cmp('1.2.0', '<', '1.3.0'), true);
			assert.strictEqual(cmp('1.3.0', '<', '1.2.0'), false);
		});

		test('should work with <= operator', () =>
		{
			assert.strictEqual(cmp('1.2.0', '<=', '1.3.0'), true);
			assert.strictEqual(cmp('1.2.3', '<=', '1.2.3'), true);
		});

		test('should work with = operator', () =>
		{
			assert.strictEqual(cmp('1.2.3', '=', '1.2.3'), true);
			assert.strictEqual(cmp('1.2.3', '=', '1.2.4'), false);
		});

	});

	describe('tryCompare', () =>
	{

		test('should return comparison result for valid versions', () =>
		{
			assert.strictEqual(tryCompare('1.2.3', '1.3.0'), -1);
			assert.strictEqual(tryCompare('1.3.0', '1.2.3'), 1);
			assert.strictEqual(tryCompare('1.2.3', '1.2.3'), 0);
		});

		test('should return undefined for invalid versions', () =>
		{
			assert.strictEqual(tryCompare('invalid', '1.2.3'), undefined);
			assert.strictEqual(tryCompare('1.2.3', 'invalid'), undefined);
		});

	});

});
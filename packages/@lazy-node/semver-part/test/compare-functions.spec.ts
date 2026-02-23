/**
 * 測試比較函數 / Test comparison functions
 */
import { eq, neq, gt, gte, lt, lte, cmp, tryCompare } from '../lib/compare';

describe(`comparison functions`, () =>
{

	describe('eq', () =>
	{

		test('should return true for equal versions', () =>
		{
			expect(eq('1.2.3', '1.2.3')).toBe(true);
		});

		test('should return true for equal partial versions', () =>
		{
			expect(eq('2.3', '2.3')).toBe(true);
		});

		test('should return false for different versions', () =>
		{
			expect(eq('1.2.3', '1.2.4')).toBe(false);
		});

		test('should return false for different partial versions', () =>
		{
			expect(eq('2.3', '2.4')).toBe(false);
		});

	});

	describe('neq', () =>
	{

		test('should return true for different versions', () =>
		{
			expect(neq('1.2.3', '1.2.4')).toBe(true);
		});

		test('should return false for equal versions', () =>
		{
			expect(neq('1.2.3', '1.2.3')).toBe(false);
		});

	});

	describe('gt', () =>
	{

		test('should return true when first version is greater', () =>
		{
			expect(gt('1.3.0', '1.2.0')).toBe(true);
			expect(gt('2.0.0', '1.0.0')).toBe(true);
			expect(gt('1.2.4', '1.2.3')).toBe(true);
		});

		test('should return false when first version is not greater', () =>
		{
			expect(gt('1.2.0', '1.3.0')).toBe(false);
			expect(gt('1.2.3', '1.2.3')).toBe(false);
		});

	});

	describe('gte', () =>
	{

		test('should return true when first version is greater or equal', () =>
		{
			expect(gte('1.3.0', '1.2.0')).toBe(true);
			expect(gte('1.2.3', '1.2.3')).toBe(true);
		});

		test('should return false when first version is less', () =>
		{
			expect(gte('1.2.0', '1.3.0')).toBe(false);
		});

	});

	describe('lt', () =>
	{

		test('should return true when first version is less', () =>
		{
			expect(lt('1.2.0', '1.3.0')).toBe(true);
			expect(lt('1.0.0', '2.0.0')).toBe(true);
			expect(lt('1.2.3', '1.2.4')).toBe(true);
		});

		test('should return false when first version is not less', () =>
		{
			expect(lt('1.3.0', '1.2.0')).toBe(false);
			expect(lt('1.2.3', '1.2.3')).toBe(false);
		});

	});

	describe('lte', () =>
	{

		test('should return true when first version is less or equal', () =>
		{
			expect(lte('1.2.0', '1.3.0')).toBe(true);
			expect(lte('1.2.3', '1.2.3')).toBe(true);
		});

		test('should return false when first version is greater', () =>
		{
			expect(lte('1.3.0', '1.2.0')).toBe(false);
		});

	});

	describe('cmp', () =>
	{

		test('should work with > operator', () =>
		{
			expect(cmp('1.3.0', '>', '1.2.0')).toBe(true);
			expect(cmp('1.2.0', '>', '1.3.0')).toBe(false);
		});

		test('should work with >= operator', () =>
		{
			expect(cmp('1.3.0', '>=', '1.2.0')).toBe(true);
			expect(cmp('1.2.3', '>=', '1.2.3')).toBe(true);
		});

		test('should work with < operator', () =>
		{
			expect(cmp('1.2.0', '<', '1.3.0')).toBe(true);
			expect(cmp('1.3.0', '<', '1.2.0')).toBe(false);
		});

		test('should work with <= operator', () =>
		{
			expect(cmp('1.2.0', '<=', '1.3.0')).toBe(true);
			expect(cmp('1.2.3', '<=', '1.2.3')).toBe(true);
		});

		test('should work with = operator', () =>
		{
			expect(cmp('1.2.3', '=', '1.2.3')).toBe(true);
			expect(cmp('1.2.3', '=', '1.2.4')).toBe(false);
		});

	});

	describe('tryCompare', () =>
	{

		test('should return comparison result for valid versions', () =>
		{
			expect(tryCompare('1.2.3', '1.3.0')).toBe(-1);
			expect(tryCompare('1.3.0', '1.2.3')).toBe(1);
			expect(tryCompare('1.2.3', '1.2.3')).toBe(0);
		});

		test('should return undefined for invalid versions', () =>
		{
			expect(tryCompare('invalid', '1.2.3')).toBeUndefined();
			expect(tryCompare('1.2.3', 'invalid')).toBeUndefined();
		});

	});

});
/**
 * 驗證器測試
 * Validator tests
 *
 * @example
 * // 執行測試
 * yarn workspace @yarn-tool/version-style-jetbrains test
 */

/// <reference types="jest" />
/// <reference types="node" />

import {
	assertValidQuarter,
} from '../index';
import { assertValidDateInfo, isValidDateInfo, isValidQuarter } from '../lib/assert';

describe('Validators', () => {

	describe('isValidDateInfo', () => {

		it.each([
			// 有效日期 / Valid dates
			{ input: { year: 2026, month: 1, day: 1 }, expected: true },
			{ input: { year: 2026, month: 1, day: 31 }, expected: true },
			{ input: { year: 2026, month: 12, day: 31 }, expected: true },
			{ input: { year: 2026, month: 2, day: 28 }, expected: true },
			// 無效月份 / Invalid months
			{ input: { year: 2026, month: 0, day: 1 }, expected: false },
			{ input: { year: 2026, month: 13, day: 1 }, expected: false },
			{ input: { year: 2026, month: -1, day: 1 }, expected: false },
			// 無效日期 / Invalid days
			{ input: { year: 2026, month: 1, day: 0 }, expected: false },
			{ input: { year: 2026, month: 1, day: 32 }, expected: false },
			{ input: { year: 2026, month: 1, day: -1 }, expected: false },
			// 無效年份 / Invalid years
			{ input: { year: 0, month: 1, day: 1 }, expected: false },
			{ input: { year: -1, month: 1, day: 1 }, expected: false },
			// 缺少欄位 / Missing fields
			{ input: { month: 1, day: 1 }, expected: false },
			{ input: { year: 2026, day: 1 }, expected: false },
			{ input: { year: 2026, month: 1 }, expected: false },
			// 類型錯誤 / Type errors
			{ input: { year: '2026', month: 1, day: 1 }, expected: false },
			{ input: { year: 2026, month: '1', day: 1 }, expected: false },
			{ input: { year: 2026, month: 1, day: '1' }, expected: false },
		])('should return $expected for $input', ({ input, expected }) => {
			expect(isValidDateInfo(input as any)).toBe(expected);
		});

	});

	describe('isValidQuarter', () => {

		it.each([
			// 有效季度 / Valid quarters
			{ input: 1, expected: true },
			{ input: 2, expected: true },
			{ input: 3, expected: true },
			{ input: 4, expected: true },
			// 無效季度 / Invalid quarters
			{ input: 0, expected: false },
			{ input: 5, expected: false },
			{ input: -1, expected: false },
			// 浮點數會通過，因為 1 <= 1.5 <= 4 / Float passes because 1 <= 1.5 <= 4
			{ input: 1.5, expected: true },
			// 類型錯誤 / Type errors
			{ input: '1', expected: false },
			{ input: 'Q1', expected: false },
			{ input: null, expected: false },
			{ input: undefined, expected: false },
			{ input: {}, expected: false },
		])('should return $expected for quarter $input', ({ input, expected }) => {
			expect(isValidQuarter(input)).toBe(expected);
		});

	});

	describe('assertValidDateInfo', () => {

		it('should not throw for valid date info', () => {
			expect(() => assertValidDateInfo({ year: 2026, month: 1, day: 1 })).not.toThrow();
		});

		it('should throw for invalid date info', () => {
			expect(() => assertValidDateInfo({ year: 2026, month: 0, day: 1 })).toThrow(RangeError);
			expect(() => assertValidDateInfo({ year: 2026, month: 13, day: 1 })).toThrow(RangeError);
			expect(() => assertValidDateInfo({ year: 2026, month: 1, day: 0 })).toThrow(RangeError);
			expect(() => assertValidDateInfo({ year: 0, month: 1, day: 1 })).toThrow(RangeError);
		});

	});

	describe('assertValidQuarter', () => {

		it('should not throw for valid quarter', () => {
			expect(() => assertValidQuarter(1)).not.toThrow();
			expect(() => assertValidQuarter(4)).not.toThrow();
		});

		it('should throw for invalid quarter', () => {
			expect(() => assertValidQuarter(0)).toThrow(RangeError);
			expect(() => assertValidQuarter(5)).toThrow(RangeError);
			expect(() => assertValidQuarter(-1)).toThrow(RangeError);
			expect(() => assertValidQuarter('1')).toThrow(RangeError);
		});

	});

});

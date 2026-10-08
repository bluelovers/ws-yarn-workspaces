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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertValidDateInfo, assertValidQuarter, isValidDateInfo, isValidQuarter } from '../lib/assert';

describe('Validators', () => {

	describe('isValidDateInfo', () => {

		for (const { input, expected } of [
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
		]) {
			it(`should return ${expected} for ${JSON.stringify(input)}`, () => {
				assert.strictEqual(isValidDateInfo(input as any), expected);
			});
		}

	});

	describe('isValidQuarter', () => {

		for (const { input, expected } of [
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
		]) {
			it(`should return ${expected} for quarter ${typeof input === 'object' && input !== null ? JSON.stringify(input) : String(input)}`, () => {
				assert.strictEqual(isValidQuarter(input), expected);
			});
		}

	});

	describe('assertValidDateInfo', () => {

		it('should not throw for valid date info', () => {
			assert.doesNotThrow(() => assertValidDateInfo({ year: 2026, month: 1, day: 1 }));
		});

		it('should throw for invalid date info', () => {
			assert.throws(() => assertValidDateInfo({ year: 2026, month: 0, day: 1 }), RangeError);
			assert.throws(() => assertValidDateInfo({ year: 2026, month: 13, day: 1 }), RangeError);
			assert.throws(() => assertValidDateInfo({ year: 2026, month: 1, day: 0 }), RangeError);
			assert.throws(() => assertValidDateInfo({ year: 0, month: 1, day: 1 }), RangeError);
		});

	});

	describe('assertValidQuarter', () => {

		it('should not throw for valid quarter', () => {
			assert.doesNotThrow(() => assertValidQuarter(1));
			assert.doesNotThrow(() => assertValidQuarter(4));
		});

		it('should throw for invalid quarter', () => {
			assert.throws(() => assertValidQuarter(0), RangeError);
			assert.throws(() => assertValidQuarter(5), RangeError);
			assert.throws(() => assertValidQuarter(-1), RangeError);
			assert.throws(() => assertValidQuarter('1'), RangeError);
		});

	});

});

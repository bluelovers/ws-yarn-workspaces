/**
 * 輔助函數測試
 * Helper functions tests
 *
 * @example
 * // 執行測試
 * yarn workspace @yarn-tool/version-style-jetbrains test
 */

/// <reference types="jest" />
/// <reference types="node" />



import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EnumVersionStyle } from '../lib/types';
import { _isJetbrainsStyleFromStyle, _isMDCombinedFromStyle } from '../lib/assert';
import { _getStyleFromFlags } from '../lib/options';
import { _parseJetbrainsYearQuarter, _parseMonthDayInfo } from '../lib/date';

describe('Helper Functions', () => {

	describe('_isJetbrainsStyleFromStyle', () => {

		for (const { style, expected } of [
			{ style: EnumVersionStyle.JetbrainsShort, expected: true },
			{ style: EnumVersionStyle.JetbrainsShortMD, expected: true },
			{ style: EnumVersionStyle.StandardFull, expected: false },
			{ style: EnumVersionStyle.StandardFullMD, expected: false },
		]) {
			it(`should return ${expected} for ${style}`, () => {
				assert.strictEqual(_isJetbrainsStyleFromStyle(style), expected);
			});
		}

	});

	describe('_isMDCombinedFromStyle', () => {

		for (const { style, expected } of [
			{ style: EnumVersionStyle.JetbrainsShort, expected: false },
			{ style: EnumVersionStyle.JetbrainsShortMD, expected: true },
			{ style: EnumVersionStyle.StandardFull, expected: false },
			{ style: EnumVersionStyle.StandardFullMD, expected: true },
		]) {
			it(`should return ${expected} for ${style}`, () => {
				assert.strictEqual(_isMDCombinedFromStyle(style), expected);
			});
		}

	});

	describe('_getStyleFromFlags', () => {

		for (const { isJetbrainsShort, isMDCombined, expected } of [
			{ isJetbrainsShort: true, isMDCombined: false, expected: EnumVersionStyle.JetbrainsShort },
			{ isJetbrainsShort: true, isMDCombined: true, expected: EnumVersionStyle.JetbrainsShortMD },
			{ isJetbrainsShort: false, isMDCombined: false, expected: EnumVersionStyle.StandardFull },
			{ isJetbrainsShort: false, isMDCombined: true, expected: EnumVersionStyle.StandardFullMD },
		]) {
			it(`should return ${expected} for isJetbrainsShort=${isJetbrainsShort}, isMDCombined=${isMDCombined}`, () => {
				assert.strictEqual(_getStyleFromFlags(isJetbrainsShort, isMDCombined), expected);
			});
		}

	});

	describe('_parseMonthDayInfo', () => {

		describe('MD format (monthDay > 12)', () => {

			for (const { monthOrMD, dayOrIncrement, increment, expected } of [
				// MD 格式 / MD format
				{ monthOrMD: '101', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '115', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 15, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '308', dayOrIncrement: '1', increment: undefined, expected: { month: 3, day: 8, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '615', dayOrIncrement: '1', increment: undefined, expected: { month: 6, day: 15, dailyVersion: 1, isMDCombined: true } },
				// MD 格式有遞增 / MD format with increment
				{ monthOrMD: '101', dayOrIncrement: 'x', increment: '2', expected: { month: 1, day: 1, dailyVersion: 2, isMDCombined: true } },
			]) {
				it(`should parse ${monthOrMD} correctly`, () => {
					const result = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);
					assert.deepStrictEqual(result, expected);
				});
			}

		});

		describe('Standard format (monthDay <= 12)', () => {

			for (const { monthOrMD, dayOrIncrement, increment, expected } of [
				// 標準格式 / Standard format
				{ monthOrMD: '1', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '6', dayOrIncrement: '15', increment: undefined, expected: { month: 6, day: 15, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '12', dayOrIncrement: '31', increment: undefined, expected: { month: 12, day: 31, dailyVersion: 1, isMDCombined: false } },
				// 標準格式有遞增 / Standard format with increment
				{ monthOrMD: '1', dayOrIncrement: '1', increment: '2', expected: { month: 1, day: 1, dailyVersion: 2, isMDCombined: false } },
				// 邊界情況 / Edge cases
				{ monthOrMD: '', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '1', dayOrIncrement: '', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
			]) {
				it(`should parse ${monthOrMD}.${dayOrIncrement} correctly`, () => {
					const result = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);
					assert.deepStrictEqual(result, expected);
				});
			}

		});

	});

	describe('_parseJetbrainsYearQuarter', () => {

		for (const { input, expected } of [
			// Q1 / Quarter 1
			{ input: '261', expected: { year: 2026, quarter: 1 } },
			{ input: '211', expected: { year: 2021, quarter: 1 } },
			{ input: '231', expected: { year: 2023, quarter: 1 } },
			// Q2 / Quarter 2
			{ input: '262', expected: { year: 2026, quarter: 2 } },
			{ input: '212', expected: { year: 2021, quarter: 2 } },
			// Q3 / Quarter 3
			{ input: '263', expected: { year: 2026, quarter: 3 } },
			{ input: '233', expected: { year: 2023, quarter: 3 } },
			// Q4 / Quarter 4
			{ input: '264', expected: { year: 2026, quarter: 4 } },
			{ input: '214', expected: { year: 2021, quarter: 4 } },
			// 不同年份 / Different years
			{ input: '271', expected: { year: 2027, quarter: 1 } },
			{ input: '241', expected: { year: 2024, quarter: 1 } },
			{ input: '191', expected: { year: 2019, quarter: 1 } },
		]) {
			it(`should parse ${input} to year=${expected.year}, quarter=${expected.quarter}`, () => {
				const result = _parseJetbrainsYearQuarter(input);
				assert.deepStrictEqual(result, expected);
			});
		}

	});

});

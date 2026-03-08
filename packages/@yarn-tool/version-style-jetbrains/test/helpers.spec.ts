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

import {
	EnumVersionStyle,
	_isJetbrainsStyleFromStyle,
	_isMDCombinedFromStyle,
	_getStyleFromFlags,
	_parseMonthDayInfo,
	_parseJetbrainsYearQuarter,
} from '../index';

describe('Helper Functions', () => {

	describe('_isJetbrainsStyleFromStyle', () => {

		it.each([
			{ style: EnumVersionStyle.JetbrainsShort, expected: true },
			{ style: EnumVersionStyle.JetbrainsShortMD, expected: true },
			{ style: EnumVersionStyle.StandardFull, expected: false },
			{ style: EnumVersionStyle.StandardFullMD, expected: false },
		])('should return $expected for $style', ({ style, expected }) => {
			expect(_isJetbrainsStyleFromStyle(style)).toBe(expected);
		});

	});

	describe('_isMDCombinedFromStyle', () => {

		it.each([
			{ style: EnumVersionStyle.JetbrainsShort, expected: false },
			{ style: EnumVersionStyle.JetbrainsShortMD, expected: true },
			{ style: EnumVersionStyle.StandardFull, expected: false },
			{ style: EnumVersionStyle.StandardFullMD, expected: true },
		])('should return $expected for $style', ({ style, expected }) => {
			expect(_isMDCombinedFromStyle(style)).toBe(expected);
		});

	});

	describe('_getStyleFromFlags', () => {

		it.each([
			{ isJetbrainsShort: true, isMDCombined: false, expected: EnumVersionStyle.JetbrainsShort },
			{ isJetbrainsShort: true, isMDCombined: true, expected: EnumVersionStyle.JetbrainsShortMD },
			{ isJetbrainsShort: false, isMDCombined: false, expected: EnumVersionStyle.StandardFull },
			{ isJetbrainsShort: false, isMDCombined: true, expected: EnumVersionStyle.StandardFullMD },
		])('should return $expected for isJetbrainsShort=$isJetbrainsShort, isMDCombined=$isMDCombined', ({ isJetbrainsShort, isMDCombined, expected }) => {
			expect(_getStyleFromFlags(isJetbrainsShort, isMDCombined)).toBe(expected);
		});

	});

	describe('_parseMonthDayInfo', () => {

		describe('MD format (monthDay > 12)', () => {

			it.each([
				// MD 格式 / MD format
				{ monthOrMD: '101', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '115', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 15, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '308', dayOrIncrement: '1', increment: undefined, expected: { month: 3, day: 8, dailyVersion: 1, isMDCombined: true } },
				{ monthOrMD: '615', dayOrIncrement: '1', increment: undefined, expected: { month: 6, day: 15, dailyVersion: 1, isMDCombined: true } },
				// MD 格式有遞增 / MD format with increment
				{ monthOrMD: '101', dayOrIncrement: 'x', increment: '2', expected: { month: 1, day: 1, dailyVersion: 2, isMDCombined: true } },
			])('should parse $monthOrMD correctly', ({ monthOrMD, dayOrIncrement, increment, expected }) => {
				const result = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);
				expect(result).toEqual(expected);
			});

		});

		describe('Standard format (monthDay <= 12)', () => {

			it.each([
				// 標準格式 / Standard format
				{ monthOrMD: '1', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '6', dayOrIncrement: '15', increment: undefined, expected: { month: 6, day: 15, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '12', dayOrIncrement: '31', increment: undefined, expected: { month: 12, day: 31, dailyVersion: 1, isMDCombined: false } },
				// 標準格式有遞增 / Standard format with increment
				{ monthOrMD: '1', dayOrIncrement: '1', increment: '2', expected: { month: 1, day: 1, dailyVersion: 2, isMDCombined: false } },
				// 邊界情況 / Edge cases
				{ monthOrMD: '', dayOrIncrement: '1', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
				{ monthOrMD: '1', dayOrIncrement: '', increment: undefined, expected: { month: 1, day: 1, dailyVersion: 1, isMDCombined: false } },
			])('should parse $monthOrMD.$dayOrIncrement correctly', ({ monthOrMD, dayOrIncrement, increment, expected }) => {
				const result = _parseMonthDayInfo(monthOrMD, dayOrIncrement, increment);
				expect(result).toEqual(expected);
			});

		});

	});

	describe('_parseJetbrainsYearQuarter', () => {

		it.each([
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
		])('should parse $input to year=$expected.year, quarter=$expected.quarter', ({ input, expected }) => {
			const result = _parseJetbrainsYearQuarter(input);
			expect(result).toEqual(expected);
		});

	});

});

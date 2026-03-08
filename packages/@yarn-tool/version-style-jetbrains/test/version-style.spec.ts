/**
 * 基於日期版本生成器的測試
 * Date-based version generator tests
 *
 * @example
 * // 執行測試
 * yarn workspace @yarn-tool/version-style-jetbrains test
 */

/// <reference types="jest" />
/// <reference types="node" />

import {
	parseVersion,
	dateToVersion,
	dateToVersionByStyle,
	getNextDayVersion,
	incrementVersion,
	isTodayVersion,
	getNextVersion,
	generateAllStyleVersions,
	_handleVersionStyleOptions,
} from '../index';
import {
	_expectHandleVersionStyleOptions,
	_lazyParseVersion,
} from './lib/test';
import {
	DATE_TO_VERSION_DISABLE_SUFFIX_TEST_CASES, DATE_TO_VERSION_STYLE_TEST_CASES,
	INCREMENT_VERSION_TEST_CASES, JETBRAINS_YEAR_CODE_TEST_CASES,
	PARSE_VERSION_TEST_CASES, QUARTER_TEST_CASES, TEST_BASE_OPTIONS, TEST_DATE_Q1,
	TEST_DATE_Q2, TEST_Q2_OPTIONS, VALID_DATE_INFO_TEST_CASES,
} from './fixtures/data';
import { _getDateInfoFromDate, getJetbrainsYearCode, getQuarterFromMonth } from '../lib/date';
import { isValidDateInfo } from '../lib/assert';
import { EnumVersionStyle } from '../lib/types';

describe('Version Style Generator', () => {

	describe('getQuarterFromMonth', () => {

		it.each(QUARTER_TEST_CASES)('should return correct quarter for month $month', ({ month, expected }) => {
			expect(getQuarterFromMonth(month)).toBe(expected);
		});

	});

	describe('getJetbrainsYearCode', () => {

		it.each(JETBRAINS_YEAR_CODE_TEST_CASES)('should return $expected for year $year, quarter $quarter', ({ year, quarter, expected }) => {
			expect(getJetbrainsYearCode(year, quarter)).toBe(expected);
		});

	});

	describe('dateToVersionByStyle', () => {

		it.each(DATE_TO_VERSION_STYLE_TEST_CASES)('should generate $expected for $style style', ({ style, dateInfo, expected }) => {
			const result = dateToVersionByStyle(style, dateInfo);
			expect(result).toBe(expected);
		});

		describe('disableDailyVersionSuffix', () => {

			it.each(DATE_TO_VERSION_DISABLE_SUFFIX_TEST_CASES)('should $expected for $style with disableDailyVersionSuffix', ({ style, dateInfo, expected }) => {
				const result = dateToVersionByStyle(style, dateInfo);
				expect(result).toBe(expected);
			});

		});

	});

	describe('dateToVersion', () => {

		it('should generate default version with today date', () => {
			const today = new Date();
			const result = dateToVersion({});

			// 預設使用 JetbrainsShortMD 格式
			const expectedMonthDay = (today.getMonth() + 1) * 100 + today.getDate();
			const expectedYearCode = getJetbrainsYearCode(today.getFullYear(), getQuarterFromMonth(today.getMonth() + 1));

			expect(result).toMatch(new RegExp(`^${expectedYearCode}\\.${expectedMonthDay}\\.1$`));
		});

		it('should generate version with custom date', () => {
			// 2026年1月1日 (Q1)
			const result = dateToVersion({
				date: TEST_DATE_Q1,
				dailyIncrement: 1,
			});

			// 2026年1月 = Q1, getJetbrainsYearCode(2026, 1) = 261
			expect(result).toBe('261.101.1');
		});

	});

	describe('parseVersion', () => {

		it.each(PARSE_VERSION_TEST_CASES)('should parse $version', ({ version, expected }) => {
			const result = _lazyParseVersion(version);

			if (expected === null) {
				expect(result.parseVersion).toBeNull();
			} else {
				expect(result).toMatchSnapshot({
					parseVersion: expected
				});
			}
		});

		it('should parse JetbrainsShort style with full details', () => {
			const result = _lazyParseVersion('261.1.1-1');

			expect(result).toMatchSnapshot({
				parseVersion: {
					year: 2026,
					month: 1,
					day: 1,
					dailyVersion: 1,
					isJetbrainsShort: true,
					isMDCombined: false,
				},
			});
		});

	});

	describe('incrementVersion', () => {

		it.each(INCREMENT_VERSION_TEST_CASES)('should increment $version to $expected', ({ version, expected }) => {
			const result = incrementVersion(version);
			expect(result).toBe(expected);
		});

	});

	describe('isTodayVersion', () => {

		it('should return true for today version', () => {
			const today = new Date();
			const { year, month, day } = _getDateInfoFromDate(today);

			const version = `${year}.${month * 100 + day}.1`;
			const result = isTodayVersion(version, { date: today });

			expect(result).toBe(true);
		});

		it('should return false for not today version', () => {
			const result = isTodayVersion('2020.1.1-1', { date: new Date() });

			expect(result).toBe(false);
		});

	});

	describe('getNextVersion', () => {

		it('should increment version based on options', () => {
			const today = new Date();
			const { year, month, day } = _getDateInfoFromDate(today);

			// 使用 JetBrains Short MD 格式
			const result = getNextVersion({ date: today });

			// 應該是今天的版本 + 遞增
			const expectedYearCode = getJetbrainsYearCode(year, getQuarterFromMonth(month));
			const expected = `${expectedYearCode}.${month * 100 + day}.2`;
			expect(result).toBe(expected);
		});

		it('should return incremented version for given date', () => {
			const result = getNextVersion({ date: new Date() });

			const today = new Date();
			const { year, month, day } = _getDateInfoFromDate(today);

			// 使用 JetBrains Short MD 格式
			const expectedYearCode = getJetbrainsYearCode(year, getQuarterFromMonth(month));
			const expected = `${expectedYearCode}.${month * 100 + day}.2`;
			expect(result).toBe(expected);
		});

	});

	describe('_handleVersionStyleOptions', () => {

		it('should handle Date input', () => {
			const testDate = TEST_DATE_Q1;
			const result = _expectHandleVersionStyleOptions(testDate);

			expect(result.date.toDate()).toEqual(testDate);
		});

		it('should handle IVersionStyleOptions with date', () => {
			const result = _expectHandleVersionStyleOptions({
				date: TEST_DATE_Q1,
				dailyIncrement: 5,
				disableDailyVersionSuffix: true,
			}, {
				dailyIncrement: 5,
				disableDailyVersionSuffix: true,
			});

			expect(result.date.toDate()).toEqual(TEST_DATE_Q1);
		});

		it('should use default values when no input', () => {
			const before = new Date();
			const result = _expectHandleVersionStyleOptions();
			const after = new Date();

			// 日期應該在調用前後的時間範圍內
			const date = result.date.toDate();

			expect(date.getTime()).toBeGreaterThanOrEqual(before.getTime());
			expect(date.getTime()).toBeLessThanOrEqual(after.getTime());
		});

		it('should handle empty object', () => {
			const before = new Date();
			const result = _expectHandleVersionStyleOptions({});
			const after = new Date();

			// 日期應該在調用前後的時間範圍內
			const date = result.date.toDate();

			expect(date.getTime()).toBeGreaterThanOrEqual(before.getTime());
			expect(date.getTime()).toBeLessThanOrEqual(after.getTime());
		});

	});

	describe('isValidDateInfo', () => {

		it.each(VALID_DATE_INFO_TEST_CASES)('should return $expected for $input', ({ input, expected }) => {
			const result = isValidDateInfo(input as any);
			expect(result).toBe(expected);
		});

	});

	describe('generateAllStyleVersions', () => {

		it('should generate all style versions for Q1', () => {
			const result = generateAllStyleVersions({
				date: TEST_DATE_Q1,
				dailyIncrement: 1,
			});

			expect(result).toEqual({
				[EnumVersionStyle.JetbrainsShort]: '261.1.1-1',
				[EnumVersionStyle.JetbrainsShortMD]: '261.101.1',
				[EnumVersionStyle.StandardFull]: '2026.1.1-1',
				[EnumVersionStyle.StandardFullMD]: '2026.101.1',
			});
		});

		it('should generate versions for Q2', () => {
			const result = generateAllStyleVersions({
				date: TEST_DATE_Q2,
				dailyIncrement: 1,
			});

			expect(result).toEqual({
				[EnumVersionStyle.JetbrainsShort]: '262.6.15-1',
				[EnumVersionStyle.JetbrainsShortMD]: '262.615.1',
				[EnumVersionStyle.StandardFull]: '2026.6.15-1',
				[EnumVersionStyle.StandardFullMD]: '2026.615.1',
			});
		});

	});

});

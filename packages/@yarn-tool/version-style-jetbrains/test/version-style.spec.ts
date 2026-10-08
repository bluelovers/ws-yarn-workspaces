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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
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

		for (const { month, expected } of QUARTER_TEST_CASES) {
			it(`should return correct quarter for month ${month}`, () => {
				assert.strictEqual(getQuarterFromMonth(month), expected);
			});
		}

	});

	describe('getJetbrainsYearCode', () => {

		for (const { year, quarter, expected } of JETBRAINS_YEAR_CODE_TEST_CASES) {
			it(`should return ${expected} for year ${year}, quarter ${quarter}`, () => {
				assert.strictEqual(getJetbrainsYearCode(year, quarter), expected);
			});
		}

	});

	describe('dateToVersionByStyle', () => {

		for (const { style, dateInfo, expected } of DATE_TO_VERSION_STYLE_TEST_CASES) {
			it(`should generate ${expected} for ${style} style`, () => {
				const result = dateToVersionByStyle(style, dateInfo);
				assert.strictEqual(result, expected);
			});
		}

		describe('disableDailyVersionSuffix', () => {

			for (const { style, dateInfo, expected } of DATE_TO_VERSION_DISABLE_SUFFIX_TEST_CASES) {
				it(`should ${expected} for ${style} with disableDailyVersionSuffix`, () => {
					const result = dateToVersionByStyle(style, dateInfo);
					assert.strictEqual(result, expected);
				});
			}

		});

	});

	describe('dateToVersion', () => {

		it('should generate default version with today date', () => {
			const today = new Date();
			const result = dateToVersion({});

			// 預設使用 JetbrainsShortMD 格式
			const expectedMonthDay = (today.getMonth() + 1) * 100 + today.getDate();
			const expectedYearCode = getJetbrainsYearCode(today.getFullYear(), getQuarterFromMonth(today.getMonth() + 1));

			assert.match(result, new RegExp(`^${expectedYearCode}\\.${expectedMonthDay}\\.1$`));
		});

		it('should generate version with custom date', () => {
			// 2026年1月1日 (Q1)
			const result = dateToVersion({
				date: TEST_DATE_Q1,
				dailyIncrement: 1,
			});

			// 2026年1月 = Q1, getJetbrainsYearCode(2026, 1) = 261
			assert.strictEqual(result, '261.101.1');
		});

	});

	describe('parseVersion', () => {

		for (const { version, expected } of PARSE_VERSION_TEST_CASES) {
			it(`should parse ${version}`, (t) => {
				const result = _lazyParseVersion(version);

				if (expected === null) {
					assert.strictEqual(result.parseVersion, null);
				} else {
					assert.deepStrictEqual(result.parseVersion, expected);
					t.assert.snapshot(result.parseVersion);
				}
			});
		}

		it('should parse JetbrainsShort style with full details', (t) => {
			const result = _lazyParseVersion('261.1.1-1');

			assert.deepStrictEqual(result.parseVersion, {
				year: 2026,
				month: 1,
				day: 1,
				dailyVersion: 1,
				isJetbrainsShort: true,
				isMDCombined: false,
			});
			t.assert.snapshot(result.parseVersion);
		});

	});

	describe('incrementVersion', () => {

		for (const { version, expected } of INCREMENT_VERSION_TEST_CASES) {
			it(`should increment ${version} to ${expected}`, () => {
				const result = incrementVersion(version);
				assert.strictEqual(result, expected);
			});
		}

	});

	describe('isTodayVersion', () => {

		it('should return true for today version', () => {
			const today = new Date();
			const { year, month, day } = _getDateInfoFromDate(today);

			const version = `${year}.${month * 100 + day}.1`;
			const result = isTodayVersion(version, { date: today });

			assert.strictEqual(result, true);
		});

		it('should return false for not today version', () => {
			const result = isTodayVersion('2020.1.1-1', { date: new Date() });

			assert.strictEqual(result, false);
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
			assert.strictEqual(result, expected);
		});

		it('should return incremented version for given date', () => {
			const result = getNextVersion({ date: new Date() });

			const today = new Date();
			const { year, month, day } = _getDateInfoFromDate(today);

			// 使用 JetBrains Short MD 格式
			const expectedYearCode = getJetbrainsYearCode(year, getQuarterFromMonth(month));
			const expected = `${expectedYearCode}.${month * 100 + day}.2`;
			assert.strictEqual(result, expected);
		});

	});

	describe('_handleVersionStyleOptions', () => {

		it('should handle Date input', (t) => {
			const testDate = TEST_DATE_Q1;
			const result = _expectHandleVersionStyleOptions(t, testDate);

			assert.deepStrictEqual(result.date.toDate(), testDate);
		});

		it('should handle IVersionStyleOptions with date', (t) => {
			const result = _expectHandleVersionStyleOptions(t, {
				date: TEST_DATE_Q1,
				dailyIncrement: 5,
				disableDailyVersionSuffix: true,
			}, {
				dailyIncrement: 5,
				disableDailyVersionSuffix: true,
			});

			assert.deepStrictEqual(result.date.toDate(), TEST_DATE_Q1);
		});

		it('should use default values when no input', (t) => {
			const before = new Date();
			const result = _expectHandleVersionStyleOptions(t);
			const after = new Date();

			// 日期應該在調用前後的時間範圍內
			const date = result.date.toDate();

			assert.ok(date.getTime() >= before.getTime());
			assert.ok(date.getTime() <= after.getTime());
		});

		it('should handle empty object', (t) => {
			const before = new Date();
			const result = _expectHandleVersionStyleOptions(t, {});
			const after = new Date();

			// 日期應該在調用前後的時間範圍內
			const date = result.date.toDate();

			assert.ok(date.getTime() >= before.getTime());
			assert.ok(date.getTime() <= after.getTime());
		});

	});

	describe('isValidDateInfo', () => {

		for (const { input, expected } of VALID_DATE_INFO_TEST_CASES) {
			it(`should return ${expected} for ${JSON.stringify(input)}`, () => {
				const result = isValidDateInfo(input as any);
				assert.strictEqual(result, expected);
			});
		}

	});

	describe('generateAllStyleVersions', () => {

		it('should generate all style versions for Q1', () => {
			const result = generateAllStyleVersions({
				date: TEST_DATE_Q1,
				dailyIncrement: 1,
			});

			assert.deepStrictEqual(result, {
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

			assert.deepStrictEqual(result, {
				[EnumVersionStyle.JetbrainsShort]: '262.6.15-1',
				[EnumVersionStyle.JetbrainsShortMD]: '262.615.1',
				[EnumVersionStyle.StandardFull]: '2026.6.15-1',
				[EnumVersionStyle.StandardFullMD]: '2026.615.1',
			});
		});

	});

});

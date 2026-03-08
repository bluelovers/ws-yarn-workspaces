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
	EnumVersionStyle,
	parseVersion,
	dateToVersion,
	dateToVersionByStyle,
	getNextDayVersion,
	incrementVersion,
	isTodayVersion,
	getNextVersion,
	generateAllStyleVersions,
	getQuarterFromMonth,
	getJetbrainsYearCode,
	_handleVersionStyleOptions,
	isValidDateInfo, IVersionStyleOptions,
} from '../index';
import { _expectHandleVersionStyleOptions, _lazyParseVersion } from './lib/test';

describe('Version Style Generator', () => {

	describe('getQuarterFromMonth', () => {

		it('should return correct quarter for each month', () => {
			expect(getQuarterFromMonth(1)).toBe(1);  // January -> Q1
			expect(getQuarterFromMonth(2)).toBe(1);  // February -> Q1
			expect(getQuarterFromMonth(3)).toBe(1);  // March -> Q1
			expect(getQuarterFromMonth(4)).toBe(2);  // April -> Q2
			expect(getQuarterFromMonth(5)).toBe(2);  // May -> Q2
			expect(getQuarterFromMonth(6)).toBe(2);  // June -> Q2
			expect(getQuarterFromMonth(7)).toBe(3);  // July -> Q3
			expect(getQuarterFromMonth(8)).toBe(3);  // August -> Q3
			expect(getQuarterFromMonth(9)).toBe(3);  // September -> Q3
			expect(getQuarterFromMonth(10)).toBe(4); // October -> Q4
			expect(getQuarterFromMonth(11)).toBe(4); // November -> Q4
			expect(getQuarterFromMonth(12)).toBe(4); // December -> Q4
		});

	});

	describe('getJetbrainsYearCode', () => {

		it('should return correct year code for different years and quarters', () => {
			// 2026 Q1 = 26 * 10 + 1 = 261
			expect(getJetbrainsYearCode(2026, 1)).toBe(261);
			// 2026 Q2 = 26 * 10 + 2 = 262
			expect(getJetbrainsYearCode(2026, 2)).toBe(262);
			// 2026 Q3 = 26 * 10 + 3 = 263
			expect(getJetbrainsYearCode(2026, 3)).toBe(263);
			// 2026 Q4 = 26 * 10 + 4 = 264
			expect(getJetbrainsYearCode(2026, 4)).toBe(264);
			// 2027 Q1 = 27 * 10 + 1 = 271
			expect(getJetbrainsYearCode(2027, 1)).toBe(271);
		});

	});

	describe('dateToVersionByStyle', () => {

		it('should generate JetbrainsShort style (261.1.1-1)', () => {
			// 2026年1月1日 (Q1)
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShort, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
			});

			// 26 * 10 + 1 = 261
			expect(result).toBe('261.1.1-1');
		});

		it('should generate JetbrainsShortMD style (261.101.1)', () => {
			// 2026年1月1日 (Q1)
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShortMD, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
			});

			// 26 * 10 + 1 = 261, 1 * 100 + 1 = 101
			expect(result).toBe('261.101.1');
		});

		it('should generate StandardFull style (2026.1.1-1)', () => {
			// 2026年1月1日
			const result = dateToVersionByStyle(EnumVersionStyle.StandardFull, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
			});

			expect(result).toBe('2026.1.1-1');
		});

		it('should generate StandardFullMD style (2026.101.1)', () => {
			// 2026年1月1日
			const result = dateToVersionByStyle(EnumVersionStyle.StandardFullMD, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
			});

			// 1 * 100 + 1 = 101
			expect(result).toBe('2026.101.1');
		});

		it('should handle different months and days', () => {
			// 2026年3月8日 (Q1)
			const result = dateToVersionByStyle(EnumVersionStyle.StandardFullMD, {
				year: 2026,
				month: 3,
				day: 8,
				dailyIncrement: 1,
			});

			// 3 * 100 + 8 = 308
			expect(result).toBe('2026.308.1');
		});

		it('should handle different quarters', () => {
			// 2026年6月15日 (Q2)
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShortMD, {
				year: 2026,
				month: 6,
				day: 15,
				dailyIncrement: 1,
			});

			// 26 * 10 + 2 = 262 (Q2), 6 * 100 + 15 = 615
			expect(result).toBe('262.615.1');
		});

		it('should increment daily version', () => {
			// 2026年1月1日，第二版 (Q1)
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShort, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 2,
			});

			expect(result).toBe('261.1.1-2');
		});

		it('should disable daily version suffix for JetbrainsShort', () => {
			// 2026年1月1日 (Q1) - 無 -x 後綴
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShort, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
				disableDailyVersionSuffix: true,
			});

			expect(result).toBe('261.1.1');
		});

		it('should disable daily version suffix for StandardFull', () => {
			// 2026年1月1日 - 無 -x 後綴
			const result = dateToVersionByStyle(EnumVersionStyle.StandardFull, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
				disableDailyVersionSuffix: true,
			});

			expect(result).toBe('2026.1.1');
		});

		it('should ignore disableDailyVersionSuffix for JetbrainsShortMD', () => {
			// MD 格式沒有 -x 後綴，所以 disableDailyVersionSuffix 應該被忽略
			const result = dateToVersionByStyle(EnumVersionStyle.JetbrainsShortMD, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
				disableDailyVersionSuffix: true,
			});

			expect(result).toBe('261.101.1');
		});

		it('should ignore disableDailyVersionSuffix for StandardFullMD', () => {
			// MD 格式沒有 -x 後綴，所以 disableDailyVersionSuffix 應該被忽略
			const result = dateToVersionByStyle(EnumVersionStyle.StandardFullMD, {
				year: 2026,
				month: 1,
				day: 1,
				dailyIncrement: 1,
				disableDailyVersionSuffix: true,
			});

			expect(result).toBe('2026.101.1');
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
			const customDate = new Date(2026, 0, 1); // 2026年1月1日 (Q1)
			const result = dateToVersion({
				date: customDate,
				dailyIncrement: 1,
			});

			// 2026年1月 = Q1, getJetbrainsYearCode(2026, 1) = 261
			expect(result).toBe('261.101.1');
		});

	});

	describe('parseVersion', () => {

		it('should parse JetbrainsShort style', () => {
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

		it('should parse JetbrainsShortMD style', () => {
			const result = parseVersion('261.101.1');

			expect(result).toEqual({
				year: 2026,
				month: 1,
				day: 1,
				dailyVersion: 1,
				isJetbrainsShort: true,
				isMDCombined: true,
			});
		});

		it('should parse Jetbrains style for different quarters', () => {
			// 262 = 2026 Q2
			const result = parseVersion('262.615.1');

			expect(result).toEqual({
				year: 2026,
				month: 6,
				day: 15,
				dailyVersion: 1,
				isJetbrainsShort: true,
				isMDCombined: true,
			});
		});

		it('should parse StandardFull style', () => {
			const result = parseVersion('2026.1.1-1');

			expect(result).toEqual({
				year: 2026,
				month: 1,
				day: 1,
				dailyVersion: 1,
				isJetbrainsShort: false,
				isMDCombined: false,
			});
		});

		it('should parse StandardFullMD style', () => {
			const result = parseVersion('2026.101.1');

			expect(result).toEqual({
				year: 2026,
				month: 1,
				day: 1,
				dailyVersion: 1,
				isJetbrainsShort: false,
				isMDCombined: true,
			});
		});

		it('should parse version without increment', () => {
			const result = parseVersion('2026.1.1');

			expect(result).toEqual({
				year: 2026,
				month: 1,
				day: 1,
				dailyVersion: 1,
				isJetbrainsShort: false,
				isMDCombined: false,
			});
		});

		it('should return null for invalid version', () => {
			const result = parseVersion('invalid');

			expect(result).toBeNull();
		});

	});

	describe('incrementVersion', () => {

		it('should increment daily version', () => {
			const result = incrementVersion('261.1.1-1');

			expect(result).toBe('261.1.1-2');
		});

		it('should preserve style when incrementing', () => {
			const result = incrementVersion('261.101.1');

			expect(result).toBe('261.101.2');
		});

		it('should preserve standard full style', () => {
			const result = incrementVersion('2026.101.1');

			expect(result).toBe('2026.101.2');
		});

	});

	describe('isTodayVersion', () => {

		it('should return true for today version', () => {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const day = today.getDate();

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
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const day = today.getDate();

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
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const day = today.getDate();

			// 使用 JetBrains Short MD 格式
			const expectedYearCode = getJetbrainsYearCode(year, getQuarterFromMonth(month));
			const expected = `${expectedYearCode}.${month * 100 + day}.2`;
			expect(result).toBe(expected);
		});

	});

	describe('_handleVersionStyleOptions', () => {

		it('should handle Date input', () => {
			const testDate = new Date(2026, 0, 1);
			const result = _handleVersionStyleOptions(testDate);

			expect(result.date.toDate()).toEqual(testDate);
			expect(result.dailyIncrement).toBe(1);
			expect(result.disableDailyVersionSuffix).toBe(false);
		});

		it('should handle IVersionStyleOptions with date', () => {
			const testDate = new Date(2026, 0, 1);
			const result = _handleVersionStyleOptions({
				date: testDate,
				dailyIncrement: 5,
				disableDailyVersionSuffix: true,
			});

			expect(result.date.toDate()).toEqual(testDate);
			expect(result.dailyIncrement).toBe(5);
			expect(result.disableDailyVersionSuffix).toBe(true);
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

		it('should return true for valid date info', () => {
			const result = isValidDateInfo({ year: 2026, month: 1, day: 1 });
			expect(result).toBe(true);
		});

		it('should return false for missing year', () => {
			const result = isValidDateInfo({ month: 1, day: 1 });
			expect(result).toBe(false);
		});

		it('should return false for missing month', () => {
			const result = isValidDateInfo({ year: 2026, day: 1 });
			expect(result).toBe(false);
		});

		it('should return false for missing day', () => {
			const result = isValidDateInfo({ year: 2026, month: 1 });
			expect(result).toBe(false);
		});

		it('should return false for invalid month (0)', () => {
			const result = isValidDateInfo({ year: 2026, month: 0, day: 1 });
			expect(result).toBe(false);
		});

		it('should return false for invalid month (13)', () => {
			const result = isValidDateInfo({ year: 2026, month: 13, day: 1 });
			expect(result).toBe(false);
		});

		it('should return false for invalid day (0)', () => {
			const result = isValidDateInfo({ year: 2026, month: 1, day: 0 });
			expect(result).toBe(false);
		});

		it('should return false for invalid day (32)', () => {
			const result = isValidDateInfo({ year: 2026, month: 1, day: 32 });
			expect(result).toBe(false);
		});

		it('should return false for invalid year (0)', () => {
			const result = isValidDateInfo({ year: 0, month: 1, day: 1 });
			expect(result).toBe(false);
		});

		it('should return false for negative year', () => {
			const result = isValidDateInfo({ year: -1, month: 1, day: 1 });
			expect(result).toBe(false);
		});

	});

	describe('generateAllStyleVersions', () => {

		it('should generate all style versions', () => {
			const customDate = new Date(2026, 0, 1); // 2026年1月1日 (Q1)
			const result = generateAllStyleVersions({
				date: customDate,
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
			const q2Date = new Date(2026, 5, 15); // 2026年6月15日 (Q2)
			const result = generateAllStyleVersions({
				date: q2Date,
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

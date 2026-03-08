/**
 * 日期資訊測試
 * Date info tests
 *
 * @example
 * // 執行測試
 * yarn workspace @yarn-tool/version-style-jetbrains test
 */

/// <reference types="jest" />
/// <reference types="node" />

import dayjs from 'dayjs';
import {
	EnumVersionStyle,
	_getDateInfoFromDate,
	_getDateInfoFromDayjs,
	_handleVersionStyleOptions,
} from '../index';

describe('Date Info Functions', () => {

	describe('_getDateInfoFromDate', () => {

		it.each([
			// 使用固定的本地時間日期 / Use fixed local time dates
			{ date: new Date(2026, 0, 1), expected: { year: 2026, month: 1, day: 1 } },
			{ date: new Date(2026, 5, 15), expected: { year: 2026, month: 6, day: 15 } },
			{ date: new Date(2026, 11, 31), expected: { year: 2026, month: 12, day: 31 } },
			{ date: new Date(2000, 0, 1), expected: { year: 2000, month: 1, day: 1 } },
		])('should convert Date($date) to $expected', ({ date, expected }) => {
			const result = _getDateInfoFromDate(date);
			expect(result).toEqual(expected);
		});

	});

	describe('_getDateInfoFromDayjs', () => {

		it.each([
			{ date: dayjs('2026-01-01'), expected: { year: 2026, month: 1, day: 1 } },
			{ date: dayjs('2026-06-15'), expected: { year: 2026, month: 6, day: 15 } },
			{ date: dayjs('2026-12-31'), expected: { year: 2026, month: 12, day: 31 } },
			{ date: dayjs('2000-01-01'), expected: { year: 2000, month: 1, day: 1 } },
		])('should convert dayjs("$date") to $expected', ({ date, expected }) => {
			const result = _getDateInfoFromDayjs(date);
			expect(result).toEqual(expected);
		});

	});

	describe('_handleVersionStyleOptions', () => {

		it('should handle Date object', () => {
			const date = new Date(2026, 0, 1);
			const result = _handleVersionStyleOptions(date) as any;
			expect(result.date.year()).toBe(2026);
			expect(result.date.month()).toBe(0); // dayjs uses 0-based month
			expect(result.date.date()).toBe(1);
		});

		it('should handle string date', () => {
			const result = _handleVersionStyleOptions('2026-06-15') as any;
			expect(result.date.year()).toBe(2026);
			expect(result.date.month()).toBe(5);
			expect(result.date.date()).toBe(15);
		});

		it('should handle number timestamp', () => {
			const timestamp = new Date(2026, 0, 1).getTime();
			const result = _handleVersionStyleOptions(timestamp) as any;
			expect(result.date.year()).toBe(2026);
			expect(result.date.month()).toBe(0);
			expect(result.date.date()).toBe(1);
		});

		it('should handle Date in options', () => {
			const result = _handleVersionStyleOptions({
				date: new Date(2026, 5, 15),
			}) as any;
			expect(result.date.year()).toBe(2026);
			expect(result.date.month()).toBe(5);
			expect(result.date.date()).toBe(15);
		});

		it('should handle style option', () => {
			const result = _handleVersionStyleOptions({
				style: EnumVersionStyle.JetbrainsShort,
			}) as any;
			expect(result.style).toBe(EnumVersionStyle.JetbrainsShort);
		});

		it('should apply default values when no options', () => {
			const before = new Date();
			const result = _handleVersionStyleOptions({}) as any;
			const after = new Date();

			// 檢查日期在合理範圍內 / Check date is within reasonable range
			const resultDate = result.date.toDate();
			expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime() - 60000);
			expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime() + 60000);

			// 檢查預設值 / Check default values
			expect(result.dailyIncrement).toBe(1);
			expect(result.disableDailyVersionSuffix).toBe(false);
			expect(result.style).toBe(EnumVersionStyle.JetbrainsShortMD);
		});

		it('should use custom dailyIncrement', () => {
			const result = _handleVersionStyleOptions({
				dailyIncrement: 5,
			}) as any;
			expect(result.dailyIncrement).toBe(5);
		});

		it('should use custom disableDailyVersionSuffix', () => {
			const result = _handleVersionStyleOptions({
				disableDailyVersionSuffix: true,
			}) as any;
			expect(result.disableDailyVersionSuffix).toBe(true);
		});

		it('should use custom style', () => {
			const result = _handleVersionStyleOptions({
				style: EnumVersionStyle.StandardFull,
			}) as any;
			expect(result.style).toBe(EnumVersionStyle.StandardFull);
		});

	});

});

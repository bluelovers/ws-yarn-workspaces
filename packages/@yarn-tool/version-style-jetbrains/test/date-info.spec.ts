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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import dayjs from 'dayjs';
import { _getDateInfoFromDate, _getDateInfoFromDayjs } from '../lib/date';
import { _handleVersionStyleOptions } from '../lib/options';
import { EnumVersionStyle } from '../lib/types';

describe('Date Info Functions', () => {

	describe('_getDateInfoFromDate', () => {

		for (const { date, expected } of [
			// 使用固定的本地時間日期 / Use fixed local time dates
			{ date: new Date(2026, 0, 1), expected: { year: 2026, month: 1, day: 1 } },
			{ date: new Date(2026, 5, 15), expected: { year: 2026, month: 6, day: 15 } },
			{ date: new Date(2026, 11, 31), expected: { year: 2026, month: 12, day: 31 } },
			{ date: new Date(2000, 0, 1), expected: { year: 2000, month: 1, day: 1 } },
		]) {
			it(`should convert Date(${JSON.stringify(date)}) to ${JSON.stringify(expected)}`, () => {
				const result = _getDateInfoFromDate(date);
				assert.deepStrictEqual(result, expected);
			});
		}

	});

	describe('_getDateInfoFromDayjs', () => {

		for (const { date, expected } of [
			{ date: dayjs('2026-01-01'), expected: { year: 2026, month: 1, day: 1 } },
			{ date: dayjs('2026-06-15'), expected: { year: 2026, month: 6, day: 15 } },
			{ date: dayjs('2026-12-31'), expected: { year: 2026, month: 12, day: 31 } },
			{ date: dayjs('2000-01-01'), expected: { year: 2000, month: 1, day: 1 } },
		]) {
			it(`should convert dayjs("${date.toISOString()}") to ${JSON.stringify(expected)}`, () => {
				const result = _getDateInfoFromDayjs(date);
				assert.deepStrictEqual(result, expected);
			});
		}

	});

	describe('_handleVersionStyleOptions', () => {

		it('should handle Date object', () => {
			const date = new Date(2026, 0, 1);
			const result = _handleVersionStyleOptions(date) as any;
			assert.strictEqual(result.date.year(), 2026);
			assert.strictEqual(result.date.month(), 0); // dayjs uses 0-based month
			assert.strictEqual(result.date.date(), 1);
		});

		it('should handle string date', () => {
			const result = _handleVersionStyleOptions('2026-06-15') as any;
			assert.strictEqual(result.date.year(), 2026);
			assert.strictEqual(result.date.month(), 5);
			assert.strictEqual(result.date.date(), 15);
		});

		it('should handle number timestamp', () => {
			const timestamp = new Date(2026, 0, 1).getTime();
			const result = _handleVersionStyleOptions(timestamp) as any;
			assert.strictEqual(result.date.year(), 2026);
			assert.strictEqual(result.date.month(), 0);
			assert.strictEqual(result.date.date(), 1);
		});

		it('should handle Date in options', () => {
			const result = _handleVersionStyleOptions({
				date: new Date(2026, 5, 15),
			}) as any;
			assert.strictEqual(result.date.year(), 2026);
			assert.strictEqual(result.date.month(), 5);
			assert.strictEqual(result.date.date(), 15);
		});

		it('should handle style option', () => {
			const result = _handleVersionStyleOptions({
				style: EnumVersionStyle.JetbrainsShort,
			}) as any;
			assert.strictEqual(result.style, EnumVersionStyle.JetbrainsShort);
		});

		it('should apply default values when no options', () => {
			const before = new Date();
			const result = _handleVersionStyleOptions({}) as any;
			const after = new Date();

			// 檢查日期在合理範圍內 / Check date is within reasonable range
			const resultDate = result.date.toDate();
			assert.ok(resultDate.getTime() >= before.getTime() - 60000);
			assert.ok(resultDate.getTime() <= after.getTime() + 60000);

			// 檢查預設值 / Check default values
			assert.strictEqual(result.dailyIncrement, 1);
			assert.strictEqual(result.disableDailyVersionSuffix, false);
			assert.strictEqual(result.style, EnumVersionStyle.JetbrainsShortMD);
		});

		it('should use custom dailyIncrement', () => {
			const result = _handleVersionStyleOptions({
				dailyIncrement: 5,
			}) as any;
			assert.strictEqual(result.dailyIncrement, 5);
		});

		it('should use custom disableDailyVersionSuffix', () => {
			const result = _handleVersionStyleOptions({
				disableDailyVersionSuffix: true,
			}) as any;
			assert.strictEqual(result.disableDailyVersionSuffix, true);
		});

		it('should use custom style', () => {
			const result = _handleVersionStyleOptions({
				style: EnumVersionStyle.StandardFull,
			}) as any;
			assert.strictEqual(result.style, EnumVersionStyle.StandardFull);
		});

	});

});

/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, test, TestContext } from 'node:test';
import {
	dateToVersionByStyle,
	EnumVersionStyle,
	IVersionStyleOptionsWithDateInfo,
	parseVersion,
} from '@yarn-tool/version-style-jetbrains';
import { nextVersionRecommended } from '../lib/nextVersionRecommended';
import { parseVersionsDiffCore } from '@yarn-tool/semver-diff';
import { NON_STYLE_VERSION } from './lib/fixedVersion';

/** 跨季度、跨年的取樣日期，用來驗證版本號確實隨日期改變 */
const SAMPLE_DATES: Array<{
	label: string;
	date: IVersionStyleOptionsWithDateInfo;
}> = [
	{ label: '2026-01-01 00:00', date: { year: 2026, month: 1, day: 1, hour: 0, minute: 0, dailyIncrement: 1 } },
	{ label: '2026-11-20 17:44', date: { year: 2026, month: 11, day: 20, hour: 17, minute: 44, dailyIncrement: 1 } },
	{ label: '2027-03-08 09:05', date: { year: 2027, month: 3, day: 8, hour: 9, minute: 5, dailyIncrement: 1 } },
];

/** 以指定日期建立同風格的舊版本 */
const toVersionDateInfo = (date: Date): IVersionStyleOptionsWithDateInfo => ({
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	day: date.getDate(),
	hour: date.getHours(),
	minute: date.getMinutes(),
	dailyIncrement: 1,
});

describe('style varies with date', () =>
{

	for (const style of Object.values(EnumVersionStyle))
	{
		test(`${style}: version changes with the date`, (t: TestContext) =>
		{
			const versions = SAMPLE_DATES.map(({ date }) => dateToVersionByStyle(style, date));

			/** 不同日期必須產生不同版本，否則此風格沒有隨日期變化 */
			assert.strictEqual(new Set(versions).size, versions.length);

			t.assert.snapshot({
				dates: SAMPLE_DATES.map(({ label }) => label),
				versions,
			});
		});

		test(`${style}: recommended version follows the current date`, () =>
		{
			const before = new Date();
			const actual = nextVersionRecommended(NON_STYLE_VERSION, { versionStyle: style });
			const after = new Date();

			const parsed = parseVersion(actual.newVersion);

			assert.ok(parsed, `failed to parse: ${actual.newVersion}`);

			/** 版本日期須為呼叫前後其中一天，涵蓋跨日邊界 */
			const isSameDay = (d: Date) => d.getFullYear() === parsed.year
				&& d.getMonth() + 1 === parsed.month
				&& d.getDate() === parsed.day;

			assert.ok(isSameDay(before) || isSameDay(after), JSON.stringify({
				['new version']: actual.newVersion,
				['parsed date']: `${parsed.year}-${parsed.month}-${parsed.day}`,
				before,
				after,
			}));

			/** 時間樣式還須落在呼叫前後的分鐘內，涵蓋跨分鐘邊界 */
			if (parsed.hour !== undefined)
			{
				const isSameMinute = (d: Date) => d.getHours() === parsed.hour
					&& d.getMinutes() === parsed.minute;

				assert.ok(isSameMinute(before) || isSameMinute(after), JSON.stringify({
					['new version']: actual.newVersion,
					['parsed time']: `${parsed.hour}:${parsed.minute}`,
					before,
					after,
				}));
			}
		});
	}

});

/**
 * 同風格舊版本 × 是否重設遞增號 × 舊版本是否與基準同日，
 * 並以 semver-diff 判斷變動落在哪一段
 */
describe('same style old version with and without resetDailyIncrement', () =>
{

	/** 基準日期：產生結果由 date 固定，舊版本與它同日或不同日 */
	const BASE_DATE = new Date(2026, 10, 21, 17, 44);
	const OTHER_DATE = new Date(2026, 0, 1, 9, 5);

	const cases = [
		{ label: 'same day', oldDate: BASE_DATE, resetDailyIncrement: false },
		{ label: 'same day', oldDate: BASE_DATE, resetDailyIncrement: true },
		{ label: 'other day', oldDate: OTHER_DATE, resetDailyIncrement: false },
		{ label: 'other day', oldDate: OTHER_DATE, resetDailyIncrement: true },
	];

	for (const style of Object.values(EnumVersionStyle))
	{
		for (const { label, oldDate, resetDailyIncrement } of cases)
		{
			test(`${style}: ${label}, resetDailyIncrement=${resetDailyIncrement}`, (t: TestContext) =>
			{
				const oldVersion = dateToVersionByStyle(style, toVersionDateInfo(oldDate));

				const actual = nextVersionRecommended(oldVersion, {
					versionStyle: style,
					date: BASE_DATE,
					resetDailyIncrement,
				});

				const diff = parseVersionsDiffCore(oldVersion, actual.newVersion);

				/** 只取判斷變動所需的欄位：差異段落、比較結果與該段顏色 */
				const changed = {
					index: diff.index,
					comp: diff.comp,
					color: diff.color,
					result: diff.result,
					resultAppend: diff.resultAppend,
				};

				/** 以基準日期重新產生的版本：不同日期一律重新開始，故與重設結果相同 */
				const expectedFresh = dateToVersionByStyle(style, toVersionDateInfo(BASE_DATE));

				if (label === 'other day')
				{
					/** 每日遞增只計算同一天：不同日期不論有無 resetDailyIncrement 都重新產生 */
					assert.strictEqual(actual.newVersion, expectedFresh);
					assert.ok(changed.index < 2);
				}
				else if (resetDailyIncrement)
				{
					/** 同日重設：遞增號回到 1，與原版本相同 */
					assert.strictEqual(changed.comp, 0);
				}
				else
				{
					/** 同日未重設：只遞增當日計數，日期段不變 → 差異落在最後一段 */
					assert.strictEqual(changed.index, 2);
				}

				t.assert.snapshot({
					['old version']: oldVersion,
					['new version']: actual.newVersion,
					changed,
				});
			});
		}
	}

});

/**
 * 不同時間的版本編號必然不同：只有時間樣式帶時分段
 */
describe('style varies with time', () =>
{

	const MORNING = new Date(2026, 10, 21, 9, 5);
	const EVENING = new Date(2026, 10, 21, 17, 44);

	for (const style of Object.values(EnumVersionStyle))
	{
		test(`${style}: same day with different times`, () =>
		{
			const morning = dateToVersionByStyle(style, toVersionDateInfo(MORNING));
			const evening = dateToVersionByStyle(style, toVersionDateInfo(EVENING));

			if (parseVersion(evening)?.hour !== undefined)
			{
				/** 時間樣式：同一天不同時間必然產生不同版本 */
				assert.notStrictEqual(morning, evening);
			}
			else
			{
				/** 非時間樣式不帶時分段，同一天不同時間結果相同 */
				assert.strictEqual(morning, evening);
			}
		});
	}

});

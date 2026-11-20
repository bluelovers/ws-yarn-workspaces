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

/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, test, TestContext } from 'node:test';
import { analyzeVersionStyles, dateToVersionByStyle, EnumVersionStyle } from '@yarn-tool/version-style-jetbrains';
import { nextVersionRecommended } from '../lib/nextVersionRecommended';
import { INextVersionRecommendedOptions } from '../lib/types';
import { FIXED_DATE, toFixedVersion } from './lib/fixedVersion';

describe('version style generation', () =>
{

	for (const style of Object.values(EnumVersionStyle))
	{
		/** 以固定日期建立同風格的舊版本：遞增路徑只推進當日計數，結果不隨執行時間變動 */
		const sameStyleVersion = dateToVersionByStyle(style, FIXED_DATE);

		test(`${style}: increment the same style`, (t: TestContext) =>
		{
			const actual = nextVersionRecommended(sameStyleVersion, { versionStyle: style });

			t.assert.snapshot({
				['old version']: sameStyleVersion,
				['new version']: actual.newVersion,
			});
		});

		/**
		 * 風格模式的新版本不看 bump，只有 bump 欄位會回報指定值；
		 * 以全部 bump 交叉驗證結果一致，才看得出 bump 對風格結果無效
		 */
		test(`${style}: bump does not change the style result`, (t: TestContext) =>
		{
			const bumps: Array<NonNullable<INextVersionRecommendedOptions['bump']>> = [
				'major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease',
			];

			const results = bumps.map((bump) =>
			{
				const actual = nextVersionRecommended(sameStyleVersion, { versionStyle: style, bump });

				/** 基本驗證：bump 欄位回報指定值，新版本仍屬指定風格且已推進 */
				assert.strictEqual(actual.bump, bump);
				assert.notStrictEqual(actual.newVersion, sameStyleVersion);
				assert.strictEqual(analyzeVersionStyles(actual.newVersion).priorityStyle, style);

				return { bump, newVersion: actual.newVersion };
			});

			/** 所有 bump 產生相同的新版本，證實 bump 不影響風格結果 */
			for (const { newVersion } of results)
			{
				assert.strictEqual(newVersion, results[0].newVersion);
			}

			t.assert.snapshot({
				['old version']: sameStyleVersion,
				results,
			});
		});

		test(`${style}: generate from a non-style version`, (t: TestContext) =>
		{
			const actual = nextVersionRecommended('1.2.3', { versionStyle: style });

			/** 此路徑以當日日期時間產生，先固定化再快照 */
			t.assert.snapshot({
				['old version']: '1.2.3',
				['new version']: toFixedVersion(actual.newVersion),
			});
		});
	}

	test('resetDailyIncrement restarts the daily count', (t: TestContext) =>
	{
		const oldVersion = dateToVersionByStyle(EnumVersionStyle.JetbrainsDateTime, FIXED_DATE);

		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
			resetDailyIncrement: true,
		});

		t.assert.snapshot({
			['old version']: oldVersion,
			['new version']: toFixedVersion(actual.newVersion),
		});
	});

	test('preid disables the daily version suffix', (t: TestContext) =>
	{
		const oldVersion = dateToVersionByStyle(EnumVersionStyle.JetbrainsDateTime, FIXED_DATE);

		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
			preid: 'beta',
		});

		t.assert.snapshot({
			['old version']: oldVersion,
			['new version']: toFixedVersion(actual.newVersion),
		});
	});

});

describe('default style (no versionStyle)', () =>
{

	const cases: Array<{
		label: string;
		oldVersion: string;
		options?: INextVersionRecommendedOptions;
	}> = [
		{ label: 'patch by default', oldVersion: '1.2.3' },
		{ label: 'minor flag', oldVersion: '1.2.3', options: { minor: true } },
		{ label: 'explicit major', oldVersion: '1.2.3', options: { bump: 'major' } },
		{ label: 'prerelease with preid', oldVersion: '1.2.3-beta.1', options: { preid: 'beta' } },
		{ label: 'numeric prerelease', oldVersion: '1.2.3-1' },
	];

	for (const { label, oldVersion, options } of cases)
	{
		test(label, (t: TestContext) =>
		{
			const actual = nextVersionRecommended(oldVersion, options);

			t.assert.snapshot({
				['old version']: oldVersion,
				bump: actual.bump,
				['new version']: actual.newVersion,
			});
		});
	}

});

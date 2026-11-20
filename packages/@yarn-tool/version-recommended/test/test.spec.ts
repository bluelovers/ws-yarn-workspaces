//@noUnusedParameters:false
/// <reference types="node" />

import assert from 'node:assert/strict';
import { before, beforeEach, describe, test, TestContext } from 'node:test';
import { basename, extname } from 'path';
import { INextVersionRecommendedOptions, releaseTypes } from '../lib/types';
import { nextVersionRecommended } from '../lib/nextVersionRecommended';
import { detectPreidByVersion, handleOptions, releaseTypesIsPre } from '../lib/handleOptions';
import { parse, ReleaseType } from 'semver';
import { inc as semverIncrement } from 'semver';
import { nextVersionRecommendedByPackageFindUp } from '../lib/pkg';
import { analyzeVersionStyles, EnumVersionStyle } from '@yarn-tool/version-style-jetbrains';

describe('nextVersionRecommendedByPackageFindUp', () =>
{
	for (const bump of [...releaseTypes])
	{
		describe(`bump: ${JSON.stringify(bump)}`, () =>
		{
			if (bump)
			{
				test(`bump: ${bump}`, () =>
				{
					let actual = nextVersionRecommendedByPackageFindUp({
						bump,
					});

					assert.strictEqual(actual.bump, bump)
				})

				test(`flag: ${bump}`, () =>
				{
					let actual = nextVersionRecommendedByPackageFindUp({
						[bump]: true,
					});

					assert.strictEqual(actual.bump, bump)
				})
			}
		})
	}
})

describe('version', () =>
{

	for (const oldVersion of [
		'5.5.0-dev.20240225+rev.2',
		'5.5.0-dev.20240225',
		'5.5.0-20240225',
		'5.5.0',
	]) {
		describe(`${oldVersion}`, () => {

			const sv = parse(oldVersion);

			for (const bump of [...releaseTypes, void 0]) {
				describe(`bump: ${JSON.stringify(bump)}`, () => {

					for (const preid of [
						'dev',
						'next',
						'beta',
						'55',
						void 0,
					])
					{
						describe(`preid: ${JSON.stringify(preid)}`, () =>
						{

							for (const identifierBase of [
								0,
								1,
								'0',
								'1',
								void 0,
								false,
								true,
							])
							{
								describe(`identifierBase: ${JSON.stringify(identifierBase)}`, () =>
								{
									let options: INextVersionRecommendedOptions;

									beforeEach(() => {
										options = {
											bump,
											preid,
											identifierBase,
										} as any;
									})

									test('handleOptions', (t) =>
									{
										t.assert.snapshot({
											['with oldVersion']: handleOptions(options, oldVersion),
											['without']: handleOptions(options),
										});
									});

									test('detectPreidByVersion', (t) =>
									{
										let actual = detectPreidByVersion(oldVersion);

										let ex = {
											['with options']: detectPreidByVersion(oldVersion, options),
											['without']: detectPreidByVersion(oldVersion),
										};

										if (sv.prerelease?.length)
										{
											t.assert.snapshot(ex);
										}
										else
										{
											assert.deepStrictEqual(ex, {
												['with options']: null,
												['without']: null,
											});
										}
									});

									test('nextVersionRecommended', (t: TestContext) =>
									{
										let actual = nextVersionRecommended(oldVersion, options);

										let expected = {} as any;

										if (typeof options.bump === 'string' && !releaseTypesIsPre(options.bump))
										{
											expected.actual = {
												newVersion: semverIncrement(oldVersion, options.bump)
											}
										}

										if (expected.actual)
										{
											t.assert.partialDeepStrictEqual(actual, expected.actual);
										}

										t.assert.snapshot({
											sv,
											options,
											actual,
										});
									});

								})

							}

						})

					}

				})

			}

		})

	}

})

describe('versionStyle', () =>
{

	const oldVersion = '264.1120.1744-1';

	test('should keep semver increment when versionStyle is not set', () =>
	{
		const actual = nextVersionRecommended('1.2.3');

		assert.strictEqual(actual.newVersion, '1.2.4');
	});

	test('should increment daily version when old version matches the style', () =>
	{
		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
		});

		assert.strictEqual(actual.newVersion, '264.1120.1744-2');
	});

	test('should reset daily increment when requested', () =>
	{
		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
			resetDailyIncrement: true,
		});

		/** 重設後遞增號回到 1，且不再沿用舊版本的日期時間 */
		assert.match(actual.newVersion, /^\d{3}\.\d{4}\.\d{4}-1$/);
		assert.notStrictEqual(actual.newVersion, oldVersion);
	});

	test('should generate a fresh version when old version is not in the style', () =>
	{
		const actual = nextVersionRecommended('1.2.3', {
			versionStyle: EnumVersionStyle.JetbrainsShortMD,
		});

		assert.strictEqual(analyzeVersionStyles(actual.newVersion).priorityStyle, EnumVersionStyle.JetbrainsShortMD);
	});

	test('should handle style versions that are not valid semver', () =>
	{
		/** 0005 為前導零數字，semver.parse 會回傳 null，風格模式不得依舊版本推斷預發行資訊 */
		const actual = nextVersionRecommended('264.1120.0005-1', {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
		});

		assert.strictEqual(actual.newVersion, '264.1120.0005-2');
	});

	test('should disable daily version suffix when preid is enabled', () =>
	{
		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
			preid: 'beta',
		});

		/** 停用遞增後綴後只保留一段連字號：`-beta` 而非 `-1-beta` */
		assert.match(actual.newVersion, /^\d{3}\.\d{3,4}\.\d{4}-beta$/);
		assert.strictEqual(actual.newVersion.split('-').length, 2);
	});

	test('should fall back to defaultPreid when preid is not given', () =>
	{
		const actual = nextVersionRecommended(oldVersion, {
			versionStyle: EnumVersionStyle.JetbrainsDateTime,
			defaultPreid: 'dev',
		});

		assert.match(actual.newVersion, /^\d{3}\.\d{3,4}\.\d{4}-dev$/);
	});

})

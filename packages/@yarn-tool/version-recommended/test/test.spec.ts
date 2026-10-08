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

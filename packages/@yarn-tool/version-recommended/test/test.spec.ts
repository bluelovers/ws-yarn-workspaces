//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { INextVersionRecommendedOptions, releaseTypes } from '../lib/types';
import { nextVersionRecommended } from '../lib/nextVersionRecommended';
import { detectPreidByVersion, handleOptions, releaseTypesIsPre } from '../lib/handleOptions';
import { parse, ReleaseType } from 'semver';
import { inc as semverIncrement } from 'semver';
import { nextVersionRecommendedByPackageFindUp } from '../lib/pkg';

beforeAll(async () =>
{

});

describe('nextVersionRecommendedByPackageFindUp', () =>
{
	describe.each([...releaseTypes])('bump: %j', (bump) =>
	{
		if (bump)
		{
			test(`bump: ${bump}`, () =>
			{
				let actual = nextVersionRecommendedByPackageFindUp({
					bump,
				});

				expect(actual).toHaveProperty('bump', bump)
			})

			test(`flag: ${bump}`, () =>
			{
				let actual = nextVersionRecommendedByPackageFindUp({
					[bump]: true,
				});

				expect(actual).toHaveProperty('bump', bump)
			})
		}
	})
})

describe('version', () =>
{

	test.skip(`dummy`, () => {});

	describe.each([
		'5.5.0-dev.20240225+rev.2',
		'5.5.0-dev.20240225',
		'5.5.0-20240225',
		'5.5.0',
	])('%s', (oldVersion) => {

		const sv = parse(oldVersion);

		describe.each([...releaseTypes, void 0])('bump: %j', (bump) => {

			describe.each([
				'dev',
				'next',
				'beta',
				'55',
				void 0,
			])('preid: %j', (preid) =>
			{

				describe.each([
					0,
					1,
					'0',
					'1',
					void 0,
					false,
					true,
				])('identifierBase: %j', (identifierBase) =>
				{
					let options: INextVersionRecommendedOptions;

					beforeEach(() => {
						options = {
							bump,
							preid,
							identifierBase,
						} as any;
					})

					test('handleOptions', () =>
					{
						expect({
							['with oldVersion']: handleOptions(options, oldVersion),
							['without']: handleOptions(options),
						}).toMatchSnapshot();
					});

					test('detectPreidByVersion', () =>
					{
						let actual = detectPreidByVersion(oldVersion);

						let ex = expect({
							['with options']: detectPreidByVersion(oldVersion, options),
							['without']: detectPreidByVersion(oldVersion),
						});

						if (sv.prerelease?.length)
						{
							ex.toMatchSnapshot();
						}
						else
						{
							ex.toStrictEqual({
								['with options']: null,
								['without']: null,
							});
						}
					});

					test('nextVersionRecommended', () =>
					{
						let actual = nextVersionRecommended(oldVersion, options);

						let expected = {} as any;

						if (typeof options.bump === 'string' && !releaseTypesIsPre(options.bump))
						{
							expected.actual = {
								newVersion: semverIncrement(oldVersion, options.bump)
							}
						}

						expect({
							sv,
							options,
							actual,
						}).toMatchSnapshot(expected);
					});

				})

			})

		})

	})

})

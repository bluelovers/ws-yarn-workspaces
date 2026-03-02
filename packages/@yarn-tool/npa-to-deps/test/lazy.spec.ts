import { basename, extname } from 'path';
import { npaToDepsValue } from '../index';
import { parseSimpleSemVerRange } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';
import { _actualNpaToDepsValue } from './lb/util';

describe(`should return semver`, () =>
{

	[
		'botkit@jonchurch/botkit#multi-hears',
		'botkit@12',
		'botkit@github:jonchurch/botkit#multi-hears',
	].forEach((input) =>
	{

		test(input, () =>
		{
			let actual = _actualNpaToDepsValue(input);

			expect(actual).toMatchSnapshot();

			expect(actual.depsResult.semver.length).toBeGreaterThanOrEqual(1);

			expect(actual.depsResult).toHaveProperty('semver', expect.any(String));
		});

	});

});

describe(`should return undefined`, () =>
{

	[
		'botkit',
		'botkit@^12',
	].forEach((input) =>
	{

		test(input, () =>
		{

			let actual = _actualNpaToDepsValue(input);

			expect(actual).toMatchSnapshot();

			expect(actual.depsResult).toMatchSnapshot({
				semver: void 0,
				fetchQuery: true,
			});

		});

	});

});

describe(`alias`, () =>
{

	[
		'botkit@npm:foo',
		'botkit@npm:foo@next',
		'botkit@npm:foo@12',
		'botkit@npm:foo@^12',
	].forEach((input) =>
	{

		test(input, () =>
		{

			let actual = npaToDepsValue(input);

			expect(actual).toMatchSnapshot();

		});

	});

});

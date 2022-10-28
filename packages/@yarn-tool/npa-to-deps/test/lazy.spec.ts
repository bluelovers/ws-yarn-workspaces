import { basename, extname } from 'path';
import { npaToDepsValue } from '../index';

describe(`should return semver`, () =>
{

	[
		'botkit@jonchurch/botkit#multi-hears',
		'botkit@12',
	].forEach((input) =>
	{

		test(input, () =>
		{

			let actual = npaToDepsValue(input);

			expect(actual.semver.length).toBeGreaterThanOrEqual(1);

			expect(actual).toHaveProperty('semver', expect.any(String));

			expect(actual).toMatchSnapshot();

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

			let actual = npaToDepsValue(input);

			expect(actual).toMatchSnapshot({
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

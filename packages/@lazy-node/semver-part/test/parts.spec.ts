import { inspect } from 'util';
import { versionToParts, partsToVersion } from '..';

describe(`versionToParts`, () =>
{

	([
		[
			'42.6.7.9.3-alpha',
			['42', '6', '7.9.3-alpha'],
		],
		[
			'9.8.7',
		],
		[
			'1.2.3-alpha.7',
		],
		[
			'1.2.4-beta.0',
		],
		[
			'9.3-alpha',
		],
		[
			'9',
		],
	] as [string, string[]?][]).forEach(tastCase => {

		test(inspect(tastCase[0]), () =>
		{

			let actual = versionToParts(tastCase[0]);
			let expected = tastCase[1];

			if (typeof expected !== 'undefined')
			{
				expect(actual).toStrictEqual(expected);
			}

			expect(actual.length).toBeGreaterThanOrEqual(1);

			expect(partsToVersion(actual)).toStrictEqual(tastCase[0]);

			expect(actual).toMatchSnapshot();
		});

	})

})


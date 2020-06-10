import { inspect } from "util";
import { versionToParts, partsToVersion } from '..';
import { Options } from 'semver';
import { ICompareReturnType, compare } from '../lib/compare';

describe(`compare`, () =>
{

	([
		[
			['3-alpha', '3-alpha'],
		],
		[
			['3-alpha', '3-prealpha'],
		],
		[
			['4-alpha', '3-prealpha'],
		],
		[
			['3-alpha', '4-prealpha'],
		],
		[
			['7.9.3-alpha', '7.9.3-alpha'],
		],
		[
			['7.9.3-alpha', '7.9.3-prealpha'],
		],
		[
			['7.9.4-alpha', '7.9.3-prealpha'],
		],
		[
			['7.9.3-alpha', '7.9.4-prealpha'],
		],
		[
			['9.3-alpha', '9.3-alpha'],
		],
		[
			['9.3-alpha', '9.3-prealpha'],
		],
		[
			['9.4-alpha', '9.3-prealpha'],
		],
		[
			['9.3-alpha', '9.4-prealpha'],
		],
		[
			['3', '3'],
		],
		[
			['4', '3'],
		],
		[
			['3', '4'],
		],
	] as [[string, string, (boolean | Options)?], ICompareReturnType?][]).forEach(tastCase => {

		test(inspect(tastCase[0]), () =>
		{

			let actual = compare(...tastCase[0]);
			let expected = tastCase[1];

			if (typeof expected !== 'undefined')
			{
				expect(actual).toStrictEqual(expected);
			}

			expect(actual).toMatchSnapshot();
		});

	})

})

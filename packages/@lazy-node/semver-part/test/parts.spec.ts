import { inspect } from 'util';
import { versionToParts, partsToVersion } from '..';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

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

		test(inspect(tastCase[0]), (t) =>
		{

			let actual = versionToParts(tastCase[0]);
			let expected = tastCase[1];

			if (typeof expected !== 'undefined')
			{
				assert.deepStrictEqual(actual, expected);
			}

			assert.ok(actual.length >= 1);

			assert.deepStrictEqual(partsToVersion(actual), tastCase[0]);

			t.assert.snapshot(actual);
		});

	})

})

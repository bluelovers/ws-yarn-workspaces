import { handleOptions } from '../lib/lerna/util';
import { inspect } from 'util';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';


describe(`describe`, () =>
{
	[
		null,
		void 0,
		false,
		true,
	].forEach(tagPrefix => {

		test(`tagPrefix: ${inspect(tagPrefix)}`, () =>
		{
			let actual = handleOptions({
				tagPrefix,
				type: tagPrefix,
				changelogPreset: tagPrefix,
			} as any);

			assert.strictEqual(actual.type, 'independent');
			assert.ok(actual.changelogPreset.includes('conventional-changelog-bluelovers'));
			assert.strictEqual(actual.tagPrefix, 'v');

		});

	});

})

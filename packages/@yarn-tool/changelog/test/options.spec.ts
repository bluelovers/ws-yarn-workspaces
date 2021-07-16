import { handleOptions } from '../lib/lerna/util';
import { inspect } from 'util';


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

			expect(actual).toMatchObject({
				type: 'independent',
				changelogPreset: expect.stringContaining('conventional-changelog-bluelovers'),
				tagPrefix: 'v',
			});

		});

	});

})

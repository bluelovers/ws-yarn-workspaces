//@noUnusedParameters:false

import { basename, extname } from 'path';
import { parseResolutionOrDescriptor } from '../index';

describe(basename(__filename, extname(__filename)), () =>
{
	[
		`@strictsoftware/typedoc-plugin-monorepo@npm:0.2.2`,
		`dts-bundle-generator@https://github.com/bluelovers/dts-bundle-generator.git#commit=2d724ed8a70fea6875699553ebc9173546e6a2e7`,
		`@strictsoftware/typedoc-plugin-monorepo@patch:@strictsoftware/typedoc-plugin-monorepo@npm%3A0.2.2#./.patches/@strictsoftware/typedoc-plugin-monorepo.patch::version=0.2.2&hash=916087&locator=%40yarnpkg%2Fgatsby%40workspace%3Apackages%2Fgatsby`,
	].forEach(rawInput => {
		test(rawInput, () =>
		{
			let actual = parseResolutionOrDescriptor(rawInput);
			expect(actual).toMatchSnapshot();

		});
	})

})

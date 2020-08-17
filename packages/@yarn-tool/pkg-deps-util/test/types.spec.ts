import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';

describe(`packageNameToTypes`, () =>
{

	test(`@next/typescript@^1.3.1`, () =>
	{

		let actual = packageNameToTypes(`@next/typescript@^1.3.1`);

		expect(actual).toHaveProperty('name', '@types/next__typescript');

		expect(actual).toMatchSnapshot();

	});

})

import { packageNameToTypes } from '../lib/packageNameToTypes';

describe(`packageNameToTypes`, () =>
{

	test(`@next/typescript@^1.3.1`, () =>
	{

		let actual = packageNameToTypes(`@next/typescript@^1.3.1`);

		expect(actual).toHaveProperty('name', '@types/next__typescript');

		expect(actual).toMatchSnapshot();

	});

	test(`@types/typescript@^1.3.1`, () =>
	{

		let actual = packageNameToTypes(`@types/typescript@^1.3.1`);

		expect(actual).toHaveProperty('name', '@types/typescript');

		expect(actual).toMatchSnapshot();

	});

})

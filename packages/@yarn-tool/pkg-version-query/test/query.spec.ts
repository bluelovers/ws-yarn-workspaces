import { parseVersionByNpmPackageArg } from '../lib/queryVersionByNpmPackageArg';

describe(`parseVersionByNpmPackageArg`, () =>
{

	test(`typescript@>= 1 & < 2`, () =>
	{

		expect(parseVersionByNpmPackageArg(`typescript@>= 1 & < 2`)).toMatchSnapshot();

	});

	test(`typescript@1`, () =>
	{

		expect(parseVersionByNpmPackageArg(`typescript@1`)).toMatchSnapshot();

	});

	test(`typescript`, () =>
	{

		expect(parseVersionByNpmPackageArg(`typescript`)).toMatchSnapshot();

	});

})

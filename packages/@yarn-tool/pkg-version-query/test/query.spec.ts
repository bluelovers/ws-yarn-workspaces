import { describe, test } from 'node:test';

import { parseVersionByNpmPackageArg } from '../lib/queryVersionByNpmPackageArg';

describe(`parseVersionByNpmPackageArg`, () =>
{

	test(`typescript@>= 1 & < 2`, (t) =>
	{

		t.assert.snapshot(parseVersionByNpmPackageArg(`typescript@>= 1 & < 2`));

	});

	test(`typescript@1`, (t) =>
	{

		t.assert.snapshot(parseVersionByNpmPackageArg(`typescript@1`));

	});

	test(`typescript`, (t) =>
	{

		t.assert.snapshot(parseVersionByNpmPackageArg(`typescript`));

	});

})

//@noUnusedParameters:false

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { handleOptions, IOptionsFindUpPathsWorkspaces } from '../index';
import { findUpPathsRuntime } from 'find-up-paths';

before(async () =>
{

});

test(`ignoreCurrentPackage:true`, () =>
{
	const runtime = handleOptions({
		ignoreCurrentPackage: true,
	});

	const file = 'jest.config.js';

	let actual = findUpPathsRuntime(file, runtime);

	console.dir(actual);

	assert.deepStrictEqual(runtime.path.dirname(actual.result), runtime.rootData.root);

});

test(`ignoreCurrentPackage:false`, () =>
{
	const runtime = handleOptions({
		ignoreCurrentPackage: false,
	});

	const file = 'jest.config.js';

	let actual = findUpPathsRuntime(file, runtime);

	console.dir(actual);

	assert.deepStrictEqual(runtime.path.dirname(actual.result), runtime.rootData.pkg);

});

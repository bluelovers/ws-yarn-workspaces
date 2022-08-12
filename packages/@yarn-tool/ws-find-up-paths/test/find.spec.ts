//@noUnusedParameters:false

import { handleOptions, IOptionsFindUpPathsWorkspaces } from '../index';
import { findUpPathsRuntime } from 'find-up-paths';

beforeAll(async () =>
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

	expect(runtime.path.dirname(actual.result)).toStrictEqual(runtime.rootData.root);

});

test(`ignoreCurrentPackage:false`, () =>
{
	const runtime = handleOptions({
		ignoreCurrentPackage: false,
	});

	const file = 'jest.config.js';

	let actual = findUpPathsRuntime(file, runtime);

	console.dir(actual);

	expect(runtime.path.dirname(actual.result)).toStrictEqual(runtime.rootData.pkg);

});

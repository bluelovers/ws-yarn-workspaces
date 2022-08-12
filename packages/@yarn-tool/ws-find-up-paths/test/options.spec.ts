//@noUnusedParameters:false

import { handleOptions } from '../index';

beforeAll(async () =>
{

});

const baseExpectedRuntimeBase = {
	cwd: expect.any(String),
	stopPath: expect.any(Array),
}

const baseExpectedRuntime = {
	...baseExpectedRuntimeBase,
	opts: {
		...baseExpectedRuntimeBase,
	},
	path: expect.anything(),
	rootData: {
		cwd: expect.any(String),
		pkg: expect.any(String),
		ws: expect.any(String),
		root: expect.any(String),
	},
}

test(`ignoreCurrentPackage`, () =>
{

	let actual = handleOptions({
		ignoreCurrentPackage: true,
	});

	expect(actual).toMatchSnapshot(baseExpectedRuntime);

	expect(actual).toHaveProperty('opts.ignoreCurrentPackage', true);
	expect(actual).toHaveProperty('opts.includeCurrentDirectory', false);

});

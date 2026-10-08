//@noUnusedParameters:false

import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { basename, extname } from 'path';
import { checkDependenciesExistsAll } from '../index';
import { IPackageJson } from '@ts-type/package-dts/package-json';

before(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{
	let pkg: IPackageJson;

	before(async () =>
	{
		pkg = {
			dependencies: {
				"tslib": "^2"
			},
			devDependencies: {
				"tslib": "^2",
				"@types/node": "^18.7.13",
			},
			peerDependencies: {
				"tslib": "^2"
			},
			optionalDependencies: {
				"tslib": "^2"
			}
		}
	});

	test(`test`, (t) =>
	{
		t.assert.snapshot(checkDependenciesExistsAll(pkg, "tslib"));
		t.assert.snapshot(checkDependenciesExistsAll(pkg, "@types/node"));
	});

})

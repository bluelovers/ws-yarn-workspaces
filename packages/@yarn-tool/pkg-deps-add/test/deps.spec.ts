//@noUnusedParameters:false

import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { basename, extname } from 'path';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { addDependencies, addDependenciesIfNotExists } from '../index';

before(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{
	let pkg: IPackageJson;

	before(async () => {
		pkg = {
			dependencies: {
				"tslib": "^2"
			}
		}
	});

	test(`addDependenciesIfNotExists`, (t) =>
	{

		let actual = addDependenciesIfNotExists(pkg, 'tslib2', '^2.3.1');

		assert.strictEqual(pkg.dependencies?.tslib2, '^2.3.1');
		t.assert.snapshot(actual);

		addDependencies(pkg, 'tslib', '^2.3.1', {});

		assert.strictEqual(pkg.dependencies?.tslib, '^2');

		addDependencies(pkg, 'tslib', '^2.3.1', {}, true);

		assert.strictEqual(pkg.dependencies?.tslib, '^2.3.1');

	});

})

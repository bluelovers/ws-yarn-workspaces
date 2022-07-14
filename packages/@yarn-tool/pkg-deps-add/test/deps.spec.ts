//@noUnusedParameters:false

import { basename, extname } from 'path';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { addDependencies, addDependenciesIfNotExists } from '../index';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{
	let pkg: IPackageJson;

	beforeAll(async () => {
		pkg = {
			dependencies: {
				"tslib": "^2"
			}
		}
	});

	test(`addDependenciesIfNotExists`, () =>
	{

		let actual = addDependenciesIfNotExists(pkg, 'tslib2', '^2.3.1');

		expect(pkg).toHaveProperty('dependencies.tslib2', '^2.3.1');
		expect(actual).toMatchSnapshot();

		addDependencies(pkg, 'tslib', '^2.3.1', {});

		expect(pkg).toHaveProperty('dependencies.tslib', '^2');

		addDependencies(pkg, 'tslib', '^2.3.1', {}, true);

		expect(pkg).toHaveProperty('dependencies.tslib', '^2.3.1');

	});

})

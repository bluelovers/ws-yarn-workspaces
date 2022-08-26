//@noUnusedParameters:false

import { basename, extname } from 'path';
import { checkDependenciesExistsAll } from '../index';
import { IPackageJson } from '@ts-type/package-dts/package-json';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{
	let pkg: IPackageJson;

	beforeAll(async () =>
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

	test(`test`, () =>
	{
		expect(checkDependenciesExistsAll(pkg, "tslib")).toMatchSnapshot();
		expect(checkDependenciesExistsAll(pkg, "@types/node")).toMatchSnapshot();
	});

})

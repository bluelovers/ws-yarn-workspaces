import IPackageJson from '@ts-type/package-dts/package-json';
import FastGlob from '@bluelovers/fast-glob';
import { basename, join } from 'path';
import { readJSONSync } from 'fs-extra';
import { npmCheckUpdates } from '../lib/update/npmCheckUpdates';
import { __ROOT_WS } from '../../../../__root_ws';

jest.setTimeout(60 * 1000);

describe(`should not update`, () =>
{

	[
		">= 1",
		"> 1",
		"= 1",
		"< 1",
		"<= 1",
		"^1 | ^2",
		"^1 & ^2",
		"next",
		"latest",
		"*",
	].forEach(version => {

		const name = "@types/node";
		const field = "devDependencies";

		test(version, async () =>
		{

			let json_old: IPackageJson = {
				[field]: {
					[name]: version,
				},
			};

			let actual = await npmCheckUpdates({}, {
				json_old,
			})

			expect(actual.json_new[field]).toHaveProperty(name, version);
			expect(actual).toMatchSnapshot();


		});

	});

})

describe(`should update`, () =>
{

	FastGlob.sync([
		'*.json'
	], {
		cwd: join(__ROOT_WS, 'test', 'fixtures', 'ncu-update'),
		absolute: true,
	})
		.forEach(file => {

			test(basename(file), async () => {

				let json_old: IPackageJson = readJSONSync(file);

				let actual = await npmCheckUpdates({}, {
					json_old,
				})

				expect(actual.json_new)
					.not.toStrictEqual(json_old)
				;

			})

		})
	;

})

describe(`should not update json`, () =>
{

	FastGlob.sync([
			'*.json'
		], {
			cwd: join(__ROOT_WS, 'test', 'fixtures', 'ncu-keep'),
			absolute: true,
		})
		.forEach(file =>
		{

			test(basename(file), async () =>
			{

				let json_old: IPackageJson = readJSONSync(file);

				let actual = await npmCheckUpdates({}, {
					json_old,
				})

				expect(actual.json_new)
					.toStrictEqual(json_old)
				;

			})

		})
	;

})

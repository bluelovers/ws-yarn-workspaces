import IPackageJson from '@ts-type/package-dts/package-json';
import { npmCheckUpdates } from '../lib/update';
import FastGlob from '@bluelovers/fast-glob';
import { basename, join } from 'path';
import { readJSONSync } from 'fs-extra';

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
	].forEach(version => {

		const name = "@types/node";
		const field = "devDependencies";

		test(version, async (done) =>
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

			return done();
		});

	});

})

describe(`should update`, () =>
{

	FastGlob.sync([
		'*.json'
	], {
		cwd: join(__dirname, 'fixtures', 'update'),
		absolute: true,
	})
		.forEach(file => {

			test(basename(file), async (done) => {

				let json_old: IPackageJson = readJSONSync(file);

				let actual = await npmCheckUpdates({}, {
					json_old,
				})

				expect(actual.json_new)
					.not.toStrictEqual(json_old)
				;

				return done();
			})

		})
	;

})

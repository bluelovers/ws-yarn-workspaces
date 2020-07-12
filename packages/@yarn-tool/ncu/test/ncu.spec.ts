import IPackageJson from '@ts-type/package-dts/package-json';
import { npmCheckUpdates } from '../lib/update';

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

import { wsPkgListable } from '..';

test(`wsPkgListable`, () =>
{

	let actual = wsPkgListable();
	let expected;

	let matcher = expect.arrayContaining([
		expect.objectContaining({
			name: expect.any(String),
			version: expect.any(String),
			"private": expect.any(Boolean),
			location: expect.any(String),
		}),
	]);

	expect(actual).toMatchObject(matcher);

});



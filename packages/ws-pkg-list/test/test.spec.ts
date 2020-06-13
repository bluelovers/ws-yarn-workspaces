import { wsPkgListable, globFilterListable } from '..';
import { name } from '../package.json';

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


test(`globFilterListable`, () =>
{
	let listable = wsPkgListable();

	let actual = globFilterListable(listable, name);
	let expected;

	let matcher = expect.arrayContaining([
		expect.objectContaining({
			name: expect.any(String),
			version: expect.any(String),
			"private": expect.any(Boolean),
			location: expect.any(String),
		}),
	]);

	expect(actual).toHaveLength(1)
	expect(actual.length).toBeLessThan(listable.length)

	expect(actual).toMatchObject(matcher);

	expect(actual[0]).toHaveProperty('name', name)

});

/**
 * Created by user on 2020/4/9.
 */

import { getLifecycle, entryToList } from '../index';
import { ILifecycleEntry } from '../lib/types';

describe('should lifecycle any script name', function ()
{
	[
		'yy',
		'pretitter',
	].forEach(name => {
		it(name, function ()
		{
			let actual = getLifecycle(name);

			expect(actual).toMatchObject({
				name,
				before: [
					`pre${name}`
				],
				after: [
					`post${name}`
				],
			})

			expect(entryToList(actual)).toContainEqual(name);

			expect(actual.ignoreSelf).not.toBeTruthy();
			expect(actual).toMatchSnapshot();
			expect(entryToList(actual)).toMatchSnapshot();
		});
	});
});

it('install', function ()
{
	let name = 'install';
	let actual = getLifecycle(name);

	expect(actual).toMatchObject({
		name,
		before: [
			"preinstall",
		],
		after: [
			"postinstall",
			"prepublish",
			"prepare",
			"preshrinkwrap",
			"shrinkwrap",
			"postshrinkwrap",
		],
	})

	expect(entryToList(actual)).toContainEqual(name);

	expect(actual).toMatchSnapshot();
	expect(entryToList(actual)).toMatchSnapshot();
});

it('pack', function ()
{
	let name = 'pack';
	let actual = getLifecycle(name);

	expect(actual).toMatchObject({
		name,
		ignoreSelf: true,
		before: [
			"prepublish",
			"prepare",
			"prepack",
		],
		after: [
			"postpack"
		],
	})

	expect(actual).toMatchSnapshot();
	expect(entryToList(actual)).not.toContainEqual(name);
	expect(entryToList(actual)).toMatchSnapshot();

	let actual2 = entryToList(actual, true)

	expect(actual2).toContainEqual(name);
	expect(actual2).toMatchSnapshot();

});

it('publish', function ()
{
	let name = 'publish';
	let actual = getLifecycle(name);

	expect(actual).toMatchObject({
		name,
		before: [
			"prepublish",
			"prepare",
			"prepublishOnly",
			"prepack",
			"postpack",
		],
		after: [
			"postpublish"
		],
	})

	expect(entryToList(actual)).toContainEqual(name);

	expect(actual).toMatchSnapshot();
	expect(entryToList(actual)).toMatchSnapshot();
});

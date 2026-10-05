/**
 * Created by user on 2020/4/9.
 */

import { getLifecycle, entryToList } from '../index';
import { ILifecycleEntry } from '../lib/types';

describe('should lifecycle any script name', function ()
{
	/**
	 * 以任意（未註冊）腳本名稱驗證預設 pre/post 推導規則，
	 * 覆蓋一般腳本與已存在的 pre 腳本名稱這兩種邊界情況。
	 *
	 * Verifies the default pre/post derivation with arbitrary (unregistered) script
	 * names, covering both a normal name and an existing `pre*` script name.
	 */
	([
		'yy',
		'pretitter',
	] as const).forEach(name => {
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
	/**
	 * install 生命週期應依序包含 postinstall 之後的 prepublish/prepare/shrinkwrap 系列。
	 *
	 * The install lifecycle should list the prepublish/prepare/shrinkwrap series
	 * after postinstall.
	 */
	let name = 'install' as const;
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
	/**
	 * pack 生命週期的 ignoreSelf 為 true（npm pack 不執行 pack 腳本），
	 * 因此預設清單不含 'pack'；再以 includeSelf=true 驗證可強制納入主腳本。
	 *
	 * The pack lifecycle sets ignoreSelf: true (npm pack does not run a `pack` script),
	 * so the default list omits 'pack'; passing includeSelf=true verifies the main
	 * script can still be forced back in.
	 */
	let name = 'pack' as const;
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
	/**
	 * publish 生命週期在 prepublishOnly 與 postpublish 之間還需帶入
	 * prepack/postpack 等打包前後鉤子，此測試固定該順序以防回歸。
	 *
	 * The publish lifecycle must also include the prepack/postpack hooks around
	 * prepublishOnly and postpublish; this test pins that order against regressions.
	 */
	let name = 'publish' as const;
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

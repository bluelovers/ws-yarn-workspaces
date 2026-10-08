/**
 * Created by user on 2020/4/9.
 */

import { getLifecycle, entryToList } from '../index';
import { ILifecycleEntry } from '../lib/types';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isDeepStrictEqual } from 'node:util';

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
		it(name, function (t)
		{
			let actual = getLifecycle(name);

			assert.strictEqual(actual.name, name);
			assert.deepStrictEqual(actual.before, [
				`pre${name}`
			]);
			assert.deepStrictEqual(actual.after, [
				`post${name}`
			])

			assert.ok(entryToList(actual).some(v => isDeepStrictEqual(v, name)));

			assert.ok(!actual.ignoreSelf);
			t.assert.snapshot(actual);
			t.assert.snapshot(entryToList(actual));
		});
	});
});

it('install', function (t)
{
	/**
	 * install 生命週期應依序包含 postinstall 之後的 prepublish/prepare/shrinkwrap 系列。
	 *
	 * The install lifecycle should list the prepublish/prepare/shrinkwrap series
	 * after postinstall.
	 */
	let name = 'install' as const;
	let actual = getLifecycle(name);

	assert.strictEqual(actual.name, name);
	assert.deepStrictEqual(actual.before, [
		"preinstall",
	]);
	assert.deepStrictEqual(actual.after, [
		"postinstall",
		"prepublish",
		"prepare",
		"preshrinkwrap",
		"shrinkwrap",
		"postshrinkwrap",
	])

	assert.ok(entryToList(actual).some(v => isDeepStrictEqual(v, name)));

	t.assert.snapshot(actual);
	t.assert.snapshot(entryToList(actual));
});

it('pack', function (t)
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

	assert.strictEqual(actual.name, name);
	assert.strictEqual(actual.ignoreSelf, true);
	assert.deepStrictEqual(actual.before, [
		"prepublish",
		"prepare",
		"prepack",
	]);
	assert.deepStrictEqual(actual.after, [
		"postpack"
	])

	t.assert.snapshot(actual);
	assert.ok(!entryToList(actual).some(v => isDeepStrictEqual(v, name)));
	t.assert.snapshot(entryToList(actual));

	let actual2 = entryToList(actual, true)

	assert.ok(actual2.some(v => isDeepStrictEqual(v, name)));
	t.assert.snapshot(actual2);

});

it('publish', function (t)
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

	assert.strictEqual(actual.name, name);
	assert.deepStrictEqual(actual.before, [
		"prepublish",
		"prepare",
		"prepublishOnly",
		"prepack",
		"postpack",
	]);
	assert.deepStrictEqual(actual.after, [
		"postpublish"
	])

	assert.ok(entryToList(actual).some(v => isDeepStrictEqual(v, name)));

	t.assert.snapshot(actual);
	t.assert.snapshot(entryToList(actual));
});

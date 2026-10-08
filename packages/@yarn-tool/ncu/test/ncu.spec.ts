import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import IPackageJson from '@ts-type/package-dts/package-json';
import FastGlob from '@bluelovers/fast-glob';
import { basename, join } from 'path';
import { readJSONSync } from 'fs-extra';
import { npmCheckUpdates } from '../lib/update/npmCheckUpdates';
import { __ROOT_WS } from '../../../../__root_ws';

/*
 * 原 `jest.setTimeout(60 * 1000);` 在 node:test 中無全域對應 API，
 * 已改為各 test 呼叫的 `{ timeout: 60 * 1000 }` 選項，以保留 60 秒逾時語意。
 * Original `jest.setTimeout(60 * 1000);` has no global equivalent in node:test;
 * migrated to the per-test `{ timeout: 60 * 1000 }` option to preserve the 60s timeout semantics.
 */

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

		test(version, { timeout: 60 * 1000 }, async (t) =>
		{

			let json_old: IPackageJson = {
				[field]: {
					[name]: version,
				},
			};

			let actual = await npmCheckUpdates({}, {
				json_old,
			})

			assert.strictEqual(actual.json_new[field][name], version);
			t.assert.snapshot(actual);


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

			test(basename(file), { timeout: 60 * 1000 }, async () => {

				let json_old: IPackageJson = readJSONSync(file);

				let actual = await npmCheckUpdates({}, {
					json_old,
				})

				assert.notDeepStrictEqual(actual.json_new, json_old)
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

			test(basename(file), { timeout: 60 * 1000 }, async () =>
			{

				let json_old: IPackageJson = readJSONSync(file);

				let actual = await npmCheckUpdates({}, {
					json_old,
				})

				assert.deepStrictEqual(actual.json_new, json_old)
				;

			})

		})
	;

})

//@noUnusedParameters:false

import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';

import { join } from 'path';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { readFileSync } from 'fs';
import { checkResolutionsUpdate } from '../lib/update/checkResolutionsUpdate';
import { pathExistsSync } from 'fs-extra';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

before(async () =>
{

});

describe(`checkResolutionsUpdate`, () =>
{
	const dir = join(__TEST_YARNLOCK, 'ncu');

	_forEachVersionTags().forEach(ver =>
	{
		const file = join(dir, ver as any, 'yarn.lock');

		pathExistsSync(file) && test(ver as any, async (t) =>
		{
			const name = "@types/node" as const;

			const content = readFileSync(file).toString();

			let actual = await checkResolutionsUpdate({
				[name]: "^1.0.10",
			}, content, {});

			console.dir(actual.deps3);
			console.dir(actual.yarnlock_changed);
			console.dir(actual.update_list);

			/*
			 * 原 `expect(actual).toMatchSnapshot({ ... })` 的 property matchers
			 * （expect.any / expect.anything）在 node:test 無對應 API，
			 * 改以等效 assert 表達各路徑的比對語意，其餘仍交由快照比對：
			 * Jest property matchers (expect.any / expect.anything) have no node:test
			 * equivalent; each path is expressed via equivalent assertions below,
			 * while the full value is still covered by the snapshot.
			 */
			assert.ok(Array.isArray(actual.deps));
			assert.strictEqual(actual.deps[0]?.name, name);
			assert.strictEqual(typeof actual.deps[0]?.version_new, 'string');

			assert.strictEqual(typeof actual.deps2?.[name], 'string');

			assert.strictEqual(actual.deps3?.[name]?.name, name);
			assert.strictEqual(typeof actual.deps3?.[name]?.version_new, 'string');

			assert.ok(Array.isArray(actual.update_list));
			assert.strictEqual(typeof actual.yarnlock_changed, 'boolean');
			assert.ok(actual.yarnlock_new_obj != null);
			assert.ok(actual.yarnlock_old_obj != null);

			t.assert.snapshot(actual);

		});
	});

})

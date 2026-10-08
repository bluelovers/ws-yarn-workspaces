//@noUnusedParameters:false

import assert from 'node:assert/strict';
import { describe, test, before } from 'node:test';
import { join } from 'path';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs';
import { parseYarnLockRawV1Root, stringifyYarnLockRawV1 } from '../lib/v1';
import { parseYarnLockRawV2Root, stringifyYarnLockRawV2 } from '../lib/v2';
import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

before(async () =>
{

});

describe(`parseYarnLockRaw`, () =>
{
	const dir = join(__TEST_YARNLOCK);

	_forEachVersionTags().forEach(ver =>
	{
		const file = join(dir, ver as any, 'yarn.lock');
		let fn: typeof parseYarnLockRawV1Root | typeof parseYarnLockRawV2Root
		let fn2: typeof stringifyYarnLockRawV1 | typeof stringifyYarnLockRawV2

		switch (ver)
		{
			case 'v2':
			case 'v3':
				fn = parseYarnLockRawV2Root;
				fn2 = stringifyYarnLockRawV2;
				break;
			default:
				fn = parseYarnLockRawV1Root;
				fn2 = stringifyYarnLockRawV1;
				break;
		}

		pathExistsSync(file) && test(ver as any, async (t: test.TestContext) =>
		{
			const content = readFileSync(file).toString();

			t.assert.equal(typeof content, 'string');

			let actual = fn(content);
			let actual2 = detectYarnLockVersionByObject(actual);

			const expected2 = EnumDetectYarnLock[ver];

			t.assert.deepStrictEqual(actual2, expected2)
			t.assert.snapshot(actual2);

			t.assert.strictEqual((actual as any).object, undefined);

			const content2 = fn2(actual);

			t.assert.deepStrictEqual(content2, content)

		});
	});

})

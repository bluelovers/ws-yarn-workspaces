//@noUnusedParameters:false

import { basename, dirname, extname, join } from 'path';
import {
	detectYarnLockVersion,
	_tryParse,
	detectYarnLockVersionByDir,
	detectYarnLockVersionByFile,
	detectYarnLockVersionByParsed,
} from '@yarn-tool/detect-yarnlock-version';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { sync as FastGlob } from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { _yarnLockParseCore, yarnLockParse } from '@yarn-tool/yarnlock-parse';
import { yarnLockStringify } from '../index';
import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';
import yarnLockParsedToRawJSON from '@yarn-tool/yarnlock-parsed-to-json';
import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';

before(async () =>
{

});

describe(`version`, () =>
{

	_forEachVersionTags().forEach(ver =>
	{
		describe(ver as any, () =>
		{
			const dir = join(__TEST_YARNLOCK, ver as any);

			FastGlob([
				'**/*.lock',
			], {
				cwd: dir,
			}).forEach(name =>
			{
				const file = join(dir, name);
				const buf = readFileSync(file).toString();

				const rawObject = yarnLockParse(buf);

				test(name, (t) =>
				{

					let actual = yarnLockStringify(rawObject);
					let expected = EnumDetectYarnLock[ver];

					assert.deepStrictEqual(detectYarnLockVersion(actual), expected);

					assert.deepStrictEqual(actual, buf);

					const rawObject2 = yarnLockParse(actual);

					assert.deepStrictEqual(detectYarnLockVersionByParsed(rawObject2), expected);

					let actual2 = yarnLockStringify(rawObject2);

					assert.strictEqual((rawObject2 as any).data?.object, undefined);
					assert.deepStrictEqual(rawObject2, rawObject);
					assert.deepStrictEqual(actual2, actual);

					t.assert.snapshot(actual.slice(0, 120 * 3));

				});
			})
		})

	});

})

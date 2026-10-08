//@noUnusedParameters:false

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { basename, extname, join } from 'path';
import {
	detectYarnLockVersion,
	detectYarnLockVersionByFile,

} from '@yarn-tool/detect-yarnlock-version';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { readFileSync } from 'fs';
import fromContent from '../lib/fromContent';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';
import { sync as FastGlob } from '@bluelovers/fast-glob';

before(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
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
				const file = join(__TEST_YARNLOCK, ver as any, name);
				const buf = readFileSync(file);

				let actual = fromContent(buf);

				test(name, (t) =>
				{
					assert.deepStrictEqual(actual.verType, EnumDetectYarnLock[ver]);

					if (ver === 'v1')
					{
						assert.ok(actual.isV1())
						assert.ok(!actual.isV2())
					}
					else
					{
						assert.ok(actual.isV2())
						assert.ok(!actual.isV1())
					}

					let output = actual.stringify();

					assert.deepStrictEqual(detectYarnLockVersion(output), EnumDetectYarnLock[ver]);

					t.assert.snapshot(output.slice(0, 160));
				});

				(ver !== 'v1') && test(`${name} check iterator`, () =>
				{
					for (const row of actual.iteratorRaw())
					{
						try
						{
							// @ts-ignore
							actual._normalize(row.raw, row.key);
						}
						catch (e)
						{
							console.dir(row);
							throw e
						}
					}
				})
			});
		});

	});

})

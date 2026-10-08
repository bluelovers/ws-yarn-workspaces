//@noUnusedParameters:false

import { basename, extname, join } from 'path';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import yarnLockParse from '../index';
import { readFileSync } from 'fs';
import {
	_detectYarnLockVersionWithMetadataCore
} from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionWithMetadata';
import { _getMetadataVersionCore } from '@yarn-tool/detect-yarnlock-version/lib/util';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';
import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';

before(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{

	_forEachVersionTags().forEach(ver => {

		const file = join(__TEST_YARNLOCK, ver as any, 'yarn.lock');
		const buf = readFileSync(file);

		test(ver as any, (t) =>
		{

			let actual = yarnLockParse(buf);

			assert.deepStrictEqual(actual.verType, EnumDetectYarnLock[ver]);

			if (ver !== 'v1')
			{
				assert.deepStrictEqual(_detectYarnLockVersionWithMetadataCore(_getMetadataVersionCore(actual.meta)), EnumDetectYarnLock[ver]);
			}

			t.assert.snapshot(actual);

		});

	});

})

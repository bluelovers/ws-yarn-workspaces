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

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{

	_forEachVersionTags().forEach(ver => {

		const file = join(__TEST_YARNLOCK, ver, 'yarn.lock');
		const buf = readFileSync(file);

		test(ver, () =>
		{

			let actual = yarnLockParse(buf);

			expect(actual.verType).toStrictEqual(EnumDetectYarnLock[ver]);

			if (ver !== 'v1')
			{
				expect(_detectYarnLockVersionWithMetadataCore(_getMetadataVersionCore(actual.meta))).toStrictEqual(EnumDetectYarnLock[ver]);
			}

			expect(actual).toMatchSnapshot();

		});

	});

})

//@noUnusedParameters:false

import { basename, extname, join } from 'path';
import {
	detectYarnLockVersion,
	detectYarnLockVersionByFile,

} from '@yarn-tool/detect-yarnlock-version';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { readFileSync } from 'fs';
import fromContent from '../lib/fromContent';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{

	(<(keyof typeof EnumDetectYarnLock)[]>[
		'v1',
		'v2',
		'v3',
	]).forEach(ver =>
	{

		const file = join(__TEST_YARNLOCK, ver, 'yarn.lock');
		const buf = readFileSync(file);

		test(ver, () =>
		{

			let actual = fromContent(buf);

			expect(actual.verType).toStrictEqual(EnumDetectYarnLock[ver]);

			if (ver === 'v1')
			{
				expect(actual.isV1()).toBeTruthy()
				expect(actual.isV2()).toBeFalsy()
			}
			else
			{
				expect(actual.isV2()).toBeTruthy()
				expect(actual.isV1()).toBeFalsy()
			}

			let output = actual.stringify();

			expect(detectYarnLockVersion(output)).toStrictEqual(EnumDetectYarnLock[ver]);

			expect(output.slice(0, 160)).toMatchSnapshot();

		});

	});

})

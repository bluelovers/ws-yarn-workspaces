//@noUnusedParameters:false

import { join } from 'path';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs';
import { checkResolutionsUpdate } from '@yarn-tool/ncu';
import { parseYarnLockRawV1Root } from '../lib/v1';
import { parseYarnLockRawV2Root } from '../lib/v2';
import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

beforeAll(async () =>
{

});

describe(`parseYarnLockRaw`, () =>
{
	const dir = join(__TEST_YARNLOCK);

	_forEachVersionTags().forEach(ver =>
	{
		const file = join(dir, ver, 'yarn.lock');
		let fn: typeof parseYarnLockRawV1Root | typeof parseYarnLockRawV2Root

		switch (ver)
		{
			case 'v2':
			case 'v3':
				fn = parseYarnLockRawV2Root;
				break;
			default:
				fn = parseYarnLockRawV1Root;
				break;
		}

		pathExistsSync(file) && test(ver, async () =>
		{
			const content = readFileSync(file);

			let actual = fn(content);
			let actual2 = detectYarnLockVersionByObject(actual);

			const expected2 = EnumDetectYarnLock[ver];

			expect(actual2).toStrictEqual(expected2)
			expect(actual2).toMatchSnapshot();

		});
	});

})

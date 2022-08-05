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
import { yarnLockParse } from '@yarn-tool/yarnlock-parse';
import { yarnLockStringify } from '../index';
import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

beforeAll(async () =>
{

});

describe(`version`, () =>
{

	(<(keyof typeof EnumDetectYarnLock)[]>[
		'v1',
		'v2',
		'v3',
	]).forEach(ver =>
	{
		describe(ver, () =>
		{
			const dir = join(__TEST_YARNLOCK, ver);

			FastGlob([
				'**/*.lock',
			], {
				cwd: dir,
			}).forEach(name =>
			{
				const file = join(dir, name);
				const buf = readFileSync(file);

				const rawObject = yarnLockParse(buf);

				test(name, () =>
				{

					let actual = yarnLockStringify(rawObject);
					let expected = EnumDetectYarnLock[ver];

					expect(detectYarnLockVersion(actual)).toStrictEqual(expected);

					const rawObject2 = yarnLockParse(actual);

					expect(detectYarnLockVersionByParsed(rawObject2)).toStrictEqual(expected);

					let actual2 = yarnLockStringify(rawObject2);

					expect(rawObject2).toStrictEqual(rawObject);
					expect(actual2).toStrictEqual(actual);

					expect(actual.slice(0, 160)).toMatchSnapshot();

				});
			})
		})

	});

})

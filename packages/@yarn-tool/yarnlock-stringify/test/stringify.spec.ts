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

beforeAll(async () =>
{

});

describe(`version`, () =>
{

	_forEachVersionTags().forEach(ver =>
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
				const buf = readFileSync(file).toString();

				const rawObject = yarnLockParse(buf);

				test(name, () =>
				{

					let actual = yarnLockStringify(rawObject);
					let expected = EnumDetectYarnLock[ver];

					expect(detectYarnLockVersion(actual)).toStrictEqual(expected);

					expect(actual).toStrictEqual(buf);

					const rawObject2 = yarnLockParse(actual);

					expect(detectYarnLockVersionByParsed(rawObject2)).toStrictEqual(expected);

					let actual2 = yarnLockStringify(rawObject2);

					expect(rawObject2).not.toHaveProperty(['data', 'object']);
					expect(rawObject2).toStrictEqual(rawObject);
					expect(actual2).toStrictEqual(actual);

					expect(actual.slice(0, 120 * 3)).toMatchSnapshot();

				});
			})
		})

	});

})

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
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';
import { sync as FastGlob } from '@bluelovers/fast-glob';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
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
				const file = join(__TEST_YARNLOCK, ver, name);
				const buf = readFileSync(file);

				let actual = fromContent(buf);

				test(name, () =>
				{
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

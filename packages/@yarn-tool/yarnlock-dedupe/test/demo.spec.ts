import { join } from "path";
import { readFileSync } from 'fs';
import { fixDuplicates, listDuplicates } from '../index';
import { detectYarnLockVersion, detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { crlf } from 'crlf-normalize';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

const __res = join(__TEST_YARNLOCK, 'dedupe');

describe(`yarnlock-dedupe`, () =>
{
	(<(keyof typeof EnumDetectYarnLock)[]>[
		'v1',
		'v2',
		'v3',
	]).forEach(ver =>
	{

		describe(ver, () =>
		{
			const dir = join(__res, ver);

			const files = FastGlob.sync([
					'*.lock',
				], {
					cwd: dir,
				})
			;

			const expected2 = EnumDetectYarnLock[ver];

			if (!files.length)
			{
				test(`dummy`, () => {})
			}

			files.forEach(file =>
			{
				const yarnlock = crlf(readFileSync(join(dir, file)).toString());

				describe(file, () =>
				{

					test(`listDuplicates`, () =>
					{
						let actual = listDuplicates(yarnlock);

						if (file !== 'meta-only.lock')
						{
							expect(actual.length).toBeGreaterThanOrEqual(1);
						}

						expect(actual).toMatchSnapshot();
					})

					test(`fixDuplicates`, () =>
					{
						let actual = fixDuplicates(yarnlock);

						expect(actual).not.toStrictEqual(yarnlock);

						let actual2 = detectYarnLockVersion(actual);

						expect(actual2).toStrictEqual(expected2)
						expect(actual2).toMatchSnapshot();
					})

				});


			});
		});

	});
})

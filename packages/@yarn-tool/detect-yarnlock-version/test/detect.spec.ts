import { readFileSync } from "fs";
import { join, dirname, basename, extname } from "path";
import detectYarnLockVersion, { _tryParse } from '../lib/detectYarnLockVersion';
import { detectYarnLockVersionByFile, detectYarnLockVersionByDir } from '../lib/detectYarnLockVersionByFile';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import yarnLockParse from '@yarn-tool/yarnlock-parse';
import { _detectYarnLockVersionWithMetadataCore } from '../lib/detectYarnLockVersionWithMetadata';
import { _getMetadataVersionCore } from '../lib/util';
import { sync as FastGlob } from '@bluelovers/fast-glob';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

const __res = __TEST_YARNLOCK;

test(`empty`, () =>
{
	let file = join(__res, 'empty', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = detectYarnLockVersion(buf);
	let expected = EnumDetectYarnLock.unknown;

	expect(actual).toStrictEqual(expected);

	expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
	expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

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
			}).forEach(name => {
				const file = join(dir, name);
				const buf = readFileSync(file);

				test(name, () =>
				{

					let actual = detectYarnLockVersion(buf);
					let expected = EnumDetectYarnLock[ver];

					expect(actual).toStrictEqual(expected);

					expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
					expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

					if (ver !== 'v1')
					{
						expect(_tryParse(buf)).toStrictEqual(expected);
					}

					expect(actual).toMatchSnapshot();

				});
			})
		})

	});

})

describe(`others`, () =>
{
	FastGlob([
		'**/*.lock',
		'!v*/*',
	], {
		cwd: __TEST_YARNLOCK,
	}).forEach(name =>
	{
		const file = join(__TEST_YARNLOCK, name);
		const buf = readFileSync(file);

		test(name, () =>
		{
			let actual = detectYarnLockVersion(buf);

			if (actual && actual !== EnumDetectYarnLock.v1)
			{
				expect(_tryParse(buf)).toStrictEqual(actual);
			}

			expect(actual).toMatchSnapshot();

		});
	})
});

import { readFileSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { detectYarnLockVersion, _detectYarnLockVersionCore, _tryParse } from '../lib/detectYarnLockVersion';
import { detectYarnLockVersionByFile, detectYarnLockVersionByDir } from '../lib/detectYarnLockVersionByFile';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { sync as FastGlob } from '@bluelovers/fast-glob';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

const __res = __TEST_YARNLOCK;

test(`empty`, () =>
{
	let file = join(__res, 'empty', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = _detectYarnLockVersionCore(buf);
	let expected = EnumDetectYarnLock.unknown;

	expect(actual).toHaveProperty('verType', expected);

	expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
	expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

	expect(actual).toMatchSnapshot({
		input: expect.anything(),
	});

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
			}).forEach(name => {
				const file = join(dir, name);
				const buf = readFileSync(file);

				test(name, () =>
				{

					let actual = _detectYarnLockVersionCore(buf);
					let expected = EnumDetectYarnLock[ver];

					expect(actual).toHaveProperty('verType', expected);

					expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
					expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

					if (ver !== 'v1')
					{
						expect(_tryParse(buf)).toStrictEqual(expected);
					}

					expect(actual).toMatchSnapshot({
						input: expect.anything(),
					});

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
			let actual = _detectYarnLockVersionCore(buf);

			if (actual.verType && actual.verType !== EnumDetectYarnLock.v1)
			{
				expect(_tryParse(buf)).toStrictEqual(actual.verType);
			}

			expect(actual).toMatchSnapshot({
				input: expect.anything(),
			});

		});
	})
});

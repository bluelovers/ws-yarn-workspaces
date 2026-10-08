import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFileSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { detectYarnLockVersion, _detectYarnLockVersionCore, _tryParse } from '../lib/detectYarnLockVersion';
import { detectYarnLockVersionByFile, detectYarnLockVersionByDir } from '../lib/detectYarnLockVersionByFile';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { sync as FastGlob } from '@bluelovers/fast-glob';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

const __res = __TEST_YARNLOCK;

test(`empty`, (t) =>
{
	let file = join(__res, 'empty', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = _detectYarnLockVersionCore(buf);
	let expected = EnumDetectYarnLock.unknown;

	assert.strictEqual(actual.verType, expected);

	assert.deepStrictEqual(detectYarnLockVersionByFile(file), expected);
	assert.deepStrictEqual(detectYarnLockVersionByDir(dirname(file)), expected);

	// 原為 property matcher `input: expect.anything()`；node:test 快照不支援 property matchers，改以等效斷言表達
	assert.ok(actual.input != null);
	t.assert.snapshot(actual);

});

describe(`version`, () =>
{

	_forEachVersionTags().forEach(ver =>
	{
		describe(ver as any, () =>
		{
			const dir = join(__TEST_YARNLOCK, ver as any);

			FastGlob([
				'**/*.lock',
			], {
				cwd: dir,
			}).forEach(name => {
				const file = join(dir, name);
				const buf = readFileSync(file);

				test(name, (t) =>
				{

					let actual = _detectYarnLockVersionCore(buf);
					let expected: EnumDetectYarnLock = EnumDetectYarnLock[ver];

					assert.strictEqual(actual.verType, expected);

					assert.deepStrictEqual(detectYarnLockVersionByFile(file), expected);
					assert.deepStrictEqual(detectYarnLockVersionByDir(dirname(file)), expected);

					if (ver !== 'v1')
					{
						assert.deepStrictEqual(_tryParse(buf), expected);
					}

					// 原為 property matcher `input: expect.anything()`；node:test 快照不支援 property matchers，改以等效斷言表達
					assert.ok(actual.input != null);
					t.assert.snapshot(actual);

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

		test(name, (t) =>
		{
			let actual = _detectYarnLockVersionCore(buf);

			if (actual.verType && actual.verType !== EnumDetectYarnLock.v1)
			{
				assert.deepStrictEqual(_tryParse(buf), actual.verType);
			}

			// 原為 property matcher `input: expect.anything()`；node:test 快照不支援 property matchers，改以等效斷言表達
			assert.ok(actual.input != null);
			t.assert.snapshot(actual);

		});
	})
});

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { buildDiff } from '../lib/diff-service';
import yarnLockDiff, { _yarnLockDiffCore } from '../index';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { _handleDiffTable } from '../lib/formatter/buildDiffTable002';
import { stripAnsiValues } from '../lib/formatter/util';

describe(`yarnLockDiff`, () =>
{
	const __res = join(__TEST_YARNLOCK, 'diff');

	const files = FastGlob.sync([
			'**/*.lock',
		], {
			cwd: join(__res, 'a'),
		})
	;

	files.forEach(file =>
	{

		test(file, (t) =>
		{
			const yarnlock_old = readFileSync(join(__res, 'a', file));
			const yarnlock_new = readFileSync(join(__res, 'b', file));

			let actual = _yarnLockDiffCore(yarnlock_old, yarnlock_new, {});

			stripAnsiValues(actual.formatedDiff, true);

			console.dir(actual.formatedDiff);

			assert.strictEqual(actual.table['0'].length, 4);

			// 原本為 toMatchSnapshot({ table: expect.any(Array) })，matcher 改為明確斷言
			// was toMatchSnapshot({ table: expect.any(Array) }); matcher replaced by an explicit assertion
			assert.ok(Array.isArray(actual.table));

			t.assert.snapshot(actual);

			t.assert.snapshot(_handleDiffTable(actual, {
				stripAnsi: true,
			}));
		});

	})
	;

})

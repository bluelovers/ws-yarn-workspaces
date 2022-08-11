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

		test(file, () =>
		{
			const yarnlock_old = readFileSync(join(__res, 'a', file));
			const yarnlock_new = readFileSync(join(__res, 'b', file));

			let actual = _yarnLockDiffCore(yarnlock_old, yarnlock_new, {});

			stripAnsiValues(actual.formatedDiff, true);

			console.dir(actual.formatedDiff);

			expect(actual).toHaveProperty(['table', '0', 'length'], 4);

			expect(actual).toMatchSnapshot({
				table: expect.any(Array),
			});

			expect(_handleDiffTable(actual, {
				stripAnsi: true,
			})).toMatchSnapshot();
		});

	})
	;

})

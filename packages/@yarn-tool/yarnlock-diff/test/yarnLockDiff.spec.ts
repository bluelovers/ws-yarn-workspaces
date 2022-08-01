import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { buildDiff } from '../lib/diff-service';
import yarnLockDiff from '../index';
import { __TEST_YARNLOCK } from '../../../../__root_ws';

describe(`yarnLockDiff`, () =>
{
	const __res = join(__TEST_YARNLOCK, 'diff');

	const files = FastGlob.sync([
			'*.lock',
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

			let actual = yarnLockDiff(yarnlock_old, yarnlock_new, {
				stripAnsi: true,
			});

			expect(actual).toMatchSnapshot();

		});

	})
	;

})

import FastGlob from '@bluelovers/fast-glob';
import { join } from "path";
import { readFileSync } from "fs";
import { buildDiff } from '../lib/diff-service';
import { __TEST_YARNLOCK } from '../../../../__root_ws';

describe(`buildDiff`, () =>
{
	const __res = join(__TEST_YARNLOCK, 'fixtures');

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

			let actual = buildDiff(yarnlock_old, yarnlock_new);

			expect(actual).toMatchSnapshot();

		});

	})
	;

})

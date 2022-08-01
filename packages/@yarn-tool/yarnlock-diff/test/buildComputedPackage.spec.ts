import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { buildComputedPackage } from '../lib/diff-service/buildComputedPackage';
import { __TEST_YARNLOCK } from '../../../../__root_ws';

describe(`buildComputedPackage`, () =>
{
	const __res = join(__TEST_YARNLOCK, 'diff');

	const files = FastGlob.sync([
			'a/*.lock',
			'b/*.lock',
		], {
			cwd: join(__res),
		})
	;

	files.forEach(file =>
	{

		test(file, () =>
		{
			const yarnlock_old = readFileSync(join(__res, file));

			let actual = buildComputedPackage(yarnlock_old);

			expect(actual).toMatchSnapshot();

		});

	})
	;

})

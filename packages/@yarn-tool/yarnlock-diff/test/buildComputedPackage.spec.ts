import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { buildComputedPackage } from '../lib/diff-service/buildComputedPackage';

describe(`buildComputedPackage`, () =>
{
	const __res = join(__dirname, 'fixtures');

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

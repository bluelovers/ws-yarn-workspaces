import { join } from "path";
import FastGlob from '@bluelovers/fast-glob';
import { checkAndReadYarnLockfile } from '..';

describe(`yarn.lock`, () =>
{
	const __res = join(__dirname, 'res');

	FastGlob.sync<string>([
			'*.lock',
			//'!yarn.lock',
		], {
			cwd: __res,
		})
		.forEach(file =>
		{
			const _file = join(__res, file);

			test(file, () =>
			{
				let actual = checkAndReadYarnLockfile(_file);
				let expected;

				//expect(actual).toStrictEqual(expected);
				//expect(actual).toBeInstanceOf(Date);
				expect(actual).toMatchSnapshot();

			});
		})
	;

})

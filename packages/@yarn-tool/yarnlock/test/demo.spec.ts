import { join } from "path";
import FastGlob from '@bluelovers/fast-glob';
import { checkAndParseYarnLockFile } from '../index';
import { __TEST_YARNLOCK } from '../../../../__root_ws';

describe(`yarn.lock`, () =>
{
	const __res = __TEST_YARNLOCK;

	FastGlob.sync<string>([
			'**/*.lock',
			//'!yarn.lock',
		], {
			cwd: __res,
		})
		.forEach(file =>
		{
			const _file = join(__res, file);

			test(file, () =>
			{
				let actual = checkAndParseYarnLockFile(_file);
				let expected;

				//expect(actual).toStrictEqual(expected);
				//expect(actual).toBeInstanceOf(Date);
				expect(actual).toMatchSnapshot();

			});
		})
	;

})

import { join } from "path";
import { readFileSync } from 'fs';
import { listDuplicates, fixDuplicates } from '../index';
import { detectYarnLockVersion, EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { crlf } from 'crlf-normalize';
import { __TEST_YARNLOCK } from '../../../../__root_ws';

const __res = join(__TEST_YARNLOCK, 'dedupe');

const yarnlock_v1 = readFileSync(join(__res, 'v1', 'yarn.lock')).toString();
const yarnlock_v2 = readFileSync(join(__res, 'v2', 'yarn.lock')).toString();

describe(`v1`, () =>
{
	const files = FastGlob.sync([
			'*.lock',
		], {
			cwd: join(__res, 'v1'),
		})
	;

	describe(`listDuplicates`, () =>
	{
		files.forEach(file =>
		{
			test(file, () =>
			{
				let actual = listDuplicates(yarnlock_v1);

				expect(actual.length).toBeGreaterThanOrEqual(1);
				expect(actual).toMatchSnapshot();
			})
		});
	});

	describe(`fixDuplicates`, () =>
	{
		files.forEach(file =>
		{
			test(file, () =>
			{
				let actual = fixDuplicates(yarnlock_v1);

				expect(detectYarnLockVersion(actual)).toStrictEqual(EnumDetectYarnLock.v1);

				expect(actual).not.toStrictEqual(yarnlock_v1);
				expect(actual).toMatchSnapshot();
			})
		});
	});

})

describe(`v2`, () =>
{

	const files = FastGlob.sync([
			'*.lock',
		], {
			cwd: join(__res, 'v2'),
		})
	;

	describe(`listDuplicates`, () =>
	{

		files.forEach(file =>
		{
			test(file, () =>
			{
				const yarnlock_v2 = crlf(readFileSync(join(__res, 'v2', file)).toString());

				let actual = listDuplicates(yarnlock_v2);

				expect(actual.length).toBeGreaterThanOrEqual(0);
				expect(actual).toMatchSnapshot();
			})
		});

	});

	describe(`fixDuplicates`, () =>
	{
		files.forEach(file =>
		{
			test(file, () =>
			{
				const yarnlock_v2 = crlf(readFileSync(join(__res, 'v2', file)).toString());

				let actual = fixDuplicates(yarnlock_v2);

				expect(detectYarnLockVersion(actual)).toStrictEqual(EnumDetectYarnLock.v2);

				expect(actual).not.toStrictEqual(yarnlock_v2);
				expect(actual).toMatchSnapshot();
			})
		});
	});

})

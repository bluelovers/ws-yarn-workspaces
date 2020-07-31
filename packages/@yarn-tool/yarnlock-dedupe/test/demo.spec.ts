import { join } from "path";
import { readFileSync } from 'fs';
import { listDuplicates, fixDuplicates } from '../index';
import { detectYarnLockVersion, EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/index';

const __res = join(__dirname, 'res');

const yarnlock_v1 = readFileSync(join(__res, 'v1', 'yarn.lock'));
const yarnlock_v2 = readFileSync(join(__res, 'v2', 'yarn.lock'));

describe(`v1`, () =>
{

	test(`listDuplicates`, () =>
	{
		let actual = listDuplicates(yarnlock_v1);

		expect(actual.length).toBeGreaterThanOrEqual(1);
		expect(actual).toMatchSnapshot();

	});

	test(`fixDuplicates`, () =>
	{
		let actual = fixDuplicates(yarnlock_v1);

		expect(detectYarnLockVersion(actual)).toStrictEqual(EnumDetectYarnLock.v1);

		expect(actual).not.toStrictEqual(yarnlock_v1);
		expect(actual).toMatchSnapshot();

	});

})

describe(`v2`, () =>
{

	test(`listDuplicates`, () =>
	{
		let actual = listDuplicates(yarnlock_v2);

		expect(actual.length).toBeGreaterThanOrEqual(1);
		expect(actual).toMatchSnapshot();

	});

	test(`fixDuplicates`, () =>
	{
		let actual = fixDuplicates(yarnlock_v2);

		expect(detectYarnLockVersion(actual)).toStrictEqual(EnumDetectYarnLock.berry);

		expect(actual).not.toStrictEqual(yarnlock_v2);
		expect(actual).toMatchSnapshot();

	});

})

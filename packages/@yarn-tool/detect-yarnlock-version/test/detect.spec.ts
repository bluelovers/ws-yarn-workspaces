import { readFileSync } from "fs";
import { join, dirname } from "path";
import detectYarnLockVersion from '../lib/detectYarnLockVersion';
import { detectYarnLockVersionByFile, detectYarnLockVersionByDir } from '../lib/detectYarnLockVersionByFile';
import { EnumDetectYarnLock } from '../lib/types';

const __res = join(__dirname, 'res');

test(`v2 berry`, () =>
{
	let file = join(__res, 'v2', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = detectYarnLockVersion(buf);
	let expected = EnumDetectYarnLock.berry;

	expect(actual).toStrictEqual(expected);

	expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
	expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

});

test(`v1`, () =>
{
	let file = join(__res, 'v1', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = detectYarnLockVersion(buf);
	let expected = EnumDetectYarnLock.v1;

	expect(actual).toStrictEqual(expected);

	expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
	expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

});

test(`empty`, () =>
{
	let file = join(__res, 'empty', 'yarn.lock')
	let buf = readFileSync(file)

	let actual = detectYarnLockVersion(buf);
	let expected = EnumDetectYarnLock.unknown;

	expect(actual).toStrictEqual(expected);

	expect(detectYarnLockVersionByFile(file)).toStrictEqual(expected);
	expect(detectYarnLockVersionByDir(dirname(file))).toStrictEqual(expected);

});

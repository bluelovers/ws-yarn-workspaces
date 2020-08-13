/**
 * Created by user on 2020/6/11.
 */

import { readFileSync, writeFileSync, pathExistsSync } from "fs-extra";
import { parse, stringify } from './parse';
import { IYarnLockfileParseObject, IYarnLockfileParseObjectRow } from './types';
import { join } from "path";
import { BaseEncodingOptions } from "fs";

export function existsYarnLockFile(file: string)
{
	return pathExistsSync(file)
}

export function checkYarnLockFileUnsafeCore(buf: Buffer | string)
{
	return buf?.length > 0
}

export function checkAndReadYarnLockFileUnsafe<T extends Buffer | string = Buffer>(file: string, options?: BaseEncodingOptions & { flag?: string; } | BufferEncoding | null)
{
	if (existsYarnLockFile(file))
	{
		let buf = readFileSync(file, options) as T

		if (checkYarnLockFileUnsafeCore(buf))
		{
			return buf
		}
	}
}

export function checkAndParseYarnLockFile(file: string, printError?: boolean)
{
	let buf = checkAndReadYarnLockFileUnsafe(file)
	if (buf?.length)
	{
		try
		{
			return parse(buf)
		}
		catch (e)
		{
			printError && console.trace(e)
		}
	}
}

export function readYarnLockFile(file: string)
{
	let buf = readFileSync(file)

	return parse(buf)
}

export function writeYarnLockFile(file: string, data: IYarnLockfileParseObject)
{
	return writeFileSync(file, stringify(data))
}

export interface IFsYarnLockReturnType
{
	yarnlock_file: string;
	yarnlock_exists: boolean;
	yarnlock_old: string;
}

/**
 * @deprecated
 */
export function fsYarnLock(root: string): IFsYarnLockReturnType
{
	let yarnlock_file = join(root, 'yarn.lock');

	let yarnlock_exists = pathExistsSync(yarnlock_file);

	let yarnlock_old = yarnlock_exists && readFileSync(yarnlock_file, 'utf8') || null;

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

export function fsYarnLockSafe(root: string): IFsYarnLockReturnType
{
	const yarnlock_file = join(root, 'yarn.lock');

	const yarnlock_old = checkAndReadYarnLockFileUnsafe<string>(yarnlock_file, 'utf8');

	const yarnlock_exists = checkYarnLockFileUnsafeCore(yarnlock_old);

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

export default fsYarnLockSafe

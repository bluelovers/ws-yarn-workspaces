/**
 * Created by user on 2020/6/11.
 */

import { readFileSync, writeFileSync, pathExistsSync } from "fs-extra";
import { parse, stringify } from './parse';
import { IYarnLockfileParseObject, IYarnLockfileParseObjectRow } from './types';
import { join } from "path";

export function existsYarnLockfile(file: string)
{
	return pathExistsSync(file)
}

export function checkYarnLockfileUnsafeCore(buf: Buffer | string)
{
	return buf.length > 0
}

export function checkAndReadYarnLockfileUnsafe(file: string)
{
	if (existsYarnLockfile(file))
	{
		let buf = readFileSync(file)

		if (checkYarnLockfileUnsafeCore(buf))
		{
			return buf
		}
	}
}

export function checkAndReadYarnLockfile(file: string)
{
	let buf = checkAndReadYarnLockfileUnsafe(file)
	if (buf?.length)
	{
		try
		{
			return parse(buf)
		}
		catch (e)
		{
			console.trace(e)
		}
	}
}

export function readYarnLockfile(file: string)
{
	let buf = readFileSync(file)

	return parse(buf)
}

export function writeYarnLockfile(file: string, data: IYarnLockfileParseObject)
{
	return writeFileSync(file, stringify(data))
}

export interface IFsYarnLockReturnType
{
	yarnlock_file: string;
	yarnlock_exists: boolean;
	yarnlock_old: string;
}

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

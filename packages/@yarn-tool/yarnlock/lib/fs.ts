/**
 * Created by user on 2020/6/11.
 */

import { readFileSync, writeFileSync, pathExistsSync } from "fs-extra";
import { parse, stringify } from './parse';
import { IYarnLockfileParseObject, IYarnLockfileParseObjectRow } from './types';

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
	if (buf)
	{
		try
		{
			return parse(buf)
		}
		catch (e)
		{

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

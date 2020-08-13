import { checkAndReadYarnLockFileSafe } from './readYarnLockFile';
import { parse } from '@yarn-tool/yarnlock/lib/parse';
import { readFileSync } from 'fs-extra';
import { notEmpty } from './notEmpty';

export function checkAndParseYarnLockFile(file: string, printError?: boolean)
{
	let buf = checkAndReadYarnLockFileSafe(file)
	if (notEmpty(buf))
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

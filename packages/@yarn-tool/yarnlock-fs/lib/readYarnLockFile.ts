import { pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs-extra';
import { notEmpty } from './notEmpty';
import { IBufferOrString, IOptionsReadFile } from './types';

export function checkAndReadYarnLockFileSafe<T extends IBufferOrString = Buffer>(file: string, options?: IOptionsReadFile | BufferEncoding | null,)
{
	if (pathExistsSync(file))
	{
		let buf = readFileSync(file, options) as T

		if (notEmpty(buf))
		{
			return buf
		}
	}
}

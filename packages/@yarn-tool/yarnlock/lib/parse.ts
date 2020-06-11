/**
 * Created by user on 2020/6/11.
 */

import { IYarnLockfileParseObject, IYarnLockfileParseFull, IYarnLockfileParseObjectRow } from './types';
import lockfile from '@yarnpkg/lockfile';

export function parseFull(text: string | Buffer): IYarnLockfileParseFull
{
	return lockfile.parse(text.toString())
}

export function parse(text: string | Buffer)
{
	return parseFull(text).object
}

export function stringify(json: IYarnLockfileParseObject): string
{
	return lockfile.stringify(json)
}

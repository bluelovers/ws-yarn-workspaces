/**
 * Created by user on 2020/6/11.
 */

import { IYarnLockfileParseObject, IYarnLockfileParseFull, IYarnLockfileParseObjectRow } from './types';
import { parse as _parse, stringify as _stringify } from '@yarnpkg/lockfile';

export function parseFull(text: string | Buffer): IYarnLockfileParseFull
{
	return _parse(text.toString())
}

export function parse(text: string | Buffer)
{
	return parseFull(text).object
}

export function stringify(json: IYarnLockfileParseObject): string
{
	return _stringify(json)
}

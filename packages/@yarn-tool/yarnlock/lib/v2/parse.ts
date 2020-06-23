import yarnParsers, { parseSyml, stringifySyml } from '@yarnpkg/parsers';
import { IYarnLockfileParseFull } from '../types';

export function parseFull(text: string | Buffer)
{
	return parseSyml(text.toString())
}


export function stringify(json)
{
	return stringifySyml(json)
}

import { _createCacheKey } from './createCacheKey';
import { getCache } from './cacheAgent';
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';

export function queryVersionCacheRaw(name: string, targetVersion: string = 'latest', options: IOptionsQueryVersion<Options>)
{
	let key = _createCacheKey(name, targetVersion);
	return getCache(options).get(key);
}

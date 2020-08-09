import { _createCacheKey } from './createCacheKey';
import { getCache } from './cacheAgent';

export function queryVersionCacheRaw(name: string, targetVersion: string = 'latest')
{
	let key = _createCacheKey(name, targetVersion);
	return getCache().get(key);
}

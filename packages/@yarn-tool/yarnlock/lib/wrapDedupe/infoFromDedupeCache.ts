import { IInfoFromDedupeCacheReturnType, IWrapDedupeCache } from '../types';

export function infoFromDedupeCache(cache: IWrapDedupeCache): IInfoFromDedupeCacheReturnType
{
	let { yarnlock_changed, yarnlock_old_exists } = cache;

	let { yarnlock_file, yarnlock_exists } = cache.yarnlock_cache;

	return {
		...cache.rootData,
		yarnlock_file,
		yarnlock_old_exists,
		yarnlock_exists,
		yarnlock_changed,
	};
}

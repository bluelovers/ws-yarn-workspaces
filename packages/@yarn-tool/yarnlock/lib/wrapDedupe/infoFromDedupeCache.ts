import { IInfoFromDedupeCacheReturnType, IWrapDedupeCache } from '../types';

/**
 * 自 `wrapDedupe` 的快取 (Cache) 萃取彙整資訊：
 * 把散落於 cache 的根目錄資訊與 yarn.lock 狀態攤平成單一物件，
 * 供 CLI 於結束時回報結果，不必了解快取的內部結構。
 *
 * Extracts a summary from the `wrapDedupe` cache: flattens root info and yarn.lock
 * status scattered across the cache into one object so the CLI can report the outcome
 * without knowing the cache internals.
 *
 * @param cache 管線執行後的快取 / the cache after the pipeline ran
 */
export function infoFromDedupeCache(cache: IWrapDedupeCache): IInfoFromDedupeCacheReturnType
{
	let { yarnlock_changed, yarnlock_old_exists } = cache;

	let { yarnlock_file, yarnlock_exists } = cache.yarnlock_cache;

	/**
	 * 以展開運算子合併根目錄資訊與 yarn.lock 狀態，
	 * 欄位同名時以此處取得的狀態為準，避免快取內的舊值覆蓋。
	 *
	 * Merges root info with yarn.lock status via spread; same-named fields prefer the
	 * values read here so stale cache values cannot override them.
	 */
	return {
		...cache.rootData,
		yarnlock_file,
		yarnlock_old_exists,
		yarnlock_exists,
		yarnlock_changed,
	};
}

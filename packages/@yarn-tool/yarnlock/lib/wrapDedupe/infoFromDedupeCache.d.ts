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
export declare function infoFromDedupeCache(cache: IWrapDedupeCache): IInfoFromDedupeCacheReturnType;

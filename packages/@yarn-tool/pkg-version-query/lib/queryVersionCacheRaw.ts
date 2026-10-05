import { _createCacheKey } from './createCacheKey';
import { getCache } from './cacheAgent';
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';

/**
 * 只讀快取查詢：命中時回傳快取內容，未命中回傳 undefined，
 * 完全不觸碰 npm registry，讓呼叫端得以在真正發起網路請求前先判斷快取狀態。
 *
 * Read-only cache lookup: returns the cached entry when present and undefined otherwise,
 * never touching the npm registry, so callers can inspect the cache state
 * before deciding whether a real network request is needed.
 *
 * @param name 套件名稱 / Package name
 * @param targetVersion 目標版本或範圍，預設 latest / Target version or range, defaults to latest
 * @param options 查詢與快取選項 / Query and cache options
 * @returns 快取中的查詢結果，未命中為 undefined / Cached result, or undefined on a miss
 */
export function queryVersionCacheRaw(name: string, targetVersion: string = 'latest', options: IOptionsQueryVersion<Options>)
{
	let key = _createCacheKey(name, targetVersion);
	return getCache(options).get(key);
}

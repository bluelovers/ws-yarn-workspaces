import Cache from 'lru-cache-fs2';
import { ICachedVersionResult, IOptionsQueryVersion } from './types';
import { Options } from 'package-json';
/**
 * 建立檔案後盾的 LRU 快取 (File-backed LRU Cache) 實例。
 *
 * Creates the file-backed LRU cache instance.
 *
 * @param options 查詢選項，僅取用其中的 cacheAgentOptions / Query options; only cacheAgentOptions is used
 * @returns 新的快取實例 / A fresh cache instance
 */
export declare function initCache(options?: IOptionsQueryVersion<Options>): Cache<string, ICachedVersionResult>;
/**
 * 取得快取實例：優先使用呼叫端自帶的 cacheAgent，
 * 否則以 `??=` 惰性建立並重複使用同一個單例，
 * 讓多處查詢共享同一份磁碟快取而不必各自初始化。
 *
 * Returns the cache instance: a caller-supplied cacheAgent wins, otherwise a
 * module-level singleton is created lazily via `??=` so scattered queries share
 * one disk-backed cache instead of each initialising their own.
 *
 * @param options 查詢選項，可攜帶 cacheAgent / Query options; may carry a custom cacheAgent
 * @returns 快取實例 / The cache instance
 */
export declare function getCache(options?: IOptionsQueryVersion<Options>): Cache<string, ICachedVersionResult>;

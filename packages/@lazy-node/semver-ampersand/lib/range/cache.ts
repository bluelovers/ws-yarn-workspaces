import { LRUCache } from 'lru-cache2';
import { Comparator } from 'semver';

/**
 * 範圍解析結果的 LRU 快取
 * LRU cache for range parsing results
 *
 * 以 1000 為上限，避免同一程序反覆解析不同範圍時無限成長；
 * 鍵包含選項摘要，因此不同選項不會互相污染。
 * Capped at 1000 so repeated parsing of varied ranges cannot grow without
 * bound; the key embeds the option summary, so differing options never
 * contaminate each other.
 */
export const cache = new LRUCache<string, ReadonlyArray<Comparator>>({ max: 1000 });

import { LRUCache } from 'lru-cache2';
import { Comparator } from 'semver';

export const cache = new LRUCache<string, ReadonlyArray<Comparator>>({ max: 1000 });

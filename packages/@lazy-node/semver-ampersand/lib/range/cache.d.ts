import { LRUCache } from 'lru-cache2';
import { Comparator } from 'semver';
export declare const cache: LRUCache<string, readonly Comparator[]>;

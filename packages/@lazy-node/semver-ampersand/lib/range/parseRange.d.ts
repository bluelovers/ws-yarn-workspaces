import { Comparator } from 'semver';
import { IOptions } from '../types';
/**
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 */
export declare function getMemoOpts(options: IOptions): string;
export declare function parseRangeCore(range: string, options: IOptions): ReadonlyArray<Comparator>;
export declare function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>;

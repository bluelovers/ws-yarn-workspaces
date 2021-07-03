import { Comparator } from 'semver';
import { IOptions } from '../types';
/**
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 */
export declare function getMemoOpts(options: IOptions): string;
export declare function normalizeRangeInput(range: string, options: IOptions): string;
export declare function normalizeRangeInputForComparator(range: string, options: IOptions): string[];
export declare function parseRangeCore(range: string, options: IOptions): ReadonlyArray<Comparator>;
/**
 * in loose mode, throw out any that are not valid comparators
 */
export declare function filterRangeListForComparator(rangeList: string[], options: IOptions): string[];
/**
 * if any comparators are the null set, then replace with JUST null set
 * if more than one comparator, remove any * comparators
 * also, don't include the same comparator more than once
 */
export declare function reduceComparatorList(compList: Comparator[]): Comparator[];
export declare function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>;

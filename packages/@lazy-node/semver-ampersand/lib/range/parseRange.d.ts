import { Comparator } from 'semver';
import { IOptions } from '../types';
/**
 * 產生快取鍵所需的選項摘要
 * Build the option summary used as part of the cache key
 *
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 *
 * 只串接「有值」的選項（filter 已過濾掉 falsy），
 * 讓不同選項組合產生不同鍵、相同組合則共用快取。
 * Only truthy options are joined (the filter drops falsy ones), so distinct
 * option combinations get distinct keys while identical ones share the cache.
 *
 * @param options - 解析選項 / Parse options
 * @returns 快取鍵用的選項摘要 / Option summary for the cache key
 */
export declare function getMemoOpts(options: IOptions): string;
/**
 * 把範圍展開成可逐段解析的比較器前驅字串
 * Expand a range into comparator-ready strings before parsing
 *
 * 兩段式展開是必要的：第一段把 caret/tilde/xrange 等語法攤平，
 * 攤平後可能產生重複或 `>=0.0.0` 這類等價寫法，第二段才負責去重與化簡。
 * The two-pass expansion is required: the first pass flattens caret/tilde/
 * xrange syntax, which may yield duplicates or equivalent spellings such as
 * `>=0.0.0`; the second pass then deduplicates and simplifies.
 *
 * @param range - 已正規化的範圍字串 / Normalized range string
 * @param options - 解析選項 / Parse options
 * @returns 化簡後的比較器字串陣列 / Deduplicated comparator strings
 */
export declare function normalizeRangeInputForComparator(range: string, options: IOptions): string[];
/**
 * 解析範圍的核心流程（不含快取）
 * Core range-parsing flow (without caching)
 *
 * @param range - 範圍字串 / Range string
 * @param options - 解析選項 / Parse options
 * @returns 不可變的比較器陣列 / Read-only array of comparators
 */
export declare function parseRangeCore(range: string, options: IOptions): ReadonlyArray<Comparator>;
/**
 * 過濾掉不符合比較器格式的項目
 * Drop entries that do not match comparator syntax
 *
 * in loose mode, throw out any that are not valid comparators
 *
 * @param rangeList - 比較器字串陣列 / Comparator strings
 * @param options - 解析選項 / Parse options
 * @returns 合法的比較器字串陣列 / Valid comparator strings
 */
export declare function filterRangeListForComparator(rangeList: string[], options: IOptions): string[];
/**
 * 合併並化簡比較器清單
 * Merge and simplify a comparator list
 *
 * if any comparators are the null set, then replace with JUST null set
 * if more than one comparator, remove any * comparators
 * also, don't include the same comparator more than once
 *
 * 任意版本比較器 `*`（值為空字串）與其他比較器並存時會被移除，
 * 因為 `* & >=1.0.0` 中的 `*` 不提供任何額外限制。
 * When the "any" comparator `*` (empty-string value) coexists with others it
 * is removed, since `*` in `* & >=1.0.0` adds no restriction.
 *
 * @param compList - 比較器陣列 / Comparator array
 * @returns 化簡後的比較器陣列 / Simplified comparator array
 */
export declare function reduceComparatorList(compList: Comparator[]): Comparator[];
/**
 * 解析範圍字串（含快取）
 * Parse a range string (with caching)
 *
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 *
 * 快取鍵包含選項摘要，因為同一段範圍在 loose / includePrerelease
 * 不同設定下會解析出不同的比較器。
 * The cache key includes the option summary: the same range parses into
 * different comparators under loose / includePrerelease settings.
 *
 * @param range - 範圍字串 / Range string
 * @param options - 解析選項 / Parse options
 * @returns 不可變的比較器陣列 / Read-only array of comparators
 */
export declare function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>;

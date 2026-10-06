"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemoOpts = getMemoOpts;
exports.normalizeRangeInputForComparator = normalizeRangeInputForComparator;
exports.parseRangeCore = parseRangeCore;
exports.filterRangeListForComparator = filterRangeListForComparator;
exports.reduceComparatorList = reduceComparatorList;
exports.parseRange = parseRange;
const cache_1 = require("./cache");
const semver_1 = require("semver");
const detect_1 = require("../comparator/detect");
const re_1 = require("semver/internal/re");
const util_1 = require("./util");
const split_1 = require("../util/split");
const array_hyper_unique_1 = require("array-hyper-unique");
const normalizeRangeInput_1 = require("./normalizeRangeInput");
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
function getMemoOpts(options) {
    return Object.keys(options).filter(k => options[k]).join(',');
}
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
function normalizeRangeInputForComparator(range, options) {
    let rangeList = (0, split_1.splitSpace)(range)
        .map(comp => (0, util_1.parseComparator)(comp, options));
    rangeList = (0, split_1.splitSpace)(rangeList.join(' '))
        // >=0.0.0 is equivalent to *
        .map(comp => (0, util_1.replaceGTE0)(comp, options));
    return (0, array_hyper_unique_1.array_unique_overwrite)(rangeList);
}
/**
 * 解析範圍的核心流程（不含快取）
 * Core range-parsing flow (without caching)
 *
 * @param range - 範圍字串 / Range string
 * @param options - 解析選項 / Parse options
 * @returns 不可變的比較器陣列 / Read-only array of comparators
 */
function parseRangeCore(range, options) {
    range = (0, normalizeRangeInput_1.normalizeRangeInput)(range, options);
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
    let rangeList = normalizeRangeInputForComparator(range, options);
    /**
     * loose 模式才過濾：嚴格模式下無效比較器要讓建構失敗，
     * 寬鬆模式則允許個別條件被忽略（與 semver 行為一致）。
     * Filter only in loose mode: strict mode must fail on invalid comparators,
     * while loose mode tolerates dropping them (same as semver).
     */
    if (options.loose) {
        rangeList = filterRangeListForComparator(rangeList, options);
    }
    let compList = rangeList
        .map(comp => new semver_1.Comparator(comp, options));
    const result = reduceComparatorList(compList);
    return result;
}
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
function filterRangeListForComparator(rangeList, options) {
    const compRe = options.loose ? re_1.re[re_1.t.COMPARATORLOOSE] : re_1.re[re_1.t.COMPARATOR];
    return rangeList.filter(comp => !!comp.match(compRe));
}
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
function reduceComparatorList(compList) {
    const l = compList.length;
    const rangeMap = new Map();
    for (const comp of compList) {
        /**
         * Null Set（<0.0.0-0）代表「沒有任何版本符合」，
         * 其餘條件再寬也無意義，直接短路回傳。
         * A null set (<0.0.0-0) means "nothing matches"; no other condition
         * can widen it, so short-circuit immediately.
         */
        if ((0, detect_1.isNullSet)(comp)) {
            return [comp];
        }
        rangeMap.set(comp.value, comp);
    }
    /**
     * 只有一個以上比較器時才移除 `*`，避免把單純的 `*` 範圍清空。
     * Drop `*` only when more than one comparator remains, so a plain `*`
     * range is not emptied by accident.
     */
    if (rangeMap.size > 1 && rangeMap.has('')) {
        rangeMap.delete('');
    }
    const result = [...rangeMap.values()];
    return result;
}
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
function parseRange(range, options) {
    range = range.trim();
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = getMemoOpts(options);
    const memoKey = `parseRange:${memoOpts}:${range}`;
    const cached = cache_1.cache.get(memoKey);
    if (cached) {
        return cached;
    }
    const result = parseRangeCore(range, options);
    cache_1.cache.set(memoKey, result);
    return result;
}
//# sourceMappingURL=parseRange.js.map
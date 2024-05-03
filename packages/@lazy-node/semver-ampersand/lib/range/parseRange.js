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
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 */
function getMemoOpts(options) {
    return Object.keys(options).filter(k => options[k]).join(',');
}
function normalizeRangeInputForComparator(range, options) {
    let rangeList = (0, split_1.splitSpace)(range)
        .map(comp => (0, util_1.parseComparator)(comp, options));
    rangeList = (0, split_1.splitSpace)(rangeList.join(' '))
        // >=0.0.0 is equivalent to *
        .map(comp => (0, util_1.replaceGTE0)(comp, options));
    return (0, array_hyper_unique_1.array_unique_overwrite)(rangeList);
}
function parseRangeCore(range, options) {
    range = (0, normalizeRangeInput_1.normalizeRangeInput)(range, options);
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
    let rangeList = normalizeRangeInputForComparator(range, options);
    if (options.loose) {
        rangeList = filterRangeListForComparator(rangeList, options);
    }
    let compList = rangeList
        .map(comp => new semver_1.Comparator(comp, options));
    const result = reduceComparatorList(compList);
    return result;
}
/**
 * in loose mode, throw out any that are not valid comparators
 */
function filterRangeListForComparator(rangeList, options) {
    const compRe = options.loose ? re_1.re[re_1.t.COMPARATORLOOSE] : re_1.re[re_1.t.COMPARATOR];
    return rangeList.filter(comp => !!comp.match(compRe));
}
/**
 * if any comparators are the null set, then replace with JUST null set
 * if more than one comparator, remove any * comparators
 * also, don't include the same comparator more than once
 */
function reduceComparatorList(compList) {
    const l = compList.length;
    const rangeMap = new Map();
    for (const comp of compList) {
        if ((0, detect_1.isNullSet)(comp)) {
            return [comp];
        }
        rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
        rangeMap.delete('');
    }
    const result = [...rangeMap.values()];
    return result;
}
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
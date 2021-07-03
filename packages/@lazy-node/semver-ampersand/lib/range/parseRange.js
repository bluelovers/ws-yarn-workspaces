"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRange = void 0;
const tslib_1 = require("tslib");
const cache_1 = require("./cache");
const semver_1 = require("semver");
const detect_1 = require("../comparator/detect");
const re_1 = require("semver/internal/re");
const debug_1 = (0, tslib_1.__importDefault)(require("semver/internal/debug"));
const util_1 = require("./util");
function parseRange(range, options) {
    range = range.trim();
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(options).join(',');
    const memoKey = `parseRange:${memoOpts}:${range}`;
    const cached = cache_1.cache.get(memoKey);
    if (cached) {
        return cached;
    }
    const loose = options.loose;
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re_1.re[re_1.t.HYPHENRANGELOOSE] : re_1.re[re_1.t.HYPHENRANGE];
    range = range.replace(hr, (0, util_1.hyphenReplace)(options.includePrerelease));
    (0, debug_1.default)('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re_1.re[re_1.t.COMPARATORTRIM], re_1.comparatorTrimReplace);
    (0, debug_1.default)('comparator trim', range, re_1.re[re_1.t.COMPARATORTRIM]);
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re_1.re[re_1.t.TILDETRIM], re_1.tildeTrimReplace);
    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re_1.re[re_1.t.CARETTRIM], re_1.caretTrimReplace);
    // normalize spaces
    range = range.split(/\s+/).join(' ');
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
    const compRe = loose ? re_1.re[re_1.t.COMPARATORLOOSE] : re_1.re[re_1.t.COMPARATOR];
    const rangeList = range
        .split(' ')
        .map(comp => (0, util_1.parseComparator)(comp, options))
        .join(' ')
        .split(/\s+/)
        // >=0.0.0 is equivalent to *
        .map(comp => (0, util_1.replaceGTE0)(comp, options))
        // in loose mode, throw out any that are not valid comparators
        .filter(options.loose ? comp => !!comp.match(compRe) : () => true)
        .map(comp => new semver_1.Comparator(comp, options));
    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const l = rangeList.length;
    const rangeMap = new Map();
    for (const comp of rangeList) {
        if ((0, detect_1.isNullSet)(comp)) {
            return [comp];
        }
        rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
        rangeMap.delete('');
    }
    const result = [...rangeMap.values()];
    cache_1.cache.set(memoKey, result);
    return result;
}
exports.parseRange = parseRange;
//# sourceMappingURL=parseRange.js.map
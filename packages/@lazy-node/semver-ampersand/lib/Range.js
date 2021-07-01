"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.SemverRange = void 0;
const tslib_1 = require("tslib");
const range_1 = (0, tslib_1.__importDefault)(require("semver/classes/range"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
const stringifyComparators_1 = require("./util/stringifyComparators");
const semver_1 = (0, tslib_1.__importDefault)(require("semver/classes/semver"));
const class_without_call_parent_constructor_1 = (0, tslib_1.__importDefault)(require("class-without-call-parent-constructor"));
const semver_2 = require("semver");
const options_1 = require("./range/options");
const toRangeString_1 = require("./range/toRangeString");
const assert_1 = require("./util/assert");
const fixComparatorSet_1 = require("./range/fixComparatorSet");
const parseOptionsOrLoose_1 = require("./internal/parseOptionsOrLoose");
class SemverRange extends (0, class_without_call_parent_constructor_1.default)(range_1.default) {
    constructor(rawSource, optionsOrLoose) {
        // skip original semverRange constructor
        super();
        optionsOrLoose = (0, parseOptionsOrLoose_1.parseOptionsOrLoose)(optionsOrLoose);
        let { range, options, set } = this._inherit(rawSource, optionsOrLoose);
        if (typeof rawSource === 'string' && range !== rawSource) {
            this.rawSource = rawSource;
        }
        this._inheritOptions(options);
        if (!set) {
            set = this._buildComparatorsSet(range, options);
        }
        (0, assert_1.assertInvalidComparatorSet)(set, `Invalid SemVer Range: ${range}`);
        set = (0, fixComparatorSet_1.fixComparatorSet)(set, options.unsafeOptimize);
        (0, assert_1.assertInvalidComparatorSet)(set);
        this.raw = range;
        this.set = set;
        this.format();
    }
    _buildComparatorsSet(range, options) {
        let comparatorsSet = range
            .split(/\s*\|\|\s*/)
            // map the range to a 2d array of comparators
            .map(range => this.parseRange.call({
            // avoid false value to be cache key
            options: Object.entries(options).reduce((a, b) => {
                if (b[1]) {
                    a[b[0]] = b[1];
                }
                return a;
            }, {})
        }, range.trim()))
            // throw out any comparator lists that are empty
            // this generally means that it was not a valid range, which is allowed
            // in loose mode, but will still throw if the WHOLE range is invalid.
            .filter(c => c.length);
        return comparatorsSet;
    }
    _inherit(range, options) {
        let set;
        if (range instanceof range_1.default) {
            options = {
                loose: range.loose,
                includePrerelease: range.includePrerelease,
                ...range.options,
                ...options,
            };
            options = (0, options_1._normalizeOptions)(options);
            if ((0, options_1._isSameOptions)(range, options)) {
                set = range.set;
            }
            range = range.raw;
        }
        if (range instanceof semver_2.Comparator) {
            set = [[range]];
            range = range.value;
        }
        else if (range instanceof semver_1.default) {
            range = range.format();
        }
        if ((set === null || set === void 0 ? void 0 : set.length) === 0) {
            (0, assert_1.assertInvalidComparatorSet)(set);
        }
        options = (0, options_1._normalizeOptions)(options);
        range = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range, options);
        return {
            range,
            options,
            set,
        };
    }
    _inheritOptions(options) {
        this.options = options;
        (0, options_1._copyOptions)(this, options);
    }
    format() {
        this.range = (0, stringifyComparators_1.stringifyComparatorsSet)(this.set);
        return this.range;
    }
    /**
     * Return '*' instead of '' so that truthiness works.
     */
    toRangeString() {
        return (0, toRangeString_1.toRangeString)(this.range);
    }
}
exports.SemverRange = SemverRange;
exports.Range = SemverRange;
exports.default = SemverRange;
//# sourceMappingURL=Range.js.map
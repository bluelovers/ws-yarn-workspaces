"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.SemverRange = void 0;
const tslib_1 = require("tslib");
const range_1 = (0, tslib_1.__importDefault)(require("semver/classes/range"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
const stringifyComparators_1 = require("./util/stringifyComparators");
const semver_1 = (0, tslib_1.__importDefault)(require("semver/classes/semver"));
const parse_options_1 = (0, tslib_1.__importDefault)(require("semver/internal/parse-options"));
class SemverRange extends range_1.default {
    constructor(rawSource, optionsOrLoose) {
        optionsOrLoose = (0, parse_options_1.default)(optionsOrLoose);
        let range = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(rawSource, optionsOrLoose);
        if (range instanceof semver_1.default) {
            range = range.format();
        }
        super(range, optionsOrLoose);
        if (typeof rawSource === 'string' && range !== rawSource) {
            this.rawSource = rawSource;
        }
    }
    format() {
        this.range = (0, stringifyComparators_1.stringifyComparatorsSet)(this.set);
        return this.range;
    }
    /**
     * Return '*' instead of '' so that truthiness works.
     */
    toRangeString() {
        return this.range || '*';
    }
}
exports.SemverRange = SemverRange;
exports.Range = SemverRange;
exports.default = SemverRange;
//# sourceMappingURL=Range.js.map
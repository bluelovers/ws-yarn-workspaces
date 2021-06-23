"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.SemverRange = void 0;
const tslib_1 = require("tslib");
const range_1 = (0, tslib_1.__importDefault)(require("semver/classes/range"));
const handleVersionRange_1 = require("./handleVersionRange");
class SemverRange extends range_1.default {
    constructor(rawSource, optionsOrLoose) {
        const range = (0, handleVersionRange_1.handleVersionRange)(rawSource);
        super(range, optionsOrLoose);
        if (typeof rawSource === 'string' && range !== rawSource) {
            this.rawSource = rawSource;
        }
    }
}
exports.SemverRange = SemverRange;
exports.Range = SemverRange;
exports.default = SemverRange;
//# sourceMappingURL=Range.js.map
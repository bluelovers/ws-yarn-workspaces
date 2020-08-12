"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.SemverRange = void 0;
const range_1 = __importDefault(require("semver/classes/range"));
const handleVersionRange_1 = require("./handleVersionRange");
class SemverRange extends range_1.default {
    constructor(rawSource, optionsOrLoose) {
        const range = handleVersionRange_1.handleVersionRange(rawSource);
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
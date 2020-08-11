"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
const range_1 = __importDefault(require("semver/classes/range"));
const handleVersionRange_1 = require("./handleVersionRange");
class Range extends range_1.default {
    constructor(rawRange, optionsOrLoose) {
        const range = handleVersionRange_1.handleVersionRange(rawRange);
        super(range, optionsOrLoose);
        if (typeof rawRange === 'string' && range !== rawRange) {
            this.rawRange = rawRange;
        }
    }
}
exports.Range = Range;
//# sourceMappingURL=Range.js.map
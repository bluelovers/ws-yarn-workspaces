"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
const range_1 = __importDefault(require("semver/classes/range"));
const handleVersionRange_1 = require("./handleVersionRange");
class Range extends range_1.default {
    constructor(rawSource, optionsOrLoose) {
        const range = handleVersionRange_1.handleVersionRange(rawSource);
        super(range, optionsOrLoose);
        if (typeof rawSource === 'string' && range !== rawSource) {
            this.rawSource = rawSource;
        }
    }
}
exports.Range = Range;
exports.default = Range;
//# sourceMappingURL=Range.js.map
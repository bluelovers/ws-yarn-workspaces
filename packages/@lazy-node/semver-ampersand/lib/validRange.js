"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRange = void 0;
const tslib_1 = require("tslib");
const parseOptionsOrLoose_1 = require("./internal/parseOptionsOrLoose");
const Range_1 = (0, tslib_1.__importDefault)(require("./Range"));
const assert_1 = require("./util/assert");
/**
 * Return the valid range or null if it's not valid
 */
function validRange(range, optionsOrLoose) {
    optionsOrLoose = (0, parseOptionsOrLoose_1.parseOptionsOrLoose)(optionsOrLoose);
    if (typeof range !== 'string') {
        throw new TypeError(`range should be string, but got ${range}`);
    }
    if ((0, assert_1.hasInvalidCharacter)(range, optionsOrLoose)) {
        return null;
    }
    try {
        return new Range_1.default(range, optionsOrLoose).toRangeString();
    }
    catch (er) {
        return null;
    }
}
exports.validRange = validRange;
exports.default = validRange;
//# sourceMappingURL=validRange.js.map
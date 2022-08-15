"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRangeSet = void 0;
const const_1 = require("../const");
function stringifyRangeSet(rangeSet) {
    return rangeSet
        .map(a => a.join(' '))
        .join(const_1.separatorDoubleVerticalBar);
}
exports.stringifyRangeSet = stringifyRangeSet;
//# sourceMappingURL=stringifyRangeSet.js.map
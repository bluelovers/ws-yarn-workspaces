"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRangeSet = void 0;
const split_1 = require("../util/split");
const array_hyper_unique_1 = require("array-hyper-unique");
const handleAmpersandAndSpaces_1 = require("../handleAmpersandAndSpaces");
const normalizeRangeInput_1 = require("./normalizeRangeInput");
function buildRangeSet(range, options = {}) {
    range = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range, options);
    let rangeSet = (0, split_1.splitDoubleVerticalBar)(range)
        // map the range to a 2d array of comparators
        .map(range => {
        range = (0, normalizeRangeInput_1.normalizeRangeInput)(range, options);
        return (0, split_1.splitSpace)(range);
    });
    rangeSet = (0, array_hyper_unique_1.array_unique_overwrite)(rangeSet);
    return rangeSet;
}
exports.buildRangeSet = buildRangeSet;
//# sourceMappingURL=buildRangeSet.js.map
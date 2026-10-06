"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRangeSet = stringifyRangeSet;
const const_1 = require("../const");
/**
 * 把二維條件集合組回範圍字串
 * Join a two-dimensional condition set back into a range string
 *
 * 與 stringifyComparatorsSet 的差別在於輸入是「字串」的二維陣列
 * （buildRangeSet 的輸出），而非 Comparator 物件。
 * Unlike stringifyComparatorsSet, the input here is a two-dimensional array of
 * *strings* (the output of buildRangeSet) rather than Comparator objects.
 *
 * @param rangeSet - 二維條件字串集合 / Two-dimensional condition sets
 * @returns 範圍字串 / Range string
 */
function stringifyRangeSet(rangeSet) {
    return rangeSet
        .map(a => a.join(' '))
        .join(const_1.separatorDoubleVerticalBar);
}
//# sourceMappingURL=stringifyRangeSet.js.map
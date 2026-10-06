"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRangeSet = buildRangeSet;
const split_1 = require("../util/split");
const array_hyper_unique_1 = require("array-hyper-unique");
const handleAmpersandAndSpaces_1 = require("../handleAmpersandAndSpaces");
const normalizeRangeInput_1 = require("./normalizeRangeInput");
/**
 * 依 `||` 與空白把範圍切成二維的條件字串集合
 * Split a range into a two-dimensional set of condition strings by `||` and spaces
 *
 * 先處理 ampersand（把 `&` 視為「且」），再切 `||`，
 * 可確保 `a & b || c` 這類混合寫法被切成正確的三段。
 * Ampersand handling (`&` = "AND") runs before splitting on `||`, so mixed
 * input such as `a & b || c` is cut into the right three pieces.
 *
 * @param range - 範圍字串 / Range string
 * @param options - 解析選項 / Parse options
 * @returns 二維的條件字串集合（外層為 `||` 分隔）/ Two-dimensional condition sets (outer level = `||` groups)
 */
function buildRangeSet(range, options = {}) {
    range = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range, options);
    let rangeSet = (0, split_1.splitDoubleVerticalBar)(range)
        // map the range to a 2d array of comparators
        .map(range => {
        range = (0, normalizeRangeInput_1.normalizeRangeInput)(range, options);
        return (0, split_1.splitSpace)(range);
    });
    // 去除重複的 `||` 分支，例如 `a || a` 只需保留一份
    // Drop duplicated `||` branches, e.g. `a || a` only needs one copy
    rangeSet = (0, array_hyper_unique_1.array_unique_overwrite)(rangeSet);
    return rangeSet;
}
//# sourceMappingURL=buildRangeSet.js.map
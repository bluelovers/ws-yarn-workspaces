"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSatisfying = minSatisfying;
const tslib_1 = require("tslib");
const min_satisfying_1 = tslib_1.__importDefault(require("semver/ranges/min-satisfying"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
/**
 * 找出符合範圍的最小版本
 * Find the smallest version that satisfies the range
 *
 * 注意：此處呼叫 handleAmpersandAndSpaces 時不傳選項，
 * 因此 `&` 一律會被視為「且」轉成空白，noAmpersand 在此路徑不生效。
 * Note: handleAmpersandAndSpaces is called without options here, so `&` is
 * always treated as "AND" (converted to a space); `noAmpersand` has no effect
 * on this path.
 *
 * @param versions - 候選版本列表 / Candidate versions
 * @param range - 範圍字串（支援 `&`）/ Range string (`&` supported)
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @returns 最小符合版本，找不到時為 null / Smallest satisfying version, or null when none
 */
function minSatisfying(versions, range, optionsOrLoose) {
    return (0, min_satisfying_1.default)(versions, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.default = minSatisfying;
//# sourceMappingURL=minSatisfying.js.map
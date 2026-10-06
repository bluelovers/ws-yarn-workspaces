"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullSet = isNullSet;
exports.isAny = isAny;
/**
 * 是否為 Null Set（<0.0.0-0，代表沒有任何版本符合）
 * Whether it is a null set (<0.0.0-0, nothing can match)
 *
 * @param c - 比較器 / Comparator
 * @returns 是否為 Null Set / Whether it is a null set
 */
function isNullSet(c) {
    return c.value === "<0.0.0-0" /* EnumSemverVersion.NULL */;
}
/**
 * 是否為任意版本比較器（`*`，值為空字串）
 * Whether it is an "any" comparator (`*`, empty-string value)
 *
 * @param c - 比較器 / Comparator
 * @returns 是否為任意版本 / Whether it matches any version
 */
function isAny(c) {
    return c.value === "" /* EnumSemverVersion.ANY */;
}
//# sourceMappingURL=detect.js.map
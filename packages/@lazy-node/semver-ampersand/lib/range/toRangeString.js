"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRangeString = toRangeString;
/**
 * 把範圍字串轉成永遠可用於真值判斷的形式
 * Turn a range string into a form that is always truthy-testable
 *
 * 空字串代表「任意版本」，但空字串在 JavaScript 中是 falsy，
 * 回傳 `*` 可讓 `if (range.toRangeString())` 的判斷保持直覺。
 * An empty string means "any version" yet is falsy in JavaScript; returning
 * `*` keeps `if (range.toRangeString())` intuitive.
 *
 * @param range - 範圍字串 / Range string
 * @returns 原字串，空字串則回傳 `*` / The original string, or `*` when empty
 */
function toRangeString(range) {
    return range || '*';
}
//# sourceMappingURL=toRangeString.js.map
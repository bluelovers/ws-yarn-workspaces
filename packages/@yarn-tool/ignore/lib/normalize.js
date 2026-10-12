"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._normalize = _normalize;
exports._normalizeLines = _normalizeLines;
exports._normalizeValueOrArray = _normalizeValueOrArray;
exports._stringifyEndOfLine = _stringifyEndOfLine;
const util_1 = require("./util");
const crlf_normalize_1 = require("crlf-normalize");
const options_1 = require("./options");
function _normalize(line) {
    return line.trim();
}
function _normalizeLines(lines) {
    for (let i = 0; i < lines.length; i++) {
        lines[i] = _normalize(lines[i]);
    }
    return lines;
}
function _normalizeValueOrArray(patterns, overwrite) {
    if (typeof patterns === 'string') {
        return _normalize(patterns);
    }
    else if (overwrite) {
        return _normalizeLines((0, util_1._readonlyArrayToMutable)(patterns));
    }
    return patterns.map(_normalize);
}
/**
 * 依計數還原行尾換行字串
 * Restore end-of-line newlines from a count
 *
 * @param count - 要還原的換行數量 / How many newlines to restore
 * @param defaultCount - `count` 不可用時採用的預設值 / Default used when `count` is unusable
 * @param clamp - 內部參數，轉交 `_normalizeEndCount`：`true` 時超出範圍的數字
 *   不改採預設值，而由 `_normalizeEndCount` 收斂到範圍內
 * Internal parameter forwarded to `_normalizeEndCount`: when `true` an
 *   out-of-range number does not take the default and is converged into the
 *   range by `_normalizeEndCount` instead
 */
function _stringifyEndOfLine(count, defaultCount, clamp) {
    count = (0, options_1._normalizeEndCount)(count, defaultCount, clamp);
    return crlf_normalize_1.LF.repeat(count);
}
//# sourceMappingURL=normalize.js.map
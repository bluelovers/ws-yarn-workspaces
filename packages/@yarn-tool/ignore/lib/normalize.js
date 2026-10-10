"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._normalize = _normalize;
exports._normalizeLines = _normalizeLines;
exports._normalizeValueOrArray = _normalizeValueOrArray;
exports._stringifyEndOfLine = _stringifyEndOfLine;
const util_1 = require("./util");
const crlf_normalize_1 = require("crlf-normalize");
const types_1 = require("./types");
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
function _stringifyEndOfLine(count, defaultCount) {
    count = (0, options_1._normalizeEndCount)(count, defaultCount);
    return crlf_normalize_1.LF.repeat(Math.min(types_1.EnumConst.MAX_BLANK_LINES, Math.max(0, count)));
}
//# sourceMappingURL=normalize.js.map
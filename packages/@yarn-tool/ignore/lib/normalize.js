"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._normalize = _normalize;
exports._normalizeLines = _normalizeLines;
exports._normalizeValueOrArray = _normalizeValueOrArray;
exports._omitBlankLines = _omitBlankLines;
exports._stringifyEndOfLine = _stringifyEndOfLine;
const util_1 = require("./util");
const crlf_normalize_1 = require("crlf-normalize");
const types_1 = require("./types");
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
function _omitBlankLines(lines) {
    let startCount = 0;
    let endCount = 0;
    let len = lines.length;
    for (let i = len - 1; i >= 0; i--) {
        if (lines[i].trim() === '') {
            lines.pop();
            endCount++;
        }
        else {
            break;
        }
    }
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            startCount++;
        }
        else {
            break;
        }
    }
    return {
        lines: lines.slice(startCount),
        startCount,
        endCount,
    };
}
function _stringifyEndOfLine(count) {
    if (typeof count !== 'number') {
        count = count ? types_1.EnumConst.MAX_BLANK_LINES : 0;
    }
    return crlf_normalize_1.LF.repeat(Math.min(types_1.EnumConst.MAX_BLANK_LINES, Math.max(0, count)));
}
//# sourceMappingURL=normalize.js.map
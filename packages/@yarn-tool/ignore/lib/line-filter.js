"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._omitBlankLines = _omitBlankLines;
/**
 * 移除行陣列開頭與結尾的空行，並回報兩側各移除了幾行
 * Strip the leading and trailing blank lines, reporting how many were removed on each side
 *
 * 會就地修改傳入的 `lines`（結尾的空行以 `pop()` 移除），
 * 開頭的空行則以 `slice(startCount)` 取出；回傳的兩個計數即為
 * `IgnoreFile` 還原檔案結尾換行所需的 `startCount` / `endCount`。
 * Mutates the given `lines` in place (trailing blanks are popped, leading ones
 * sliced off via `startCount`); the two counts it returns are exactly the
 * `startCount` / `endCount` that `IgnoreFile` uses to restore the newlines.
 */
function _omitBlankLines(lines) {
    let startCount = 0;
    let endCount = 0;
    // lines = _handleValueOrArrayToMutable(lines);
    let len = lines.length;
    for (let i = len - 1; i >= 0; i--) {
        if (lines[i].trim() === '') {
            // (lines as string[]).pop()
            endCount++;
            len--;
        }
        else {
            break;
        }
    }
    for (let i = 0; i < len; i++) {
        if (lines[i].trim() === '') {
            startCount++;
        }
        else {
            break;
        }
    }
    return {
        lines: lines.slice(startCount, len),
        startCount,
        endCount,
    };
}
//# sourceMappingURL=line-filter.js.map
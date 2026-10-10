"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._omitBlankLines = _omitBlankLines;
exports.dedupeIgnorePatterns = dedupeIgnorePatterns;
const array_hyper_unique_1 = require("array-hyper-unique");
const line_token_1 = require("./line-token");
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
 *
 * @param lines - 行陣列
 * @param options - 預留參數：本函式不依賴任何選項，
 * 型別與其他整理步驟一致，只是為了能整袋 {@link IFinalizeIgnoreLinesOptions} 直接傳入
 */
function _omitBlankLines(lines, options) {
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
/**
 * 移除重複的行，只保留最後一筆
 * Remove duplicate lines, keeping only the last occurrence
 *
 * 以「遇到重複時移除先出現者」的方式達成，三種行各有不同規則：
 * - 規則行（Pattern）：同名規則只留下最後出現的那一列，其餘同名列一律捨棄
 * - 註解行（Comment）：預設與規則行一同去重；傳
 *   `disableDedupePatternsComment: true` 時不參與去重，數量與位置都不變
 * - 空行（Blank）：永遠允許重複（`allowDuplicate`），收合與移除首尾交由
 *   `collapseIgnoreBlankLines` / `_omitBlankLines` 另行處理
 * Achieved by removing the earlier entry whenever a duplicate shows up, with a
 * different rule per line type: duplicated rule lines keep only their last
 * occurrence; comment lines are deduplicated the same way by default, and are
 * left untouched when `disableDedupePatternsComment: true` is given; blank lines
 * may always repeat (`allowDuplicate`), while collapsing and stripping them are
 * handled separately by `collapseIgnoreBlankLines` / `_omitBlankLines`.
 *
 * @param lines - 行陣列
 * @param options - 整理選項，見 {@link IFinalizeIgnoreLinesOptions}
 */
function dedupeIgnorePatterns(lines, options) {
    /**
     * `allowDuplicate` 回傳 `true` 即「放行重複」：
     * 預設只放行空行（註解一併去重），指定 `disableDedupePatternsComment`
     * 時改為放行所有非規則行（註解與空行都保留）
     */
    const allowDuplicate = options?.disableDedupePatternsComment ? ((v) => {
        return !(0, line_token_1.lineIsPattern)(v);
    }) : ((v) => {
        return (0, line_token_1.lineIsBlank)(v);
    });
    return (0, array_hyper_unique_1.array_unique)(lines, {
        removeFromFirst: true,
        allowDuplicate,
    });
}
//# sourceMappingURL=line-filter.js.map
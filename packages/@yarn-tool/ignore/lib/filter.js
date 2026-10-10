"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.precedingPattern = precedingPattern;
exports.precedingPattern2 = precedingPattern2;
exports.hasPattern = hasPattern;
const lines_1 = require("./lines");
const normalize_1 = require("./normalize");
const types_1 = require("./types");
/**
 * 取得插入位置前方最近的一條規則，沒有則回傳 `undefined`
 *
 * 空行與註解不算規則，會被略過繼續向前找；
 * 因此「新增」只需比對這一個值，不必走訪整份行陣列去重。
 *
 * @param lines - 行陣列
 * @param index - 插入位置（不含），由此向前搜尋
 */
function precedingPattern(lines, index) {
    for (let i = index - 1; i >= 0; i--) {
        const type = (0, lines_1.lineType)(lines[i]);
        if (type === types_1.EnumLineType.Pattern) {
            return lines[i].trim();
        }
    }
    return undefined;
}
/**
 * 判斷「新增」時是否應略過目前這條規則
 * Decide whether the rule being added should be skipped
 *
 * 由插入位置向前找「最近的一條規則」（跳過空行與註解）：
 * - 與目前規則相同 → `true`，略過不重複插入
 * - 不同、且不屬於本次批次 → `false`，前方已有其他規則，直接插入
 * - 走到開頭都只有本批次的規則 → falsy（`undefined`），一樣直接插入
 *
 * 因此「新增」只需比對這一個結果，不必走訪整份行陣列去重。
 * Searching backwards for the nearest rule (skipping blanks and comments):
 * the same rule returns `true` (skip the duplicate); a different rule outside the
 * batch returns `false`; reaching the start with only in-batch rules returns a
 * falsy `undefined` — both insert. Adding therefore only needs this one result
 * instead of deduping the whole line array.
 *
 * @param lines - 行陣列
 * @param index - 搜尋起點（不含），由插入位置向前
 * @param patterns - 本次批次的規則
 * @param value - 目前要插入的規則
 */
function precedingPattern2(lines, index, patterns, value) {
    for (let i = index - 1; i >= 0; i--) {
        const line = lines[i];
        const type = (0, lines_1.lineType)(line);
        if (type !== types_1.EnumLineType.Blank) {
            if (line === value) {
                return true;
            }
            else if (!patterns.includes(line)) {
                return false;
            }
        }
    }
    return undefined;
}
/**
 * 檢查是否已存在相同規則（忽略前後空白）
 *
 * @param lines - 行陣列
 * @param pattern - 規則
 */
function hasPattern(lines, pattern) {
    const value = (0, normalize_1._normalize)(pattern);
    /**
     * 直接走訪行陣列，避免先以 {@link listPatternsOnly} 建立中間陣列
     */
    return lines.some(v => (0, lines_1.lineType)(v) === types_1.EnumLineType.Pattern && v.trim() === value);
}
//# sourceMappingURL=filter.js.map
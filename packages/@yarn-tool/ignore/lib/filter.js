"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.precedingPattern = precedingPattern;
exports.precedingPattern2 = precedingPattern2;
exports.hasPattern = hasPattern;
const lines_1 = require("./lines");
const normalize_1 = require("./normalize");
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
        if (type === lines_1.EnumLineType.Pattern) {
            return lines[i].trim();
        }
    }
    return undefined;
}
function precedingPattern2(lines, index, patterns, value) {
    for (let i = index - 1; i >= 0; i--) {
        const line = lines[i];
        const type = (0, lines_1.lineType)(line);
        if (type === lines_1.EnumLineType.Pattern) {
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
     * 直接走訪行陣列，避免先以 {@link listPatterns} 建立中間陣列
     */
    return lines.some(v => (0, lines_1.lineType)(v) === lines_1.EnumLineType.Pattern && v.trim() === value);
}
//# sourceMappingURL=filter.js.map
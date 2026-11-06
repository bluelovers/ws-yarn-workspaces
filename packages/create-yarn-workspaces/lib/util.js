"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSamePath = isSamePath;
const path_1 = require("path");
const path_is_same_1 = require("path-is-same");
/**
 * 判斷兩個路徑是否為同一位置
 *
 * @param p1 第一個路徑。
 * @param p2 第二個路徑。
 * @returns 兩路徑相同時為 true；任一為空則直接 false。
 */
function isSamePath(p1, p2) {
    /**
     * 任一輸入為空時無法比較，直接回傳 false 以免 relative() 產生誤判。
     */
    if (!p1 || !p2) {
        return false;
    }
    else if ((0, path_is_same_1.pathIsSame)(p1, p2)) {
        return true;
    }
    /**
     * 字面不相同時再以 relative 判斷，涵蓋結尾斜線或 '.' 等等價寫法。
     */
    let s = (0, path_1.relative)(p1, p2);
    return (s === '.' || s === '');
}
//# sourceMappingURL=util.js.map
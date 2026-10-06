"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStyleBorderless = applyStyleBorderless;
/**
 * 就地 (in-place) 將表格的所有邊框字元設為空字串，並回傳同一實例。
 *
 * 為什麼採用就地修改而非回傳新表格：`cli-table3` 的外觀由
 * `table.options` 於渲染 (render) 時決定，改選項即可讓先前已 push 的
 * 資料列沿用新樣式，不必重新建立與填充表格。
 *
 * Mutates the table in place, setting every border char to an empty string,
 * and returns the same instance.
 *
 * Why mutate instead of returning a new table: `cli-table3` reads its
 * appearance from `table.options` at render time, so updating the options
 * lets rows that were already pushed pick up the new style without
 * rebuilding and refilling the table.
 *
 * @param table - 要套用樣式的 `cli-table3` 表格 / The `cli-table3` table to restyle
 * @returns 同一個表格實例，方便鏈式使用 / The same table instance, for chaining
 */
function applyStyleBorderless(table) {
    Object.assign(table.options, {
        chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: '',
        },
    });
    return table;
}
//# sourceMappingURL=style.js.map
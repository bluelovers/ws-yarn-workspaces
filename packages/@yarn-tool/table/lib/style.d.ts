/**
 * 表格樣式工具：為已建立的表格套用無邊框樣式 (Borderless Style)。
 *
 * Table styling utilities: apply a borderless style to an existing table.
 *
 * Created by user on 2020/6/13.
 */
import { Table } from 'cli-table3';
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
export declare function applyStyleBorderless(table: Table): Table;

/**
 * 移除對照表每個欄位中的 ANSI 色碼（ANSI Escape Code）。
 * Strip ANSI escape codes from every field of a map of rows.
 *
 * @param input 以列為單位的字串對照表 / A map whose values are rows of strings
 * @param overwrite 是否就地改寫原陣列；預設回傳新陣列
 *                  Whether to mutate the original arrays in place; a new array is returned by
 *                  default
 * @returns 已去除色碼的對照表 / The map with escape codes removed
 */
export declare function stripAnsiValues<T extends string[]>(input: Record<any, T>, overwrite?: boolean): T[];

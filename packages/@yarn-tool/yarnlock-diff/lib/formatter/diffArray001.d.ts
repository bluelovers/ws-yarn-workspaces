import { DiffArray } from '@bluelovers/deep-diff';
/**
 * 舊版：把陣列型差異（Array Diff）轉成 `[舊, 新]` 兩欄文字。
 * Legacy: turn an array diff into two columns of text `[old, new]`.
 *
 * 已被 `./diffArray002` 取代——本版本不上色，且 `DiffEdit` 分支的左欄少了一個 `]`。
 * 保留僅供舊版表格 `buildDiffTable001` 使用，請勿在新程式碼引用。
 * Superseded by `./diffArray002` — this version applies no color and the `DiffEdit` branch is
 * missing a `]` in its first column. Kept only for the legacy `buildDiffTable001` table; do not
 * use it in new code.
 *
 * @deprecated 請改用 `./diffArray002` 的 `_diffArray` / Use `_diffArray` from `./diffArray002` instead
 * @param array deep-diff 的陣列差異節點 / The array diff node from deep-diff
 * @returns `[舊內容, 新內容]` 字串對 / A pair of `[old, new]` strings
 */
export declare function _diffArray(array: DiffArray<{}, {}>): [string, string];

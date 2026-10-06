"use strict";
/**
 * Created by user on 2020/6/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeListableRow = normalizeListableRow;
exports.normalizeListable = normalizeListable;
exports.normalizeListableRowExtra = normalizeListableRowExtra;
exports.normalizeListableExtra = normalizeListableExtra;
exports.listableToRecord = listableToRecord;
const upath2_1 = require("upath2");
/**
 * 正規化（Normalize）單一列的路徑，並在缺少 manifestLocation 時自動補齊。
 * Normalize the paths of a single row and fill in `manifestLocation` when missing.
 *
 * @param row 要正規化的列。The row to normalize.
 * @returns 同一列（原地修改後回傳）。The same row, mutated in place.
 */
function normalizeListableRow(row) {
    row.location = (0, upath2_1.normalize)(row.location);
    // 有些來源只帶 location；以 join 推導 package.json 位置，讓下游不必再判斷 undefined。
    // Some sources only provide `location`; derive the `package.json` path via `join` so downstream code need not check for `undefined`.
    if (typeof row.manifestLocation === 'undefined') {
        row.manifestLocation = (0, upath2_1.join)(row.location, 'package.json');
    }
    return row;
}
/**
 * 批量正規化列清單中的每一列。
 * Normalize every row in a list.
 *
 * @param list 待處理的列清單。The list of rows to process.
 * @returns 正規化後的列清單。The normalized rows.
 */
function normalizeListable(list) {
    return list.map((row) => {
        return normalizeListableRow(row);
    });
}
/**
 * 正規化單一列並加上相對於 root 的 prefix（前綴）欄位。
 * Normalize a single row and add a `prefix` field relative to `root`.
 *
 * @param _row 要處理的列。The row to process.
 * @param root 計算相對路徑的基準根目錄。The root used to compute the relative path.
 * @returns 帶有 prefix 的列。The row with `prefix` attached.
 */
function normalizeListableRowExtra(_row, root) {
    let row = normalizeListableRow(_row);
    row.prefix = (0, upath2_1.relative)(root, row.location);
    return row;
}
/**
 * 批量正規化並為每一列加上 prefix 欄位。
 * Normalize every row and add the `prefix` field to each.
 *
 * @param list 待處理的列清單。The list of rows to process.
 * @param root 計算相對路徑的基準根目錄。The root used to compute the relative path.
 * @returns 帶有 prefix 的列清單。The rows with `prefix` attached.
 */
function normalizeListableExtra(list, root) {
    return list.map((row) => {
        return normalizeListableRowExtra(row, root);
    });
}
/**
 * 將列清單轉成以套件名稱為鍵的記錄（Record）物件。
 * Convert a list of rows into a record keyed by package name.
 *
 * @param list 來源列清單；name 需唯一，重複時後者覆蓋前者。Source rows; `name` must be unique, later duplicates overwrite earlier ones.
 * @returns 以 name 為鍵的索引物件。An index object keyed by `name`.
 */
function listableToRecord(list) {
    return list.reduce((a, row) => {
        a[row.name] = row;
        return a;
    }, {});
}
//# sourceMappingURL=util.js.map
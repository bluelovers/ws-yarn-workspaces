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
function normalizeListableRow(row) {
    row.location = (0, upath2_1.normalize)(row.location);
    if (typeof row.manifestLocation === 'undefined') {
        row.manifestLocation = (0, upath2_1.join)(row.location, 'package.json');
    }
    return row;
}
function normalizeListable(list) {
    return list.map((row) => {
        return normalizeListableRow(row);
    });
}
function normalizeListableRowExtra(_row, root) {
    let row = normalizeListableRow(_row);
    row.prefix = (0, upath2_1.relative)(root, row.location);
    return row;
}
function normalizeListableExtra(list, root) {
    return list.map((row) => {
        return normalizeListableRowExtra(row, root);
    });
}
function listableToRecord(list) {
    return list.reduce((a, row) => {
        a[row.name] = row;
        return a;
    }, {});
}
//# sourceMappingURL=util.js.map
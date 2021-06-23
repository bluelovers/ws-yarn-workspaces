"use strict";
/**
 * Created by user on 2020/6/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listableToRecord = exports.normalizeListableExtra = exports.normalizeListableRowExtra = exports.normalizeListable = exports.normalizeListableRow = void 0;
const upath2_1 = require("upath2");
function normalizeListableRow(row) {
    row.location = (0, upath2_1.normalize)(row.location);
    if (typeof row.manifestLocation === 'undefined') {
        row.manifestLocation = (0, upath2_1.join)(row.location, 'package.json');
    }
    return row;
}
exports.normalizeListableRow = normalizeListableRow;
function normalizeListable(list) {
    return list.map((row) => {
        return normalizeListableRow(row);
    });
}
exports.normalizeListable = normalizeListable;
function normalizeListableRowExtra(_row, root) {
    let row = normalizeListableRow(_row);
    row.prefix = (0, upath2_1.relative)(root, row.location);
    return row;
}
exports.normalizeListableRowExtra = normalizeListableRowExtra;
function normalizeListableExtra(list, root) {
    return list.map((row) => {
        return normalizeListableRowExtra(row, root);
    });
}
exports.normalizeListableExtra = normalizeListableExtra;
function listableToRecord(list) {
    return list.reduce((a, row) => {
        a[row.name] = row;
        return a;
    }, {});
}
exports.listableToRecord = listableToRecord;
//# sourceMappingURL=util.js.map
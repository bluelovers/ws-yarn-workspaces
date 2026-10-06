"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameExistsInWorkspaces = nameExistsInWorkspaces;
const listable_1 = require("./listable");
/**
 * 檢查指定名稱是否已存在於目前工作區的套件清單中。
 * Check whether a given name already exists among the packages of the current workspace.
 *
 * @param name 要查核的套件名稱。The package name to look up.
 * @returns 命中的列（Row），找不到時為 undefined。The matched row, or `undefined` when not found.
 */
function nameExistsInWorkspaces(name) {
    // 套件名稱大小寫在 npm 視為不敏感，先統一小寫再比對以避免誤判重複。
    // npm treats package names case-insensitively, so lowercase before comparing to avoid false duplicates.
    name = name.toLowerCase();
    return (0, listable_1.wsPkgListable)()
        .find(entry => entry.name.toLowerCase() === name);
}
//# sourceMappingURL=nameExistsInWorkspaces.js.map
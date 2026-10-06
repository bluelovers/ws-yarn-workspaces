"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = listDuplicates;
const yarn_deduplicate_1 = require("yarn-deduplicate");
/**
 * 列出 yarn.lock v1 中的重複項目，委派給 yarn-deduplicate 實作。
 *
 * Lists duplicated entries in a yarn.lock v1, delegating to yarn-deduplicate.
 *
 * @param yarnlock_old v1 格式的 lockfile 內容 / v1-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 重複項目鍵值的陣列 / an array of duplicated entry keys
 */
function listDuplicates(yarnlock_old, options) {
    return (0, yarn_deduplicate_1.listDuplicates)(yarnlock_old.toString(), options);
}
//# sourceMappingURL=listDuplicates.js.map
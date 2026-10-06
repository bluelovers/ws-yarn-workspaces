"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = listDuplicates;
exports.fixDuplicates = fixDuplicates;
exports.yarnDedupe = yarnDedupe;
const index_1 = require("./index");
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 listDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root listDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
function listDuplicates(yarnlock_old, options) {
    return (0, index_1.listDuplicates)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 fixDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root fixDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
function fixDuplicates(yarnlock_old, options) {
    return (0, index_1.fixDuplicates)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 yarnDedupe。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root yarnDedupe.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
function yarnDedupe(yarnlock_old, options) {
    return (0, index_1.yarnDedupe)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * 彙整上述已棄用函式，維持與根目錄預設匯出相同的表面。
 *
 * Groups the deprecated functions above, keeping the same surface as the root
 * default export.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
const auto = {
    listDuplicates,
    fixDuplicates,
    yarnDedupe,
};
/**
 * 以已棄用的函式物件作為預設匯出。
 *
 * Default export of the deprecated function object.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
exports.default = auto;
//# sourceMappingURL=object.js.map
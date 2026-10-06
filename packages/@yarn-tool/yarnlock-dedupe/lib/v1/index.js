"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = exports.fixDuplicates = void 0;
exports.yarnDedupe = yarnDedupe;
const fixDuplicates_1 = require("./fixDuplicates");
Object.defineProperty(exports, "fixDuplicates", { enumerable: true, get: function () { return fixDuplicates_1.fixDuplicates; } });
const listDuplicates_1 = require("./listDuplicates");
Object.defineProperty(exports, "listDuplicates", { enumerable: true, get: function () { return listDuplicates_1.listDuplicates; } });
/**
 * yarn.lock v1 專用的去重入口，由根目錄依偵測結果分派至此。
 *
 * Dedupe entry point dedicated to yarn.lock v1; the package root dispatches
 * here once the format is detected.
 *
 * @param yarnlock_old v1 格式的 lockfile 內容 / v1-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 */
function yarnDedupe(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    const yarnlock_new = (0, fixDuplicates_1.fixDuplicates)(yarnlock_old, options);
    return {
        /**
         * 執行前的 yarn.lock / the yarn.lock before the run
         */
        yarnlock_old,
        /**
         * 執行後的 yarn.lock / the yarn.lock after the run
         */
        yarnlock_new,
        /**
         * yarn.lock 是否有變動 / whether the yarn.lock changed
         */
        yarnlock_changed: yarnlock_old !== yarnlock_new,
    };
}
/**
 * v1 實作的彙整物件，結構與 v2 保持一致以便根目錄分派。
 *
 * Object grouping the v1 implementation; kept structurally identical to v2 so
 * the root dispatch can treat both uniformly.
 */
const v1 = {
    fixDuplicates: fixDuplicates_1.fixDuplicates,
    listDuplicates: listDuplicates_1.listDuplicates,
    yarnDedupe,
};
exports.default = v1;
//# sourceMappingURL=index.js.map
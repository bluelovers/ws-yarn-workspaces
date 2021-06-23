"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = exports.fixDuplicates = exports.yarnDedupe = void 0;
const fixDuplicates_1 = require("./fixDuplicates");
Object.defineProperty(exports, "fixDuplicates", { enumerable: true, get: function () { return fixDuplicates_1.fixDuplicates; } });
const listDuplicates_1 = require("./listDuplicates");
Object.defineProperty(exports, "listDuplicates", { enumerable: true, get: function () { return listDuplicates_1.listDuplicates; } });
function yarnDedupe(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    const yarnlock_new = (0, fixDuplicates_1.fixDuplicates)(yarnlock_old, options);
    return {
        /**
         * 執行前的 yarn.lock
         */
        yarnlock_old,
        /**
         * 執行後的 yarn.lock
         */
        yarnlock_new,
        /**
         * yarn.lock 是否有變動
         */
        yarnlock_changed: yarnlock_old !== yarnlock_new,
    };
}
exports.yarnDedupe = yarnDedupe;
const v2 = {
    fixDuplicates: fixDuplicates_1.fixDuplicates,
    listDuplicates: listDuplicates_1.listDuplicates,
    yarnDedupe,
};
exports.default = v2;
//# sourceMappingURL=index.js.map
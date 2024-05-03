"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = exports.fixDuplicates = void 0;
exports.yarnDedupe = yarnDedupe;
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
const v1 = {
    fixDuplicates: fixDuplicates_1.fixDuplicates,
    listDuplicates: listDuplicates_1.listDuplicates,
    yarnDedupe,
};
exports.default = v1;
//# sourceMappingURL=index.js.map
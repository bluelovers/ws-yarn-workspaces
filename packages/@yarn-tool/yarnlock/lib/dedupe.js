"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnDedupe = exports.fixDuplicates = exports.listDuplicates = void 0;
const yarn_deduplicate_1 = require("yarn-deduplicate");
const parse_1 = require("./parse");
function listDuplicates(yarnlock_old, options) {
    if (typeof yarnlock_old !== 'string') {
        yarnlock_old = parse_1.stringify(yarnlock_old);
    }
    return yarn_deduplicate_1.listDuplicates(yarnlock_old);
}
exports.listDuplicates = listDuplicates;
function fixDuplicates(yarnlock_old, options) {
    if (typeof yarnlock_old !== 'string') {
        yarnlock_old = parse_1.stringify(yarnlock_old);
    }
    return yarn_deduplicate_1.fixDuplicates(yarnlock_old);
}
exports.fixDuplicates = fixDuplicates;
function yarnDedupe(yarnlock_old, options) {
    let yarnlock_new = fixDuplicates(yarnlock_old, options);
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
exports.default = yarnDedupe;
//# sourceMappingURL=dedupe.js.map
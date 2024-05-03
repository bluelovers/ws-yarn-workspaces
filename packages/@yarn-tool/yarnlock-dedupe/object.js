"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = listDuplicates;
exports.fixDuplicates = fixDuplicates;
exports.yarnDedupe = yarnDedupe;
const index_1 = require("./index");
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
/**
 * @deprecated
 */
function listDuplicates(yarnlock_old, options) {
    return (0, index_1.listDuplicates)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * @deprecated
 */
function fixDuplicates(yarnlock_old, options) {
    return (0, index_1.fixDuplicates)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * @deprecated
 */
function yarnDedupe(yarnlock_old, options) {
    return (0, index_1.yarnDedupe)((0, yarnlock_stringify_1.yarnLockStringify)(yarnlock_old), options);
}
/**
 * @deprecated
 */
const auto = {
    listDuplicates,
    fixDuplicates,
    yarnDedupe,
};
/**
 * @deprecated
 */
exports.default = auto;
//# sourceMappingURL=object.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnDedupe = exports.fixDuplicates = exports.listDuplicates = void 0;
const tslib_1 = require("tslib");
const index_1 = require("./index");
const yarnlock_stringify_1 = tslib_1.__importDefault(require("@yarn-tool/yarnlock-stringify"));
/**
 * @deprecated
 */
function listDuplicates(yarnlock_old, options) {
    return (0, index_1.listDuplicates)((0, yarnlock_stringify_1.default)(yarnlock_old), options);
}
exports.listDuplicates = listDuplicates;
/**
 * @deprecated
 */
function fixDuplicates(yarnlock_old, options) {
    return (0, index_1.fixDuplicates)((0, yarnlock_stringify_1.default)(yarnlock_old), options);
}
exports.fixDuplicates = fixDuplicates;
/**
 * @deprecated
 */
function yarnDedupe(yarnlock_old, options) {
    return (0, index_1.yarnDedupe)((0, yarnlock_stringify_1.default)(yarnlock_old), options);
}
exports.yarnDedupe = yarnDedupe;
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
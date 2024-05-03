"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = exports.buildDiff = void 0;
exports.yarnLockDiff = yarnLockDiff;
exports._yarnLockDiffCore = _yarnLockDiffCore;
const diff_service_1 = require("./lib/diff-service");
Object.defineProperty(exports, "buildDiff", { enumerable: true, get: function () { return diff_service_1.buildDiff; } });
const formatter_1 = require("./lib/formatter");
Object.defineProperty(exports, "buildDiffTable", { enumerable: true, get: function () { return formatter_1.buildDiffTable; } });
const buildDiffTable002_1 = require("./lib/formatter/buildDiffTable002");
function yarnLockDiff(yarnlock_old, yarnlock_new, options) {
    return (0, buildDiffTable002_1._handleDiffTable)(_yarnLockDiffCore(yarnlock_old, yarnlock_new, options), options);
}
function _yarnLockDiffCore(yarnlock_old, yarnlock_new, options) {
    const diff = (0, diff_service_1.buildDiff)(yarnlock_old, yarnlock_new);
    return (0, buildDiffTable002_1._buildDiffTableCore)(diff, options);
}
exports.default = yarnLockDiff;
//# sourceMappingURL=index.js.map
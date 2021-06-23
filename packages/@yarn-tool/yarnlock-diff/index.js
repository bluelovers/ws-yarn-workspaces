"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockDiff = exports.buildDiffTable = exports.buildDiff = void 0;
const diff_service_1 = require("./lib/diff-service");
Object.defineProperty(exports, "buildDiff", { enumerable: true, get: function () { return diff_service_1.buildDiff; } });
const formatter_1 = require("./lib/formatter");
Object.defineProperty(exports, "buildDiffTable", { enumerable: true, get: function () { return formatter_1.buildDiffTable; } });
function yarnLockDiff(yarnlock_old, yarnlock_new, options) {
    const diff = (0, diff_service_1.buildDiff)(yarnlock_old, yarnlock_new);
    return (0, formatter_1.buildDiffTable)(diff, options);
}
exports.yarnLockDiff = yarnLockDiff;
exports.default = yarnLockDiff;
//# sourceMappingURL=index.js.map
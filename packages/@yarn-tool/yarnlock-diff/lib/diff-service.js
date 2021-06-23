"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiff = void 0;
const deep_diff_1 = require("@bluelovers/deep-diff");
const buildComputedPackage_1 = require("./diff-service/buildComputedPackage");
function buildDiff(oldYarnLockContent, newYarnLockContent) {
    var _a;
    const oldPacakges = (0, buildComputedPackage_1.buildComputedPackage)(oldYarnLockContent);
    const newPackages = (0, buildComputedPackage_1.buildComputedPackage)(newYarnLockContent);
    return (_a = (0, deep_diff_1.diff)(oldPacakges, newPackages)) !== null && _a !== void 0 ? _a : [];
}
exports.buildDiff = buildDiff;
//# sourceMappingURL=diff-service.js.map
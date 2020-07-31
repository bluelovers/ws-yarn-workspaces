"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiff = void 0;
const deep_diff_1 = require("deep-diff");
const Option_1 = require("fp-ts/lib/Option");
const buildComputedPackage_1 = require("./diff-service/buildComputedPackage");
function buildDiff(oldYarnLockContent, newYarnLockContent) {
    const oldPacakges = buildComputedPackage_1.buildComputedPackage(oldYarnLockContent);
    const newPackages = buildComputedPackage_1.buildComputedPackage(newYarnLockContent);
    return Option_1.fromNullable(deep_diff_1.diff(oldPacakges, newPackages));
}
exports.buildDiff = buildDiff;
//# sourceMappingURL=diff-service.js.map
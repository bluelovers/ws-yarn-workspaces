"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiff = void 0;
const deep_diff_1 = require("deep-diff");
const Option_1 = require("fp-ts/lib/Option");
const lockfile_1 = require("@yarnpkg/lockfile");
const computeHashmapOfPackageAndVersionList_1 = require("./diff-service/v1/computeHashmapOfPackageAndVersionList");
function buildDiff(oldYarnLockContent, newYarnLockContent) {
    const oldPacakges = oldYarnLockContent
        .map(v => lockfile_1.parse(v))
        .map(data => data.object)
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, {});
    const newPackages = newYarnLockContent
        .map(v => lockfile_1.parse(v))
        .map(data => data.object)
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, {});
    return Option_1.fromNullable(deep_diff_1.diff(oldPacakges, newPackages));
}
exports.buildDiff = buildDiff;
//# sourceMappingURL=diff-service.js.map
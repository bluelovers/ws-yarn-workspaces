"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiff = void 0;
const deep_diff_1 = require("deep-diff");
const Option_1 = require("fp-ts/lib/Option");
const index_1 = require("@yarn-tool/yarnlock-parse/index");
const computeHashmapOfPackageAndVersionList_1 = require("./diff-service/computeHashmapOfPackageAndVersionList");
function buildDiff(oldYarnLockContent, newYarnLockContent) {
    const oldPacakges = oldYarnLockContent
        .map(v => index_1.yarnLockParse(v))
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, {});
    const newPackages = newYarnLockContent
        .map(v => index_1.yarnLockParse(v))
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, {});
    return Option_1.fromNullable(deep_diff_1.diff(oldPacakges, newPackages));
}
exports.buildDiff = buildDiff;
//# sourceMappingURL=diff-service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildComputedPackage = buildComputedPackage;
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const computeHashmapOfPackageAndVersionList_1 = require("./computeHashmapOfPackageAndVersionList");
function buildComputedPackage(yarnLockContentList, alreadyComputedPackage = {}) {
    if (!Array.isArray(yarnLockContentList)) {
        yarnLockContentList = [yarnLockContentList];
    }
    return yarnLockContentList
        .map(v => (0, yarnlock_parse_1.yarnLockParse)(v))
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, alreadyComputedPackage);
}
//# sourceMappingURL=buildComputedPackage.js.map
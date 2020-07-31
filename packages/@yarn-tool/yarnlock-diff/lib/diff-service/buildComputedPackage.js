"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildComputedPackage = void 0;
const index_1 = require("@yarn-tool/yarnlock-parse/index");
const computeHashmapOfPackageAndVersionList_1 = require("./computeHashmapOfPackageAndVersionList");
function buildComputedPackage(yarnLockContentList, alreadyComputedPackage = {}) {
    return yarnLockContentList
        .map(v => index_1.yarnLockParse(v))
        .reduce(computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList, alreadyComputedPackage);
}
exports.buildComputedPackage = buildComputedPackage;
//# sourceMappingURL=buildComputedPackage.js.map
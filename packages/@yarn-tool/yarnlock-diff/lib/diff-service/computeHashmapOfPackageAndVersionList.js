"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHashmapOfPackageAndVersionList = void 0;
const index_1 = require("@yarn-tool/yarnlock-parse/index");
const computeHashmapOfPackageAndVersionList_1 = require("./v1/computeHashmapOfPackageAndVersionList");
const computeHashmapOfPackageAndVersionList_2 = require("./v2/computeHashmapOfPackageAndVersionList");
function computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage) {
    if (index_1.isYarnLockParsedV1(parsedOldPackage)) {
        return computeHashmapOfPackageAndVersionList_1.computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage.data);
    }
    else if (index_1.isYarnLockParsedV2(parsedOldPackage)) {
        return computeHashmapOfPackageAndVersionList_2.computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage.data);
    }
    throw new TypeError(`can't detect yarn.lock version`);
}
exports.computeHashmapOfPackageAndVersionList = computeHashmapOfPackageAndVersionList;
//# sourceMappingURL=computeHashmapOfPackageAndVersionList.js.map
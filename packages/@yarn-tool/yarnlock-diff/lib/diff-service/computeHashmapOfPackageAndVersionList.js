"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHashmapOfPackageAndVersionList = void 0;
const index_1 = require("@yarn-tool/yarnlock-parse/index");
const parsePackageRow_1 = require("./v1/parsePackageRow");
const parsePackageRow_2 = require("./v2/parsePackageRow");
const index_2 = require("array-hyper-unique/index");
const semver_1 = require("semver");
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
function computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage) {
    let fn;
    index_1.assertYarnLockParsedIsSupported(parsedOldPackage, (verType, parsedOldPackage) => {
        if (verType === types_1.EnumDetectYarnLock.v1) {
            fn = parsePackageRow_1.parsePackageRow;
        }
        else {
            fn = parsePackageRow_2.parsePackageRow;
        }
    });
    /*
    if (isYarnLockParsedV1(parsedOldPackage))
    {
        fn = v1
    }
    else if (isYarnLockParsedV2(parsedOldPackage))
    {
        fn = v2
    }
    else
    {
        throw new TypeError(`can't detect yarn.lock version`)
    }
     */
    Object.entries(parsedOldPackage.data)
        .forEach(([packageName, packageData]) => {
        var _a;
        var _b;
        const result = fn(packageName, packageData);
        if (typeof result === 'undefined' || result === null) {
            return;
        }
        (_a = alreadyComputedPackage[_b = result.name]) !== null && _a !== void 0 ? _a : (alreadyComputedPackage[_b] = []);
        alreadyComputedPackage[result.name].push(result.version);
        index_2.array_unique_overwrite(alreadyComputedPackage[result.name]);
        alreadyComputedPackage[result.name].sort(semver_1.compareLoose);
    });
    return alreadyComputedPackage;
}
exports.computeHashmapOfPackageAndVersionList = computeHashmapOfPackageAndVersionList;
//# sourceMappingURL=computeHashmapOfPackageAndVersionList.js.map
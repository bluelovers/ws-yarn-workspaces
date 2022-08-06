"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHashmapOfPackageAndVersionList = void 0;
const parseYarnLockRowV1_1 = require("@yarn-tool/yarnlock-util/lib/v1/parseYarnLockRowV1");
const parseYarnLockRowV2_1 = require("@yarn-tool/yarnlock-util/lib/v2/parseYarnLockRowV2");
const array_hyper_unique_1 = require("array-hyper-unique");
const semver_1 = require("semver");
const reduceYarnLockParsedEntries_1 = require("@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage) {
    let fn;
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage, (verType, parsedOldPackage) => {
        if (verType === yarnlock_types_1.EnumDetectYarnLock.v1) {
            fn = parseYarnLockRowV1_1.parseYarnLockRowV1;
        }
        else {
            fn = parseYarnLockRowV2_1.parseYarnLockRowV2;
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
    alreadyComputedPackage = (0, reduceYarnLockParsedEntries_1.reduceYarnLockParsedEntries)(alreadyComputedPackage, parsedOldPackage, (alreadyComputedPackage, [packageName, packageData]) => {
        var _a;
        var _b;
        const result = fn(packageName, packageData);
        if (typeof result !== 'undefined' && result !== null) {
            (_a = alreadyComputedPackage[_b = result.name]) !== null && _a !== void 0 ? _a : (alreadyComputedPackage[_b] = []);
            alreadyComputedPackage[result.name].push(result.version);
        }
        return alreadyComputedPackage;
    });
    Object.keys(alreadyComputedPackage)
        .forEach((name) => {
        (0, array_hyper_unique_1.array_unique_overwrite)(alreadyComputedPackage[name]);
        alreadyComputedPackage[name].sort(semver_1.compareLoose);
    });
    return alreadyComputedPackage;
}
exports.computeHashmapOfPackageAndVersionList = computeHashmapOfPackageAndVersionList;
//# sourceMappingURL=computeHashmapOfPackageAndVersionList.js.map
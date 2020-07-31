"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHashmapOfPackageAndVersionList = exports.PACKAGE_REGEX = void 0;
exports.PACKAGE_REGEX = /(?<packageName>.*)@(?:(?<semverPin>[\^\$])?(?<major>\d)(?:\.(?<minor>\d))?(?:\.(?<patch>\d))?(?:-(?<prerelease>[0-9a-zA-Z-]+)(?:.(?<prereleaseVersion>[0-9a-zA-Z]+))?)?(?:\+(?<metadata>[0-9a-zA-Z-]+)(?:.(?<metadataVersion>[0-9a-zA-Z]+))?)?|\*)/;
function computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage) {
    const newComputedPackage = { ...alreadyComputedPackage };
    Object.entries(parsedOldPackage).forEach(([packageName, packageData]) => {
        const regexResult = exports.PACKAGE_REGEX.exec(packageName);
        const packageNameWithoutVersion = regexResult && regexResult.groups && regexResult.groups.packageName;
        if (!packageNameWithoutVersion)
            return;
        if (newComputedPackage[packageNameWithoutVersion]) {
            newComputedPackage[packageNameWithoutVersion].push(packageData.version);
            newComputedPackage[packageNameWithoutVersion] = [
                ...new Set(newComputedPackage[packageNameWithoutVersion]),
            ];
            newComputedPackage[packageNameWithoutVersion].sort();
        }
        else {
            newComputedPackage[packageNameWithoutVersion] = [packageData.version];
        }
    });
    return newComputedPackage;
}
exports.computeHashmapOfPackageAndVersionList = computeHashmapOfPackageAndVersionList;
//# sourceMappingURL=computeHashmapOfPackageAndVersionList.js.map
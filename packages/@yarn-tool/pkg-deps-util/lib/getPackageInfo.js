"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageInfo = getPackageInfo;
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const core_1 = require("@yarn-tool/pkg-version-query/lib/core");
const package_json_1 = require("package-json");
function getPackageInfo(packageName, excludeVersion) {
    var _a, _b;
    const data = typeof packageName === 'string' ? (0, packageNameToTypes_1.packageNameToTypes)(packageName) : packageName;
    let version = 'latest';
    if (!excludeVersion && ((_a = data.semver) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        version = (_b = data.semver) !== null && _b !== void 0 ? _b : 'latest';
    }
    return (0, core_1._queryVersion)(data.name, {
        version,
        //fullMetadata: true,
    })
        .catch(package_json_1.VersionNotFoundError, () => {
        return (0, core_1._queryVersion)(data.name, {
            version: 'latest',
            //fullMetadata: true,
        });
    })
        .catch(package_json_1.PackageNotFoundError, err => void 0);
}
//# sourceMappingURL=getPackageInfo.js.map
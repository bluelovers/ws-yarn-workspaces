"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInstallTargetTypes = exports.EnumInstallTypesErrorCode = exports.getPackageInfo = void 0;
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const generatePackageArg_1 = require("@yarn-tool/npm-package-arg-util/lib/generatePackageArg");
const core_1 = require("@yarn-tool/pkg-version-query/lib/core");
const package_json_1 = require("package-json");
const existsDependencies_1 = require("./util/existsDependencies");
function getPackageInfo(packageName, excludeVersion) {
    var _a, _b;
    const data = typeof packageName === 'string' ? packageNameToTypes_1.packageNameToTypes(packageName) : packageName;
    let version = 'latest';
    if (!excludeVersion && ((_a = data.semver) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        version = (_b = data.semver) !== null && _b !== void 0 ? _b : 'latest';
    }
    return core_1._queryVersion(data.name, {
        version,
    })
        .catch(package_json_1.VersionNotFoundError, () => {
        return core_1._queryVersion(data.name, {
            version: 'latest',
        });
    })
        .catch(package_json_1.PackageNotFoundError, err => void 0);
}
exports.getPackageInfo = getPackageInfo;
var EnumInstallTypesErrorCode;
(function (EnumInstallTypesErrorCode) {
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["NOT_EXISTS"] = 1] = "NOT_EXISTS";
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["DEPRECATED"] = 2] = "DEPRECATED";
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["SKIP"] = 3] = "SKIP";
})(EnumInstallTypesErrorCode = exports.EnumInstallTypesErrorCode || (exports.EnumInstallTypesErrorCode = {}));
async function checkInstallTargetTypes(packageName, options) {
    var _a, _b, _c, _d;
    let data = packageNameToTypes_1.packageNameToTypes(packageName);
    let { name } = data;
    if ((options === null || options === void 0 ? void 0 : options.checkExists) && existsDependencies_1.existsDependencies(name, (_a = options === null || options === void 0 ? void 0 : options.pkg) !== null && _a !== void 0 ? _a : {})) {
        let target = generatePackageArg_1.generatePackageArg({
            name,
            semver: data.semver,
        }, ((_b = data.semver) === null || _b === void 0 ? void 0 : _b.length) > 0);
        return {
            name,
            target,
            error: 3 /* SKIP */,
            msg: `${name} already exists in package dependencies`,
        };
    }
    let info = await getPackageInfo(data, options === null || options === void 0 ? void 0 : options.excludeVersion);
    let target = generatePackageArg_1.generatePackageArg({
        name,
        semver: data.type !== 'tag' && ((_c = info === null || info === void 0 ? void 0 : info.version) === null || _c === void 0 ? void 0 : _c.length) ? `^${info.version}` : data.semver,
    }, ((_d = data.semver) === null || _d === void 0 ? void 0 : _d.length) > 0);
    if (info == null) {
        return {
            name,
            target,
            error: 1 /* NOT_EXISTS */,
            msg: `${name} not exists`,
        };
    }
    else if (info.deprecated) {
        return {
            name,
            target,
            error: 2 /* DEPRECATED */,
            msg: info.deprecated,
        };
    }
    return {
        name,
        target,
    };
}
exports.checkInstallTargetTypes = checkInstallTargetTypes;
//# sourceMappingURL=installTypes.js.map
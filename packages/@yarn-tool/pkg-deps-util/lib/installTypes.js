"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInstallTargetTypes = void 0;
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const generatePackageArg_1 = require("@yarn-tool/npm-package-arg-util/lib/generatePackageArg");
const existsDependencies_1 = require("./util/existsDependencies");
const getPackageInfo_1 = require("./getPackageInfo");
async function checkInstallTargetTypes(packageName, options) {
    var _a, _b, _c, _d;
    let data = (0, packageNameToTypes_1.packageNameToTypes)(packageName);
    let { name } = data;
    if ((options === null || options === void 0 ? void 0 : options.checkExists) && (0, existsDependencies_1.existsDependencies)(name, (_a = options === null || options === void 0 ? void 0 : options.pkg) !== null && _a !== void 0 ? _a : {})) {
        let target = (0, generatePackageArg_1.generatePackageArg)({
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
    let info = await (0, getPackageInfo_1.getPackageInfo)(data, options === null || options === void 0 ? void 0 : options.excludeVersion);
    let target = (0, generatePackageArg_1.generatePackageArg)({
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
        error: 0 /* SUCCESS */,
        msg: `add ${target} to dependency`,
    };
}
exports.checkInstallTargetTypes = checkInstallTargetTypes;
//# sourceMappingURL=installTypes.js.map
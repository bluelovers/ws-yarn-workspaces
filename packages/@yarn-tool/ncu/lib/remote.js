"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionTarget = exports.queryRemoteVersions = void 0;
exports.requestVersion = requestVersion;
exports.fetchVersion = fetchVersion;
exports.queryPackageManagersNpm = queryPackageManagersNpm;
exports.packageMapToKeyObject = packageMapToKeyObject;
exports.isUpgradeable = isUpgradeable;
exports.updateSemver = updateSemver;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const store_1 = require("./store");
const package_json_1 = tslib_1.__importDefault(require("package-json"));
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
const npm_1 = tslib_1.__importDefault(require("npm-check-updates/lib/package-managers/npm"));
const getVersionTarget_1 = require("./remote/getVersionTarget");
Object.defineProperty(exports, "getVersionTarget", { enumerable: true, get: function () { return getVersionTarget_1.getVersionTarget; } });
var queryRemoteVersions_1 = require("./remote/queryRemoteVersions");
Object.defineProperty(exports, "queryRemoteVersions", { enumerable: true, get: function () { return queryRemoteVersions_1.queryRemoteVersions; } });
function requestVersion(packageName) {
    return bluebird_1.default
        .resolve(store_1.remoteCacheMap.get(packageName))
        .then(function (result) {
        if (result == null) {
            return (0, package_json_1.default)(packageName, { allVersions: true });
        }
        return result;
    })
        .tap(function (result) {
        return store_1.remoteCacheMap.set(packageName, result);
    });
}
function fetchVersion(packageName, options = {}, ncuOptions) {
    let { field = 'versions' } = options;
    return requestVersion(packageName)
        //.resolve(packageJson(packageName, { allVersions: true }))
        .then(function (result) {
        if (field.startsWith('dist-tags.')) {
            const split = field.split('.');
            if (result[split[0]]) {
                return result[split[0]][split[1]];
            }
        }
        else if (field === 'versions') {
            return Object.keys(result[field]);
        }
        else if (field) {
            return result[field];
        }
    })
        .then(result => {
        if (options.filter) {
            return result.filter(options.filter);
        }
        //console.dir(result);
        return result;
    });
}
function queryPackageManagersNpm(name, version = '0', versionTarget = types_1.EnumVersionValue.latest) {
    let method = types_1.EnumPackageManagersNpmMethod[versionTarget];
    if (version == null) {
        version = '0';
        switch (versionTarget) {
            case types_1.EnumVersionValue.latest:
            case types_1.EnumVersionValue.greatest:
            case types_1.EnumVersionValue.newest:
                break;
            case types_1.EnumVersionValue.major:
            case types_1.EnumVersionValue.minor:
                method = types_1.EnumPackageManagersNpmMethod.latest;
                break;
        }
    }
    return bluebird_1.default
        .resolve(npm_1.default[method](name, version, {}))
        .then(async (value) => {
        if (value == null) {
            let r = await requestVersion(name);
            if (version in r['dist-tags']) {
                return r['dist-tags'][version];
            }
        }
        return value;
    });
}
function packageMapToKeyObject(packageMap, versionTarget) {
    return Object
        .entries(packageMap)
        .map(([name, version_old]) => {
        return (0, store_1.objVersionCache)({
            name, version_old, versionTarget,
        });
    });
}
function isUpgradeable(current, latest) {
    return (0, versionmanager_1.isUpgradeable)(current, latest);
}
function updateSemver(current, latest, options = {}) {
    return (0, versionmanager_1.upgradeDependencyDeclaration)(current, latest, options);
}
//# sourceMappingURL=remote.js.map
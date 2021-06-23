"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersion = exports.queryVersionWithCache = void 0;
const tslib_1 = require("tslib");
const package_json_1 = require("package-json");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const cacheAgent_1 = require("./cacheAgent");
const createCacheKey_1 = require("./createCacheKey");
const core_1 = require("./core");
const queryVersionCacheRaw_1 = require("./queryVersionCacheRaw");
const handleVersionRange_1 = require("@lazy-node/semver-ampersand/lib/handleVersionRange");
const const_1 = require("@lazy-node/semver-ampersand/lib/const");
function queryVersionWithCache(name, targetVersion = 'latest', options) {
    return bluebird_1.default.resolve((0, queryVersionCacheRaw_1.queryVersionCacheRaw)(name, targetVersion, options))
        .then(data => {
        var _a;
        if (data === null || data === void 0 ? void 0 : data.error) {
            return Promise.reject(data.error);
        }
        else if (data === null || data === void 0 ? void 0 : data.result) {
            return data.result;
        }
        return queryVersion(name, (_a = data === null || data === void 0 ? void 0 : data.version) !== null && _a !== void 0 ? _a : targetVersion, true, options)
            .catch(e => {
            if (data === null || data === void 0 ? void 0 : data.result) {
                return data.result;
            }
            return Promise.reject(e);
        });
    });
}
exports.queryVersionWithCache = queryVersionWithCache;
function queryVersion(name, targetVersion = 'latest', save = true, options) {
    let version = targetVersion !== null && targetVersion !== void 0 ? targetVersion : (targetVersion = 'latest');
    let key = (0, createCacheKey_1._createCacheKey)(name, targetVersion);
    return (0, core_1._queryVersion)(name, {
        version,
    })
        .then((result) => {
        return result.version;
    })
        .catch(package_json_1.VersionNotFoundError, async (e) => {
        let bool = true;
        if (version.startsWith('npm:')) {
            version = version.replace(/^npm:/, '');
            bool = false;
        }
        if (const_1.reHandleVersionRange.test(version)) {
            version = (0, handleVersionRange_1.handleVersionRange)(version);
            bool = false;
        }
        if (bool) {
            return Promise.reject(e);
        }
        return queryVersion(name, version, false, options);
    })
        .tapCatch(package_json_1.VersionNotFoundError, package_json_1.PackageNotFoundError, (error) => {
        save && (0, cacheAgent_1.getCache)(options).set(key, {
            key,
            name,
            version,
            error,
        });
    })
        .tap(result => {
        save && (0, cacheAgent_1.getCache)(options).set(key, {
            key,
            name,
            version,
            result,
        });
    });
}
exports.queryVersion = queryVersion;
exports.default = queryVersionWithCache;
//# sourceMappingURL=queryVersion.js.map
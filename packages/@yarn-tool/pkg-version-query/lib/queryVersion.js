"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersion = exports.queryVersionWithCache = void 0;
const package_json_1 = require("package-json");
const bluebird_1 = __importDefault(require("bluebird"));
const cacheAgent_1 = require("./cacheAgent");
const index_1 = require("@lazy-node/semver-ampersand/index");
const createCacheKey_1 = require("./createCacheKey");
const core_1 = require("./core");
const queryVersionCacheRaw_1 = require("./queryVersionCacheRaw");
function queryVersionWithCache(name, targetVersion = 'latest') {
    return bluebird_1.default.resolve(queryVersionCacheRaw_1.queryVersionCacheRaw(name, targetVersion))
        .then(data => {
        var _a;
        if (data === null || data === void 0 ? void 0 : data.error) {
            return Promise.reject(data.error);
        }
        else if (data === null || data === void 0 ? void 0 : data.result) {
            return data.result;
        }
        return queryVersion(name, (_a = data === null || data === void 0 ? void 0 : data.version) !== null && _a !== void 0 ? _a : targetVersion);
    });
}
exports.queryVersionWithCache = queryVersionWithCache;
function queryVersion(name, targetVersion = 'latest', save = true) {
    let version = targetVersion !== null && targetVersion !== void 0 ? targetVersion : (targetVersion = 'latest');
    let key = createCacheKey_1._createCacheKey(name, targetVersion);
    return core_1._queryVersion(name, {
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
        if (index_1.reHandleVersionRange.test(version)) {
            version = index_1.handleVersionRange(version);
            bool = false;
        }
        if (bool) {
            return Promise.reject(e);
        }
        return queryVersion(name, version, false);
    })
        .tapCatch(package_json_1.VersionNotFoundError, package_json_1.PackageNotFoundError, (error) => {
        save && cacheAgent_1.getCache().set(key, {
            key,
            name,
            version,
            error,
        });
    })
        .tap(result => {
        save && cacheAgent_1.getCache().set(key, {
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
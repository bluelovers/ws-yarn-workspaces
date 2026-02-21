"use strict";
/**
 * Query package versions with cache support.
 * 查詢套件版本並支援快取機制。
 *
 * @module queryVersion
 *
 * 主要功能：
 * - 從 npm registry 查詢套件版本
 * - 支援 LRU 快取，減少重複查詢
 * - 處理版本範圍語法 (如 ^, ~, npm: 協議)
 * - 錯誤處理與快取錯誤結果
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionWithCache = queryVersionWithCache;
exports.queryVersion = queryVersion;
const tslib_1 = require("tslib");
const package_json_1 = require("package-json");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cacheAgent_1 = require("./cacheAgent");
const createCacheKey_1 = require("./createCacheKey");
const core_1 = require("./core");
const queryVersionCacheRaw_1 = require("./queryVersionCacheRaw");
const handleAmpersandAndSpaces_1 = require("@lazy-node/semver-ampersand/lib/handleAmpersandAndSpaces");
const const_1 = require("@lazy-node/semver-ampersand/lib/const");
/**
 * Query package version with LRU cache.
 * 使用 LRU 快取查詢套件版本。
 *
 * @param name - Package name / 套件名稱
 * @param targetVersion - Target version or range (default: 'latest') / 目標版本或範圍
 * @param options - Query options / 查詢選項
 * @returns Promise resolving to version string / 回傳版本字串的 Promise
 *
 * @example
 * ```ts
 * const version = await queryVersionWithCache('lodash');
 * // => '4.17.21'
 *
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * // => '4.9.5'
 * ```
 */
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
        if (const_1.reAmpersandAndSpaces.test(version)) {
            version = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(version);
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
exports.default = queryVersionWithCache;
//# sourceMappingURL=queryVersion.js.map
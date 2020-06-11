"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVersionCacheMap = exports.hasQueryedVersionCache = exports.strVersionCache = exports.objVersionCacheValue = exports.objVersionCache = exports.remoteCacheMap = exports.versionCacheMap = void 0;
exports.versionCacheMap = new Map();
exports.remoteCacheMap = new Map();
function objVersionCache({ name, versionTarget, version_old, }) {
    return {
        name,
        versionTarget,
        version_old,
    };
}
exports.objVersionCache = objVersionCache;
function objVersionCacheValue({ name, versionTarget, version_old, version_new, }) {
    return {
        name,
        versionTarget,
        version_old,
        version_new,
    };
}
exports.objVersionCacheValue = objVersionCacheValue;
function strVersionCache(key) {
    return JSON.stringify(objVersionCache(key));
}
exports.strVersionCache = strVersionCache;
function hasQueryedVersionCache(key) {
    return exports.versionCacheMap.has(strVersionCache(key));
}
exports.hasQueryedVersionCache = hasQueryedVersionCache;
function setVersionCacheMap(data) {
    return exports.versionCacheMap.set(strVersionCache(data), objVersionCacheValue(data));
}
exports.setVersionCacheMap = setVersionCacheMap;
//# sourceMappingURL=store.js.map
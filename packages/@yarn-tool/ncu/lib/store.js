"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteCacheMap = exports.versionCacheMap = void 0;
exports.objVersionCache = objVersionCache;
exports.objVersionCacheValue = objVersionCacheValue;
exports.strVersionCache = strVersionCache;
exports.hasQueryedVersionCache = hasQueryedVersionCache;
exports.setVersionCacheMap = setVersionCacheMap;
exports.versionCacheMap = new Map();
exports.remoteCacheMap = new Map();
function objVersionCache({ name, versionTarget, version_old, }) {
    return {
        name,
        versionTarget,
        version_old,
    };
}
function objVersionCacheValue({ name, versionTarget, version_old, version_new, }) {
    return {
        name,
        versionTarget,
        version_old,
        version_new,
    };
}
function strVersionCache(key) {
    return JSON.stringify(objVersionCache(key));
}
function hasQueryedVersionCache(key) {
    return exports.versionCacheMap.has(strVersionCache(key));
}
function setVersionCacheMap(data) {
    return exports.versionCacheMap.set(strVersionCache(data), objVersionCacheValue(data));
}
//# sourceMappingURL=store.js.map
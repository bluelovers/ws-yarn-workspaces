"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoFromDedupeCache = infoFromDedupeCache;
function infoFromDedupeCache(cache) {
    let { yarnlock_changed, yarnlock_old_exists } = cache;
    let { yarnlock_file, yarnlock_exists } = cache.yarnlock_cache;
    return {
        ...cache.rootData,
        yarnlock_file,
        yarnlock_old_exists,
        yarnlock_exists,
        yarnlock_changed,
    };
}
//# sourceMappingURL=infoFromDedupeCache.js.map
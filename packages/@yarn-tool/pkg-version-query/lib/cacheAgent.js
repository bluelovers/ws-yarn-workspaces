"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.initCache = void 0;
const lru_cache_fs2_1 = __importDefault(require("lru-cache-fs2"));
const cache_path_1 = require("cache-path");
let cache;
function initCache() {
    let id = '@yarn-tool/pkg-version-query';
    let cwd = cache_path_1.getCachePath(id, {
        fnOrder: [
            cache_path_1.findYarnCachePath,
            cache_path_1.findNpmCachePath,
            cache_path_1.findOSTempPath,
            cache_path_1.findPkgModulePath,
        ],
    });
    const cache = new lru_cache_fs2_1.default({
        max: 100,
        cacheName: cache_path_1.normalizeName(id, true),
        cwd,
        autoCreate: true,
        maxAge: 60 * 1000,
    });
    return cache;
}
exports.initCache = initCache;
function getCache() {
    return cache !== null && cache !== void 0 ? cache : (cache = initCache());
}
exports.getCache = getCache;
//# sourceMappingURL=cacheAgent.js.map
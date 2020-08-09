"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.initCache = void 0;
const lru_cache_fs2_1 = __importDefault(require("lru-cache-fs2"));
const cache_path_1 = require("cache-path");
let cache;
function initCache(options) {
    let id = '@yarn-tool/pkg-version-query';
    let cwd = cache_path_1.getCachePath(id, {
        fnOrder: [
            cache_path_1.findYarnCachePath,
            cache_path_1.findNpmCachePath,
            cache_path_1.findOSTempPath,
            cache_path_1.findPkgModulePath,
        ],
    });
    let { cacheAgentOptions } = options;
    cacheAgentOptions = {
        //		max: 1000,
        //		maxAge: 5 * 60 * 1000,
        ...cacheAgentOptions,
        cacheName: cache_path_1.normalizeName(id, true),
        autoCreate: true,
        cwd,
    };
    if (!cacheAgentOptions.max || cacheAgentOptions.max <= 100) {
        cacheAgentOptions.max = 1000;
    }
    if (!cacheAgentOptions.maxAge || cacheAgentOptions.maxAge <= 60 * 1000) {
        cacheAgentOptions.maxAge = 10 * 60 * 1000;
    }
    const cache = new lru_cache_fs2_1.default(cacheAgentOptions);
    return cache;
}
exports.initCache = initCache;
function getCache(options) {
    var _a;
    return (_a = options === null || options === void 0 ? void 0 : options.cacheAgent) !== null && _a !== void 0 ? _a : (cache !== null && cache !== void 0 ? cache : (cache = initCache(options)));
}
exports.getCache = getCache;
//# sourceMappingURL=cacheAgent.js.map
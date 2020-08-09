"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionCacheRaw = void 0;
const createCacheKey_1 = require("./createCacheKey");
const cacheAgent_1 = require("./cacheAgent");
function queryVersionCacheRaw(name, targetVersion = 'latest', options) {
    let key = createCacheKey_1._createCacheKey(name, targetVersion);
    return cacheAgent_1.getCache(options).get(key);
}
exports.queryVersionCacheRaw = queryVersionCacheRaw;
//# sourceMappingURL=queryVersionCacheRaw.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionCacheRaw = void 0;
const createCacheKey_1 = require("./createCacheKey");
const cacheAgent_1 = require("./cacheAgent");
function queryVersionCacheRaw(name, targetVersion = 'latest', options) {
    let key = (0, createCacheKey_1._createCacheKey)(name, targetVersion);
    return (0, cacheAgent_1.getCache)(options).get(key);
}
exports.queryVersionCacheRaw = queryVersionCacheRaw;
//# sourceMappingURL=queryVersionCacheRaw.js.map
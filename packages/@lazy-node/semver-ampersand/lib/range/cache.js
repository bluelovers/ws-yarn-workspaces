"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const lru_cache2_1 = require("lru-cache2");
exports.cache = new lru_cache2_1.LRUCache({ max: 1000 });
//# sourceMappingURL=cache.js.map
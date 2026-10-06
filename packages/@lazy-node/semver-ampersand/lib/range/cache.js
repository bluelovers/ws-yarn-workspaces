"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const lru_cache2_1 = require("lru-cache2");
/**
 * 範圍解析結果的 LRU 快取
 * LRU cache for range parsing results
 *
 * 以 1000 為上限，避免同一程序反覆解析不同範圍時無限成長；
 * 鍵包含選項摘要，因此不同選項不會互相污染。
 * Capped at 1000 so repeated parsing of varied ranges cannot grow without
 * bound; the key embeds the option summary, so differing options never
 * contaminate each other.
 */
exports.cache = new lru_cache2_1.LRUCache({ max: 1000 });
//# sourceMappingURL=cache.js.map
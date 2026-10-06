"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._createCacheKey = _createCacheKey;
/**
 * 產生快取鍵 (Cache Key)：固定使用 `name@targetVersion` 格式，
 * 讓「同一個套件 + 同一個版本範圍」必定對應到同一筆快取；
 * 格式刻意保持簡單，因為鍵值會被寫入磁碟快取，日後變更格式會使舊快取全部失效。
 *
 * Builds the cache key as `name@targetVersion` so the same package + version range
 * always maps to the same entry. The format is kept simple on purpose: keys are
 * persisted to disk, so changing the shape later would invalidate every old entry.
 *
 * @param name 套件名稱 / Package name
 * @param targetVersion 目標版本或範圍 / Target version or range
 * @returns 快取鍵字串 / The cache key string
 */
function _createCacheKey(name, targetVersion) {
    return `${name}@${targetVersion}`;
}
//# sourceMappingURL=createCacheKey.js.map
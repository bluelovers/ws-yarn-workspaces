"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStaticMap = parseStaticMap;
/**
 * Implementation of parseStaticMap / parseStaticMap 的實現
 * @internal
 */
function parseStaticMap(file_map) {
    let ls;
    /**
     * 陣列格式直接取值即可（索引即為順序）
     * Array format needs no conversion - index order is already the entry order
     */
    if (Array.isArray(file_map)) {
        ls = Object.values(file_map);
    }
    /**
     * 記錄 (Record) 格式轉成 [key, value] 條目，
     * 與陣列格式共用後續的過濾邏輯
     * Record format becomes [key, value] entries,
     * sharing the same filtering logic as the array format
     */
    else {
        // @ts-ignore
        ls = Object.entries(file_map);
    }
    /**
     * 過濾無效條目：缺值或長度不足的條目無法還原成 [target, source]，
     * 若放行會在複製階段造成難以理解的錯誤
     * Filter invalid entries: entries without a value or with too few elements cannot form [target, source];
     * passing them on would cause confusing errors during copy
     */
    return ls.filter(v => v && Array.isArray(v) && v.length > 1);
}
//# sourceMappingURL=parseStaticMap.js.map
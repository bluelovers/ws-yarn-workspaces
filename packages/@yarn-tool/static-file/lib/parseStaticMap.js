"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStaticMap = parseStaticMap;
/**
 * Implementation of parseStaticMap / parseStaticMap 的實現
 * @internal
 */
function parseStaticMap(file_map) {
    let ls;
    // Handle array format / 處理陣列格式
    if (Array.isArray(file_map)) {
        ls = Object.values(file_map);
    }
    // Handle record format / 處理記錄格式
    else {
        // @ts-ignore
        ls = Object.entries(file_map);
    }
    // Filter out invalid entries / 過濾無效條目
    return ls.filter(v => v && Array.isArray(v) && v.length > 1);
}
//# sourceMappingURL=parseStaticMap.js.map
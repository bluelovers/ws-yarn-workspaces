"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStaticMap = parseStaticMap;
function parseStaticMap(file_map) {
    let ls;
    if (Array.isArray(file_map)) {
        ls = Object.values(file_map);
    }
    else {
        // @ts-ignore
        ls = Object.entries(file_map);
    }
    return ls.filter(v => v && Array.isArray(v) && v.length > 1);
}
//# sourceMappingURL=parseStaticMap.js.map
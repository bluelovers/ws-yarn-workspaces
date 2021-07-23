"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStaticMap = void 0;
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
exports.parseStaticMap = parseStaticMap;
//# sourceMappingURL=parseStaticMap.js.map
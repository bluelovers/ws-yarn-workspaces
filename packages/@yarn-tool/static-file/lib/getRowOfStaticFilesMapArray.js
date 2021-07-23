"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowOfStaticFilesMapArray = void 0;
const parseStaticMap_1 = require("./parseStaticMap");
function getRowOfStaticFilesMapArray(file_map, key) {
    return (0, parseStaticMap_1.parseStaticMap)(file_map).find(a => a[0] === key);
}
exports.getRowOfStaticFilesMapArray = getRowOfStaticFilesMapArray;
//# sourceMappingURL=getRowOfStaticFilesMapArray.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reMapStaticFilesMapArray = void 0;
const parseStaticMap_1 = require("./parseStaticMap");
const getRowOfStaticFilesMapArray_1 = require("./getRowOfStaticFilesMapArray");
const replaceTargetOfStaticFilesMapArrayEntry_1 = require("./replaceTargetOfStaticFilesMapArrayEntry");
const array_hyper_unique_1 = require("array-hyper-unique");
function reMapStaticFilesMapArray(file_map, replaceMap) {
    const ls = (0, parseStaticMap_1.parseStaticMap)(file_map);
    const arr = Object.entries(replaceMap)
        .reduce((arr, [targetNew, targetOld]) => {
        let old = (0, getRowOfStaticFilesMapArray_1.getRowOfStaticFilesMapArray)(ls, targetOld);
        if (old === null || old === void 0 ? void 0 : old.length) {
            arr.push((0, replaceTargetOfStaticFilesMapArrayEntry_1.replaceTargetOfStaticFilesMapArrayEntry)(old, targetNew));
        }
        return arr;
    }, []);
    return (0, array_hyper_unique_1.array_unique_overwrite)(arr.concat(ls));
}
exports.reMapStaticFilesMapArray = reMapStaticFilesMapArray;
//# sourceMappingURL=reMapStaticFilesMapArray.js.map
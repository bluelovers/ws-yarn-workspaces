"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootCopyStaticFilesAuto = getRootCopyStaticFilesAuto;
const const_1 = require("../const");
function getRootCopyStaticFilesAuto(rootData) {
    let file_map = [
        ...const_1.defaultCopyStaticFiles,
    ];
    if (rootData.isRoot) {
        if (!rootData.hasWorkspace) {
            file_map = [
                ...file_map,
                ...const_1.defaultCopyStaticFilesRootOnly,
            ];
        }
    }
    return file_map;
}
//# sourceMappingURL=getRootCopyStaticFiles.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWsCopyStaticFiles = getWsCopyStaticFiles;
const const_1 = require("../const");
const reMapStaticFilesMapArray_1 = require("../reMapStaticFilesMapArray");
const remap = {
    'tsconfig.json': 'tsconfig.json.tpl',
    'lerna.json': 'lerna.json.tpl',
    'pnpm-workspace.yaml': 'pnpm-workspace.yaml.tpl',
};
function getWsCopyStaticFiles() {
    return (0, reMapStaticFilesMapArray_1.reMapStaticFilesMapArray)([
        ...const_1.defaultCopyStaticFiles,
        ...const_1.defaultCopyStaticFilesRootOnly,
        ...const_1.defaultCopyStaticFilesWsRootOnly,
    ], remap);
}
exports.default = getWsCopyStaticFiles;
//# sourceMappingURL=wsCopyStaticFiles.js.map
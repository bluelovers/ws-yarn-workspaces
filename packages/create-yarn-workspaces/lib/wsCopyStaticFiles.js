"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWsCopyStaticFiles = void 0;
const const_1 = require("@yarn-tool/static-file/lib/const");
const reMapStaticFilesMapArray_1 = require("@yarn-tool/static-file/lib/reMapStaticFilesMapArray");
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
exports.getWsCopyStaticFiles = getWsCopyStaticFiles;
exports.default = getWsCopyStaticFiles;
//# sourceMappingURL=wsCopyStaticFiles.js.map
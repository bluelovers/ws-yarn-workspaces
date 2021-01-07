"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWsCopyStaticFiles = void 0;
const static_file_1 = require("@yarn-tool/static-file");
function getWsCopyStaticFiles() {
    return [
        ['tsconfig.json', 'file/tsconfig.json.tpl'],
        ['lerna.json', 'file/lerna.json.tpl'],
        ['pnpm-workspace.yaml', 'file/pnpm-workspace.yaml'],
        ...static_file_1.defaultCopyStaticFiles,
    ];
}
exports.getWsCopyStaticFiles = getWsCopyStaticFiles;
exports.default = getWsCopyStaticFiles;
//# sourceMappingURL=wsCopyStaticFiles.js.map
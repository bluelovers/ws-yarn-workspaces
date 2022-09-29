"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._resetStaticFiles = void 0;
const upath2_1 = require("upath2");
const fs_remove_extra_1 = require("fs-remove-extra");
function _resetStaticFiles(cwd, options) {
    for (const file of [
        '.gitignore',
        '.npmignore',
        'jest.config.js',
        'jest-preset.js',
        '.nowignore',
    ]) {
        (0, fs_remove_extra_1.fsRemoveFileSync)((0, upath2_1.resolve)(cwd, file));
    }
}
exports._resetStaticFiles = _resetStaticFiles;
//# sourceMappingURL=reset.js.map
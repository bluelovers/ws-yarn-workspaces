"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._resetStaticFiles = _resetStaticFiles;
const upath2_1 = require("upath2");
const fs_remove_extra_1 = require("fs-remove-extra");
function _resetStaticFiles(cwd, options) {
    for (const file of [
        '.gitignore',
        '.npmignore',
        'jest.config.js',
        'jest-preset.js',
        '.nowignore',
        '.editorconfig.tpl',
        'jest.config.js.tpl',
        '.yarnrc.yml.tpl',
        'tsc-multi.json.tpl',
        'tsconfig.esm.json.tpl',
        'tsconfig.json.tpl',
        'tsconfig.tsdx.json.tpl',
        'tsdx.config.js.tpl',
        '.nycrc.tpl',
        '.npmrc.tpl',
        '.mocharc.yml.tpl',
        '.nowignore',
        '.browserslistrc',
        '.browserslistrc.tpl',
    ]) {
        (0, fs_remove_extra_1.fsRemoveFileSync)((0, upath2_1.resolve)(cwd, file));
    }
}
//# sourceMappingURL=reset.js.map
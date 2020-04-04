"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFiles = exports.getStaticFile = exports.parseStaticMap = exports.defaultCopyStaticFiles = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const _defaultCopyStaticFiles = [
    ['.npmignore', 'file/npmignore'],
    ['.gitignore', 'file/gitignore'],
    ['.eslintignore', 'file/eslintignore'],
    ['.nvmrc', 'file/nvmrc'],
    ['.browserslistrc', 'file/browserslistrc'],
    ['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json'],
    ['tsconfig.esm.json.tpl', 'file/tsconfig.esm.json.tpl', 'tsconfig.esm.json'],
    ['.eslintrc.json.tpl', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    ['README.md', 'file/README.md'],
    ['.nycrc', 'file/nycrc'],
    ['.mocharc.yml', 'file/mocharc.yml'],
    ['jest.config.js', 'file/jest.config.js'],
    ['.nowignore', 'file/nowignore'],
    ['now.json.tpl', 'file/now.json.tpl', 'now.json'],
    ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
];
exports.defaultCopyStaticFiles = Object.freeze(_defaultCopyStaticFiles);
function parseStaticMap(file_map) {
    let ls;
    if (Array.isArray(file_map)) {
        // @ts-ignore
        ls = Object.values(file_map);
    }
    else {
        // @ts-ignore
        ls = Object.entries(file_map);
    }
    return ls
        .filter(v => v && Array.isArray(v) && v.length > 1);
}
exports.parseStaticMap = parseStaticMap;
function getStaticFile(file_id, options) {
    let ls = parseStaticMap(options && options.file_map || exports.defaultCopyStaticFiles);
    return ls.find(([a]) => {
        return a === file_id;
    });
}
exports.getStaticFile = getStaticFile;
function copyStaticFiles(options) {
    if (!options.cwd || typeof options.cwd != 'string') {
        throw new TypeError(`options.cwd must is string`);
    }
    if (!fs_extra_1.pathExistsSync(options.cwd)) {
        throw new TypeError(`options.cwd not exists`);
    }
    let copyOptions = {
        overwrite: options.overwrite || false,
        preserveTimestamps: true,
        errorOnExist: false,
    };
    const { cwd, file_map = exports.defaultCopyStaticFiles } = options;
    const staticRoot = options.staticRoot || __dirname;
    let ls = parseStaticMap(file_map);
    ls = ls.filter(v => v && Array.isArray(v) && v.length > 1);
    if (!ls.length) {
        throw new TypeError(`file_map is not file map`);
    }
    return ls
        // @ts-ignore
        .filter(function ([a, b, c]) {
        let fa = path_1.resolve(cwd, a);
        let fb = path_1.resolve(staticRoot, b);
        if (c != null) {
            let fc = path_1.resolve(cwd, c);
            if (fs_extra_1.existsSync(fc)) {
                return;
            }
        }
        if (!fs_extra_1.existsSync(fb)) {
            throw new Error(`file not exists. ${fb}`);
        }
        fs_extra_1.copySync(fb, fa, copyOptions);
        return true;
    });
}
exports.copyStaticFiles = copyStaticFiles;
exports.default = copyStaticFiles;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFiles = void 0;
const fs_extra_1 = require("fs-extra");
const const_1 = require("./const");
const parseStaticMap_1 = require("./parseStaticMap");
const copyStaticFilesEntry_1 = require("./copyStaticFilesEntry");
function copyStaticFiles(options) {
    var _a, _b;
    if (typeof options.cwd !== 'string' || !((_a = options.cwd) === null || _a === void 0 ? void 0 : _a.length) || !options.cwd) {
        throw new TypeError(`options.cwd must is string`);
    }
    if (!(0, fs_extra_1.pathExistsSync)(options.cwd)) {
        throw new TypeError(`options.cwd not exists`);
    }
    let ls = (0, parseStaticMap_1.parseStaticMap)((_b = options.file_map) !== null && _b !== void 0 ? _b : const_1.defaultCopyStaticFiles);
    if (!ls.length) {
        throw new TypeError(`Invalid file map: ${options.file_map}`);
    }
    const staticRoot = options.staticRoot || __dirname;
    const { cwd, overwrite } = options;
    return ls.filter((entry) => {
        return (0, copyStaticFilesEntry_1.copyStaticFilesEntry)(entry, cwd, staticRoot, overwrite);
    });
}
exports.copyStaticFiles = copyStaticFiles;
//# sourceMappingURL=copyStaticFiles.js.map
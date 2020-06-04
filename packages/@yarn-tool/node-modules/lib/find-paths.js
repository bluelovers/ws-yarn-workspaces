"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findModulesPackagePaths = exports.findModulesPackagePathsCore = void 0;
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const upath2_1 = require("upath2");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const util_1 = require("./util");
function findModulesPackagePathsCore(cwd, dir) {
    let root = util_1.getModulesDir(cwd, dir);
    let modules = fast_glob_1.default.sync([
        '@*/*/package.json',
        '*/package.json',
    ], {
        cwd: root,
    })
        .map(name => {
        return {
            name: upath2_1.dirname(name),
            location: upath2_1.resolve(root, name),
        };
    });
    return {
        cwd,
        modules,
    };
}
exports.findModulesPackagePathsCore = findModulesPackagePathsCore;
function findModulesPackagePaths(cwd, dir) {
    cwd = upath2_1.resolve(pkg_dir_1.default.sync(cwd !== null && cwd !== void 0 ? cwd : process.cwd()));
    return findModulesPackagePathsCore(cwd, dir);
}
exports.findModulesPackagePaths = findModulesPackagePaths;
exports.default = findModulesPackagePaths;
//# sourceMappingURL=find-paths.js.map
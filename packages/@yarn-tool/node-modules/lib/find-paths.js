"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findModulesPackagePaths = exports.findModulesPackagePathsCore = void 0;
const tslib_1 = require("tslib");
const pkg_dir_1 = tslib_1.__importDefault(require("pkg-dir"));
const upath2_1 = require("upath2");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
const util_1 = require("./util");
function findModulesPackagePathsCore(cwd, dir) {
    let root = (0, util_1.getModulesDir)(cwd, dir);
    let modules = fast_glob_1.default.sync([
        '@*/*/package.json',
        '*/package.json',
    ], {
        cwd: root,
    })
        .map(name => {
        let dir = (0, upath2_1.resolve)(root, name);
        return {
            name: (0, upath2_1.dirname)(name),
            location: (0, upath2_1.dirname)(dir),
        };
    });
    return {
        cwd,
        modules,
    };
}
exports.findModulesPackagePathsCore = findModulesPackagePathsCore;
function findModulesPackagePaths(cwd, dir) {
    cwd = (0, upath2_1.resolve)(pkg_dir_1.default.sync(cwd !== null && cwd !== void 0 ? cwd : process.cwd()));
    return findModulesPackagePathsCore(cwd, dir);
}
exports.findModulesPackagePaths = findModulesPackagePaths;
exports.default = findModulesPackagePaths;
//# sourceMappingURL=find-paths.js.map
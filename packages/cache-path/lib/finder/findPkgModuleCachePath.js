"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkgModuleCachePath = exports.findPkgModulePath = exports.findPkgPath = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const find_root_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/find-root"));
function findPkgPath(cwd) {
    return (0, find_root_1.default)({
        cwd,
    }).root;
}
exports.findPkgPath = findPkgPath;
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    return (0, path_1.join)(findPkgPath(cwd), 'node_modules');
}
exports.findPkgModulePath = findPkgModulePath;
function findPkgModuleCachePath(cwd) {
    return (0, path_1.join)(findPkgModulePath(cwd), '.cache');
}
exports.findPkgModuleCachePath = findPkgModuleCachePath;
//# sourceMappingURL=findPkgModuleCachePath.js.map
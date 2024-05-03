"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkgPath = findPkgPath;
exports.findPkgModulePathCore = findPkgModulePathCore;
exports.findPkgModuleCachePathCore = findPkgModuleCachePathCore;
exports.findPkgModulePath = findPkgModulePath;
exports.findPkgModuleCachePath = findPkgModuleCachePath;
const path_1 = require("path");
const find_root_1 = require("@yarn-tool/find-root");
function findPkgPath(cwd) {
    return (0, find_root_1.findRoot)({
        cwd,
    }).root;
}
function findPkgModulePathCore(root) {
    return (0, path_1.join)(root, 'node_modules');
}
function findPkgModuleCachePathCore(root) {
    return (0, path_1.join)(findPkgModulePathCore(root), '.cache');
}
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    return findPkgModulePathCore(findPkgPath(cwd));
}
function findPkgModuleCachePath(cwd) {
    return findPkgModuleCachePathCore(findPkgPath(cwd));
}
//# sourceMappingURL=findPkgModuleCachePath.js.map
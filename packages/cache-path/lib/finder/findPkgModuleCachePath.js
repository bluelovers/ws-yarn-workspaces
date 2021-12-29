"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkgModuleCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePathCore = exports.findPkgModulePathCore = exports.findPkgPath = void 0;
const path_1 = require("path");
const find_root_1 = require("@yarn-tool/find-root");
function findPkgPath(cwd) {
    return (0, find_root_1.findRoot)({
        cwd,
    }).root;
}
exports.findPkgPath = findPkgPath;
function findPkgModulePathCore(root) {
    return (0, path_1.join)(root, 'node_modules');
}
exports.findPkgModulePathCore = findPkgModulePathCore;
function findPkgModuleCachePathCore(root) {
    return (0, path_1.join)(findPkgModulePathCore(root), '.cache');
}
exports.findPkgModuleCachePathCore = findPkgModuleCachePathCore;
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    return findPkgModulePathCore(findPkgPath(cwd));
}
exports.findPkgModulePath = findPkgModulePath;
function findPkgModuleCachePath(cwd) {
    return findPkgModuleCachePathCore(findPkgPath(cwd));
}
exports.findPkgModuleCachePath = findPkgModuleCachePath;
//# sourceMappingURL=findPkgModuleCachePath.js.map
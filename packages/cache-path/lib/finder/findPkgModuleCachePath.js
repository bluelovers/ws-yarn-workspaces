"use strict";
/**
 * Package Module Cache Path Finder Module
 *
 * This module provides functionality to find package's node_modules and its cache path,
 * suitable for finding cache location within a project.
 *
 * @module cache-path/lib/finder/findPkgModuleCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkgPath = findPkgPath;
exports.findPkgModulePathCore = findPkgModulePathCore;
exports.findPkgModuleCachePathCore = findPkgModuleCachePathCore;
exports.findPkgModulePath = findPkgModulePath;
exports.findPkgModuleCachePath = findPkgModuleCachePath;
const path_1 = require("path");
const find_root_1 = require("@yarn-tool/find-root");
/**
 * Find package root directory
 *
 * Uses @yarn-tool/find-root to find the project's root directory.
 *
 * @param {string} [cwd] - Starting directory for search
 * @returns {string} Package root directory path
 */
function findPkgPath(cwd) {
    return (0, find_root_1.findRoot)({
        cwd,
    }).root;
}
/**
 * Core function to get node_modules path
 *
 * @param {string} root - Package root directory
 * @returns {string} node_modules directory path
 */
function findPkgModulePathCore(root) {
    return (0, path_1.join)(root, 'node_modules');
}
/**
 * Core function to get package cache path
 *
 * @param {string} root - Package root directory
 * @returns {string} Cache directory path under node_modules
 */
function findPkgModuleCachePathCore(root) {
    return (0, path_1.join)(findPkgModulePathCore(root), '.cache');
}
/**
 * Try to get pkg/node_modules path
 *
 * Finds the node_modules directory of the project where the current directory is located.
 *
 * @param {string} [cwd] - Starting directory for search
 * @returns {string} node_modules directory path
 *
 * @example
 * const modulesPath = findPkgModulePath();
 * console.log(modulesPath); // '/path/to/project/node_modules'
 */
function findPkgModulePath(cwd) {
    return findPkgModulePathCore(findPkgPath(cwd));
}
/**
 * Find package's node_modules/.cache directory path
 *
 * Finds the .cache directory under node_modules of the project where the current directory is located.
 *
 * @param {string} [cwd] - Starting directory for search / Starting directory for search
 * @returns {string} Cache directory path / Cache directory path
 *
 * @example
 * const cachePath = findPkgModuleCachePath();
 * console.log(cachePath); // '/path/to/project/node_modules/.cache'
 */
function findPkgModuleCachePath(cwd) {
    return findPkgModuleCachePathCore(findPkgPath(cwd));
}
//# sourceMappingURL=findPkgModuleCachePath.js.map
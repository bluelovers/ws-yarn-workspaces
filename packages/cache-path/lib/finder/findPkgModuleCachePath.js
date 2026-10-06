"use strict";
/**
 * 專案模組快取路徑尋找模組
 * Package Module Cache Path Finder Module
 *
 * 此模組提供尋找專案 node_modules 及其快取路徑的功能，
 * This module provides functionality to find package's node_modules and its cache path,
 * 適合在專案內尋找快取位置。
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
 * 尋找專案根目錄
 * Find package root directory
 *
 * 使用 @yarn-tool/find-root 尋找專案的根目錄。
 * Uses @yarn-tool/find-root to find the project's root directory.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} 專案根目錄路徑 / Package root directory path
 */
function findPkgPath(cwd) {
    return (0, find_root_1.findRoot)({
        cwd,
    }).root;
}
/**
 * 取得 node_modules 路徑的核心函式
 * Core function to get node_modules path
 *
 * @param {string} root - 專案根目錄 / Package root
 * @returns {string} node_modules 目錄路徑 / node_modules directory path
 */
function findPkgModulePathCore(root) {
    return (0, path_1.join)(root, 'node_modules');
}
/**
 * 取得專案快取路徑的核心函式
 * Core function to get package cache path
 *
 * @param {string} root - 專案根目錄 / Package root
 * @returns {string} node_modules 底下的快取目錄路徑 / Cache directory path under node_modules
 */
function findPkgModuleCachePathCore(root) {
    return (0, path_1.join)(findPkgModulePathCore(root), '.cache');
}
/**
 * 嘗試取得 專案/node_modules 路徑
 * Try to get pkg/node_modules path
 *
 * 尋找目前目錄所屬專案的 node_modules 目錄。
 * Finds the node_modules directory of the project where the current directory is located.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} node_modules 目錄路徑 / node_modules directory path
 *
 * @example
 * const modulesPath = findPkgModulePath();
 * console.log(modulesPath); // '/path/to/project/node_modules'
 */
function findPkgModulePath(cwd) {
    return findPkgModulePathCore(findPkgPath(cwd));
}
/**
 * 尋找專案的 node_modules/.cache 目錄路徑
 * Find package's node_modules/.cache directory path
 *
 * 尋找目前目錄所屬專案 node_modules 底下的 .cache 目錄。
 * Finds the .cache directory under node_modules of the project where the current directory is located.
 *
 * @param {string} [cwd] - 搜尋的起始目錄 / Starting directory for search
 * @returns {string} 快取目錄路徑 / Cache directory path
 *
 * @example
 * const cachePath = findPkgModuleCachePath();
 * console.log(cachePath); // '/path/to/project/node_modules/.cache'
 */
function findPkgModuleCachePath(cwd) {
    return findPkgModuleCachePathCore(findPkgPath(cwd));
}
//# sourceMappingURL=findPkgModuleCachePath.js.map
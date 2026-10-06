"use strict";
/**
 * 快取來源匯出與預設搜尋順序
 * Cache source re-exports and default search order
 *
 * @module cache-path/lib/finder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOrder = exports.findOSTempPath = exports.findNpmCachePath = exports.findYarnCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePath = void 0;
const findPkgModuleCachePath_1 = require("./finder/findPkgModuleCachePath");
Object.defineProperty(exports, "findPkgModuleCachePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModuleCachePath; } });
Object.defineProperty(exports, "findPkgModulePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModulePath; } });
const findYarnCachePath_1 = require("./finder/findYarnCachePath");
Object.defineProperty(exports, "findYarnCachePath", { enumerable: true, get: function () { return findYarnCachePath_1.findYarnCachePath; } });
const findNpmCachePath_1 = require("./finder/findNpmCachePath");
Object.defineProperty(exports, "findNpmCachePath", { enumerable: true, get: function () { return findNpmCachePath_1.findNpmCachePath; } });
const findOSTempPath_1 = require("./finder/findOSTempPath");
Object.defineProperty(exports, "findOSTempPath", { enumerable: true, get: function () { return findOSTempPath_1.findOSTempPath; } });
/**
 * 預設的快取來源搜尋順序
 * Default search order of cache sources
 *
 * fn[] of any function return a string
 * stop when get first return
 *
 * 順序刻意把「專案內路徑」放在最前：
 * 在專案中執行時優先使用 node_modules/.cache，離開專案才退回全域快取。
 * The order deliberately puts the in-project path first:
 * inside a project it prefers node_modules/.cache, and only falls back to global caches outside one.
 */
exports.defaultOrder = [
    findPkgModuleCachePath_1.findPkgModulePath,
    findYarnCachePath_1.findYarnCachePath,
    findNpmCachePath_1.findNpmCachePath,
    findOSTempPath_1.findOSTempPath,
];
//# sourceMappingURL=finder.js.map
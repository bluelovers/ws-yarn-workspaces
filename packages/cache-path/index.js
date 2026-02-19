"use strict";
/**
 * 快取路徑尋找工具
 * Cache Path Finder
 *
 * 此模組提供尋找和建立快取目錄的功能，類似於 `find-cache-dir`，
 * This module provides functionality to find and create cache directories, similar to `find-cache-dir`,
 * 但可在任何環境下運作，不僅限於模組/套件目錄。
 * but works in any environment, not just module/package directories.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOSTempPath = exports.findNpmCachePath = exports.findYarnCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePath = exports.normalizeName = exports.getCacheRootAsync = exports.getCacheRoot = exports.getCachePathAsync = exports.getCachePath = void 0;
const tslib_1 = require("tslib");
const findNpmCachePath_1 = require("./lib/finder/findNpmCachePath");
Object.defineProperty(exports, "findNpmCachePath", { enumerable: true, get: function () { return findNpmCachePath_1.findNpmCachePath; } });
const findOSTempPath_1 = require("./lib/finder/findOSTempPath");
Object.defineProperty(exports, "findOSTempPath", { enumerable: true, get: function () { return findOSTempPath_1.findOSTempPath; } });
const findPkgModuleCachePath_1 = require("./lib/finder/findPkgModuleCachePath");
Object.defineProperty(exports, "findPkgModuleCachePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModuleCachePath; } });
Object.defineProperty(exports, "findPkgModulePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModulePath; } });
const findYarnCachePath_1 = require("./lib/finder/findYarnCachePath");
Object.defineProperty(exports, "findYarnCachePath", { enumerable: true, get: function () { return findYarnCachePath_1.findYarnCachePath; } });
const getCachePath_1 = require("./lib/getCachePath");
// 匯出主要的快取路徑取得函數
// Export main cache path getter functions
var getCachePath_2 = require("./lib/getCachePath");
Object.defineProperty(exports, "getCachePath", { enumerable: true, get: function () { return getCachePath_2.getCachePath; } });
Object.defineProperty(exports, "getCachePathAsync", { enumerable: true, get: function () { return getCachePath_2.getCachePathAsync; } });
// 匯出快取根目錄取得函數
// Export cache root directory getter functions
var getCacheRoot_1 = require("./lib/getCacheRoot");
Object.defineProperty(exports, "getCacheRoot", { enumerable: true, get: function () { return getCacheRoot_1.getCacheRoot; } });
Object.defineProperty(exports, "getCacheRootAsync", { enumerable: true, get: function () { return getCacheRoot_1.getCacheRootAsync; } });
// 匯出名稱正規化函數
// Export name normalization function
var normalizeName_1 = require("./lib/normalizeName");
Object.defineProperty(exports, "normalizeName", { enumerable: true, get: function () { return normalizeName_1.normalizeName; } });
// 匯出所有類型定義
// Export all type definitions
tslib_1.__exportStar(require("./lib/types"), exports);
// 預設匯出 getCachePath 函數
// Default export getCachePath function
exports.default = getCachePath_1.getCachePath;
//# sourceMappingURL=index.js.map
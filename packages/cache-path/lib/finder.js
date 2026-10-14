"use strict";
/**
 * 快取來源匯出與預設搜尋順序
 * Cache source re-exports and default search order
 *
 * @module cache-path/lib/finder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOrderGlobal = exports.defaultOrder = exports.findOSTempPath = exports.findNpmCachePath = exports.findYarnCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePath = exports.findEnvCachePath = void 0;
const findEnvCachePath_1 = require("./finder/findEnvCachePath");
Object.defineProperty(exports, "findEnvCachePath", { enumerable: true, get: function () { return findEnvCachePath_1.findEnvCachePath; } });
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
 * 最前面的 findEnvCachePath 讀取 CACHE_DIR_DEV / TEMP_DEV / CACHE_DIR，
 * 屬於呼叫端的明確指定，權限最高；
 * 接著刻意把「專案內路徑」放在其餘來源之前：
 * 在專案中執行時優先使用 node_modules/.cache，離開專案才退回全域快取。
 *
 * 為 useGlobalDefaultFailback 未啟用時的兜底順序（參見 defaultOrderGlobal）。
 */
exports.defaultOrder = Object.freeze([
    findEnvCachePath_1.findEnvCachePath,
    findPkgModuleCachePath_1.findPkgModulePath,
    findYarnCachePath_1.findYarnCachePath,
    findNpmCachePath_1.findNpmCachePath,
    findOSTempPath_1.findOSTempPath,
]);
/**
 * 全域優先的快取來源搜尋順序
 * Global-first search order of cache sources
 *
 * useGlobalDefaultFailback 設為 true 時取代 defaultOrder 作為兜底順序：
 * 先嘗試 yarn / npm / tmp 等全域快取，最後才回到專案內的 node_modules；
 * 唯獨環境變數來源 findEnvCachePath 仍排最前，因為明確指定高於一切。
 */
exports.defaultOrderGlobal = Object.freeze([
    findEnvCachePath_1.findEnvCachePath,
    findYarnCachePath_1.findYarnCachePath,
    findNpmCachePath_1.findNpmCachePath,
    findOSTempPath_1.findOSTempPath,
    findPkgModuleCachePath_1.findPkgModulePath,
]);
//# sourceMappingURL=finder.js.map
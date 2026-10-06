"use strict";
/**
 * @yarn-tool/node-modules - Node.js 模組路徑尋找工具
 * @yarn-tool/node-modules - Node.js module path finding utilities
 *
 * 這個套件提供了在 Node.js 專案中尋找模組路徑的工具函數，
 * 特別適用於 Yarn Workspaces 環境。
 *
 * This package provides utility functions for finding module paths in Node.js projects,
 * especially useful in Yarn Workspaces environments.
 *
 * @author user
 * @created 2020/6/5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = void 0;
const tslib_1 = require("tslib");
const find_paths_1 = require("./lib/find-paths");
/**
 * 重新匯出工作區模組查詢 API，讓使用者可直接從套件根目錄導入
 * Re-export the workspace module query API so it can be imported from the package root
 */
var ws_find_paths_1 = require("./lib/ws-find-paths");
Object.defineProperty(exports, "wsFindPackageHasModules", { enumerable: true, get: function () { return ws_find_paths_1.wsFindPackageHasModules; } });
/**
 * 匯出所有模組路徑查詢函式，保持根目錄為唯一的公開入口
 * Export all module path finding functions, keeping the root as the single public entry
 */
tslib_1.__exportStar(require("./lib/find-paths"), exports);
/**
 * 預設匯出核心查詢函式，兼容 `import findModulesPackagePaths from ...` 的用法
 * Default-export the core query function for `import findModulesPackagePaths from ...` usage
 */
exports.default = find_paths_1.findModulesPackagePaths;
//# sourceMappingURL=index.js.map
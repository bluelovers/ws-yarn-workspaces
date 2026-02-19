"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTsdx = void 0;
/**
 * @yarn-tool/setup-module-env 入口檔案
 * Entry file for @yarn-tool/setup-module-env
 *
 * 此模組提供設定模組環境的工具函式，主要用於設定 tsdx 專案。
 * This module provides utility functions for setting up module environments,
 * primarily used for configuring tsdx projects.
 *
 * 匯出 setupTsdx 函式，用於初始化和設定 tsdx 專案的 package.json 及相關靜態檔案。
 * Exports the setupTsdx function for initializing and configuring
 * tsdx project's package.json and related static files.
 */
var index_1 = require("./lib/preset/tsdx/index");
Object.defineProperty(exports, "setupTsdx", { enumerable: true, get: function () { return index_1.setup; } });
//# sourceMappingURL=index.js.map
"use strict";
/**
 * Workspace 依賴關係尋找工具
 * Workspace Dependency Finder
 *
 * 此模組提供在 Yarn workspace 中尋找依賴關係樹的功能，
 * This module provides functionality to find dependency trees in Yarn workspaces,
 * 支援向下尋找（找出套件的所有依賴）和向上尋找（找出依賴此套件的所有套件）。
 * supporting both downward search (find all dependencies of a package) and upward search (find all packages that depend on this package).
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpDepsAllDeep = exports.findDepsAllDeep = void 0;
/**
 * Created by user on 2020/6/14.
 */
const find_1 = require("./lib/find");
Object.defineProperty(exports, "findDepsAllDeep", { enumerable: true, get: function () { return find_1.findDepsAllDeep; } });
const find_up_1 = require("./lib/find-up");
Object.defineProperty(exports, "findUpDepsAllDeep", { enumerable: true, get: function () { return find_up_1.findUpDepsAllDeep; } });
// 預設匯出向上依賴尋找函數
// Default export upward dependency finder function
exports.default = find_up_1.findUpDepsAllDeep;
//# sourceMappingURL=index.js.map
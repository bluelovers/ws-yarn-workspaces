"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = void 0;
const tslib_1 = require("tslib");
const find_paths_1 = require("./lib/find-paths");
var ws_find_paths_1 = require("./lib/ws-find-paths");
Object.defineProperty(exports, "wsFindPackageHasModules", { enumerable: true, get: function () { return ws_find_paths_1.wsFindPackageHasModules; } });
(0, tslib_1.__exportStar)(require("./lib/find-paths"), exports);
exports.default = find_paths_1.findModulesPackagePaths;
//# sourceMappingURL=index.js.map
"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = void 0;
const find_paths_1 = require("./lib/find-paths");
var ws_find_paths_1 = require("./lib/ws-find-paths");
Object.defineProperty(exports, "wsFindPackageHasModules", { enumerable: true, get: function () { return ws_find_paths_1.wsFindPackageHasModules; } });
__exportStar(require("./lib/find-paths"), exports);
exports.default = find_paths_1.findModulesPackagePaths;
//# sourceMappingURL=index.js.map
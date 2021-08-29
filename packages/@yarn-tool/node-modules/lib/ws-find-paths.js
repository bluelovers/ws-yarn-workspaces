"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = exports.wsFindPackageHasModulesCore = void 0;
const find_paths_1 = require("./find-paths");
const listable_1 = require("ws-pkg-list/lib/listable");
const core_1 = require("find-yarn-workspace-root2/core");
function wsFindPackageHasModulesCore(list, cwd, dir) {
    return list
        .map(row => {
        let modules = (0, find_paths_1.findModulesPackagePaths)(row.location, dir).modules;
        return {
            ...row,
            modules,
        };
    })
        .filter(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.modules) === null || _a === void 0 ? void 0 : _a.length; });
}
exports.wsFindPackageHasModulesCore = wsFindPackageHasModulesCore;
function wsFindPackageHasModules(cwd, dir) {
    cwd = (0, core_1.findWorkspaceRoot)(cwd);
    return wsFindPackageHasModulesCore((0, listable_1.wsPkgListable)(cwd), cwd, dir);
}
exports.wsFindPackageHasModules = wsFindPackageHasModules;
exports.default = wsFindPackageHasModules;
//# sourceMappingURL=ws-find-paths.js.map
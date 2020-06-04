"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = exports.wsFindPackageHasModulesCore = void 0;
const find_paths_1 = __importDefault(require("./find-paths"));
const listable_1 = __importDefault(require("ws-pkg-list/lib/listable"));
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
function wsFindPackageHasModulesCore(list, cwd, dir) {
    return list
        .map(row => {
        let modules = find_paths_1.default(row.location, dir).modules;
        return {
            ...row,
            modules,
        };
    })
        .filter(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.modules) === null || _a === void 0 ? void 0 : _a.length; });
}
exports.wsFindPackageHasModulesCore = wsFindPackageHasModulesCore;
function wsFindPackageHasModules(cwd, dir) {
    cwd = core_1.default(cwd);
    return wsFindPackageHasModulesCore(listable_1.default(cwd), cwd, dir);
}
exports.wsFindPackageHasModules = wsFindPackageHasModules;
exports.default = wsFindPackageHasModules;
//# sourceMappingURL=ws-find-paths.js.map
"use strict";
/**
 * 工作區模組路徑尋找工具
 * Workspace module path finding utilities
 *
 * @author user
 * @created 2020/6/5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModulesCore = wsFindPackageHasModulesCore;
exports.wsFindPackageHasModules = wsFindPackageHasModules;
const find_paths_1 = require("./find-paths");
const listable_1 = require("ws-pkg-list/lib/listable");
const core_1 = require("find-yarn-workspace-root2/core");
/**
 * 工作區模組路徑尋找核心函數
 * Core function for finding workspace module paths
 *
 * @param list - 工作區套件列表 / Workspace package list
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
function wsFindPackageHasModulesCore(list, cwd, dir) {
    return list
        .map(row => {
        // 對每個套件尋找其 node_modules 中的模組
        // Find modules in node_modules for each package
        let modules = (0, find_paths_1.findModulesPackagePaths)(row.location, dir).modules;
        return {
            // 保留原有的套件資訊
            ...row,
            // 新增模組資訊
            modules,
        };
    })
        .filter(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.modules) === null || _a === void 0 ? void 0 : _a.length; }) // 過濾出有模組的套件
    ;
}
/**
 * 尋找工作區中包含模組的套件
 * Find packages in workspace that contain modules
 *
 * @param cwd - 可選的工作目錄，若未提供則自動尋找工作區根目錄 / Optional working directory, automatically finds workspace root if not provided
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
function wsFindPackageHasModules(cwd, dir) {
    // 自動尋找工作區根目錄
    // Automatically find workspace root directory
    cwd = (0, core_1.findWorkspaceRoot)(cwd);
    // 取得工作區套件列表並尋找模組
    // Get workspace package list and find modules
    return wsFindPackageHasModulesCore((0, listable_1.wsPkgListable)(cwd), cwd, dir);
}
exports.default = wsFindPackageHasModules;
//# sourceMappingURL=ws-find-paths.js.map
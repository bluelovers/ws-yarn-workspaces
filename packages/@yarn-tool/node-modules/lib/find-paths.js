"use strict";
/**
 * 尋找 Node.js 模組路徑的工具函數
 * Utility functions for finding Node.js module paths
 *
 * @author user
 * @created 2020/6/5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findModulesPackagePathsCore = findModulesPackagePathsCore;
exports.findModulesPackagePaths = findModulesPackagePaths;
const tslib_1 = require("tslib");
const pkg_dir_1 = tslib_1.__importDefault(require("pkg-dir"));
const upath2_1 = require("upath2");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
const util_1 = require("./util");
/**
 * 核心模組路徑尋找函數
 * Core function for finding module paths
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑，預設為 'node_modules' / Custom node_modules directory path, defaults to 'node_modules'
 * @returns 包含 cwd 和 modules 陣列的物件 / Object containing cwd and modules array
 */
function findModulesPackagePathsCore(cwd, dir) {
    // 取得 node_modules 目錄路徑
    // Get the node_modules directory path
    let root = (0, util_1.getModulesDir)(cwd, dir);
    // 使用 fast-glob 同步搜尋所有 package.json 檔案
    // Use fast-glob to synchronously search for all package.json files
    let modules = fast_glob_1.default.sync([
        '@*/*/package.json', // 尋找 scoped packages (如 @types/node)
        '*/package.json', // 尋找一般 packages
    ], {
        cwd: root, // 在 node_modules 目錄下搜尋
    })
        .map(name => {
        // 計算模組的完整路徑
        // Calculate the full path of the module
        let dir = (0, upath2_1.resolve)(root, name);
        return {
            // 模組名稱（包含 scope）
            // Module name (including scope)
            name: (0, upath2_1.dirname)(name),
            // 模組實際位置
            // Actual module location
            location: (0, upath2_1.dirname)(dir),
        };
    });
    return {
        /** 當前工作目錄 */
        cwd,
        /* 找到的模組陣列 */
        modules,
    };
}
/**
 * 尋找模組路徑的主要函數
 * Main function for finding module paths
 *
 * @param cwd - 可選的工作目錄，若未提供則使用當前工作目錄 / Optional working directory, uses current working directory if not provided
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含 cwd 和 modules 陣列的物件 / Object containing cwd and modules array
 */
function findModulesPackagePaths(cwd, dir) {
    // 使用 pkg-dir 找到最近的 package.json 所在目錄作為 cwd
    // Use pkg-dir to find the nearest package.json directory as cwd
    cwd = (0, upath2_1.resolve)(pkg_dir_1.default.sync(cwd !== null && cwd !== void 0 ? cwd : process.cwd()));
    return findModulesPackagePathsCore(cwd, dir);
}
exports.default = findModulesPackagePaths;
//# sourceMappingURL=find-paths.js.map
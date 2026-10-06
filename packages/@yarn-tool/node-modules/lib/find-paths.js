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
    /**
     * 取得 node_modules 目錄路徑
     * Get the node_modules directory path
     */
    let root = (0, util_1.getModulesDir)(cwd, dir);
    /**
     * 使用 fast-glob 同步搜尋所有 package.json 檔案
     * Use fast-glob to synchronously search for all package.json files
     */
    let modules = fast_glob_1.default.sync([
        '@*/*/package.json', /** 尋找 scoped packages（如 @types/node） / Find scoped packages (e.g. @types/node) */
        '*/package.json', /** 尋找一般 packages / Find regular packages */
    ], {
        cwd: root, /** 在 node_modules 目錄下搜尋 / Search inside the node_modules directory */
    })
        .map(name => {
        /**
         * 由 package.json 的相對路徑回推模組目錄
         * Derive the module directory from the relative package.json path
         */
        let dir = (0, upath2_1.resolve)(root, name);
        return {
            /**
             * 模組名稱（包含 scope）
             * Module name (including scope)
             */
            name: (0, upath2_1.dirname)(name),
            /**
             * 模組實際位置
             * Actual module location
             */
            location: (0, upath2_1.dirname)(dir),
        };
    });
    return {
        /** 當前工作目錄 / Current working directory */
        cwd,
        /** 找到的模組陣列 / Found modules array */
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
    /**
     * 使用 pkg-dir 找到最近的 package.json 所在目錄作為 cwd
     * Use pkg-dir to find the nearest package.json directory as cwd
     *
     * 未傳入 cwd 時以 process.cwd() 為起點；正規化可確保回傳值一律為
     * 絕對路徑，避免後續 fast-glob 以相對路徑搜尋而得到不一致的結果。
     * When cwd is omitted, process.cwd() is the starting point; normalization
     * guarantees an absolute path so fast-glob never searches relatively.
     *
     * 邊界情況：若向上找不到任何 package.json，pkgDir.sync 會回傳 undefined，
     * 此時 resolve() 會因參數非字串而丟出錯誤。
     * Edge case: if no package.json is found upward, pkgDir.sync returns
     * undefined and resolve() throws because the argument is not a string.
     */
    cwd = (0, upath2_1.resolve)(pkg_dir_1.default.sync(cwd !== null && cwd !== void 0 ? cwd : process.cwd()));
    return findModulesPackagePathsCore(cwd, dir);
}
exports.default = findModulesPackagePaths;
//# sourceMappingURL=find-paths.js.map
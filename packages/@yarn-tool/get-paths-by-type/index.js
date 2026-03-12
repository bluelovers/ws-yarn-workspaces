"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolModuleMain = exports.SymbolGlobalPnpm = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = void 0;
exports.getPathsByType = getPathsByType;
const get_global_dirs_1 = require("@yarn-tool/get-global-dirs");
const fnm_detect_1 = require("@yarn-tool/fnm-detect");
const path_1 = require("path");
/**
 * 當前目錄的 Symbol
 * Symbol for current directory
 */
const SymbolCurrentDirectory = Symbol.for('cwd');
exports.SymbolCurrentDirectory = SymbolCurrentDirectory;
/**
 * 全域路徑的 Symbol（包含 Yarn 和 Npm）
 * Symbol for global paths (includes both Yarn and Npm)
 */
const SymbolGlobal = Symbol.for('global');
exports.SymbolGlobal = SymbolGlobal;
/**
 * 全域 Npm 路徑的 Symbol
 * Symbol for global Npm path
 */
const SymbolGlobalNpm = Symbol.for('npm');
exports.SymbolGlobalNpm = SymbolGlobalNpm;
/**
 * 全域 Yarn 路徑的 Symbol
 * Symbol for global Yarn path
 */
const SymbolGlobalYarn = Symbol.for('yarn');
exports.SymbolGlobalYarn = SymbolGlobalYarn;
/**
 * 全域 Pnpm 路徑的 Symbol
 * Symbol for global Pnpm path
 */
const SymbolGlobalPnpm = Symbol.for('pnpm');
exports.SymbolGlobalPnpm = SymbolGlobalPnpm;
/**
 * 主模組路徑的 Symbol
 * Symbol for main module path
 */
const SymbolModuleMain = Symbol.for('module.main');
exports.SymbolModuleMain = SymbolModuleMain;
/**
 * 根據類型 Symbol 取得對應的路徑陣列
 * Get corresponding path array based on type Symbol
 *
 * 此函數根據傳入的 Symbol 類型返回相應的路徑：
 * This function returns corresponding paths based on the Symbol type:
 *
 * - `SymbolCurrentDirectory` - 當前工作目錄 / Current working directory
 * - `SymbolGlobal` - 全域 Yarn + Npm 套件目錄 / Global Yarn + Npm package directories
 * - `SymbolGlobalNpm` - 全域 Npm 套件目錄 / Global Npm package directory
 * - `SymbolGlobalYarn` - 全域 Yarn 套件目錄 / Global Yarn package directory
 * - `SymbolModuleMain` - 主模組的路徑 / Main module path
 *
 * @param valueType - 路徑類型 Symbol / Path type Symbol
 * @param cwd - 工作目錄（用於 SymbolCurrentDirectory）/ Working directory (for SymbolCurrentDirectory)
 * @returns 對應的路徑陣列 / Corresponding path array
 * @throws TypeError 當傳入不支援的類型時 / When an unsupported type is passed
 */
function getPathsByType(valueType, cwd) {
    const paths = [];
    switch (valueType) {
        case SymbolGlobal:
            // 全域路徑：同時包含 Yarn 和 Npm 的套件目錄
            // Global paths: includes both Yarn and Npm package directories
            paths.push(get_global_dirs_1.yarn.packages);
            paths.push(get_global_dirs_1.pnpm.packages);
        // paths.push(npm.packages)
        // break;
        case SymbolGlobalNpm:
            // 全域 Npm 套件目錄 / Global Npm package directory
            paths.push(get_global_dirs_1.npm.packages);
            let detectFnmByAllResult = (0, fnm_detect_1.detectFnmByAll)();
            if (detectFnmByAllResult.isFnm) {
                paths.push((0, path_1.join)(detectFnmByAllResult.fnmPath, 'node_modules'));
            }
            break;
        case SymbolCurrentDirectory:
            // 當前目錄：使用傳入的 cwd 或 process.cwd()
            // Current directory: use provided cwd or process.cwd()
            paths.push(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
            break;
        case SymbolGlobalYarn:
            // 全域 Yarn 套件目錄 / Global Yarn package directory
            paths.push(get_global_dirs_1.yarn.packages);
            break;
        case SymbolGlobalPnpm:
            // 全域 Pnpm 套件目錄 / Global Pnpm package directory
            paths.push(get_global_dirs_1.pnpm.packages);
            break;
        case SymbolModuleMain:
            // 主模組路徑：若存在且非當前模組 / Main module path: if exists and not current module
            if (typeof module !== 'undefined' && require.main !== module) {
                paths.push(require.main.path);
            }
            break;
        default:
            throw new TypeError(`Not supported type: ${valueType}`);
    }
    return paths;
}
exports.default = getPathsByType;
//# sourceMappingURL=index.js.map
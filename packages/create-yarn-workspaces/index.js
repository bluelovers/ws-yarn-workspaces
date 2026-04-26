"use strict";
/**
 * 創建 Yarn Workspaces 工具模組
 * Yarn Workspaces Creation Tool Module
 *
 * 提供初始化 Yarn Workspaces 專案結構的功能，包含 package.json 設定、
 * Lerna 整合、目錄創建與靜態檔案複製等功能。
 * Provides functionality to initialize Yarn Workspaces project structure,
 * including package.json configuration, Lerna integration, directory creation,
 * and static file copying.
 *
 * @author user
 * @since 2018/5/13/013
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYarnWorkspaces = createYarnWorkspaces;
exports._createYarnWorkspaces = _createYarnWorkspaces;
exports.createDirByPackages = createDirByPackages;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const logger_1 = require("debug-color2/logger");
const static_file_1 = require("@yarn-tool/static-file");
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = require("sort-package-json3");
const lib_1 = require("./lib");
const util_1 = require("./lib/util");
const wsCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/ws/wsCopyStaticFiles");
const find_root_1 = require("@yarn-tool/find-root");
const upath2_2 = require("upath2");
tslib_1.__exportStar(require("./lib/index"), exports);
tslib_1.__exportStar(require("./lib/util"), exports);
/**
 * 創建 Yarn Workspaces 主函式
 * Main function to create Yarn Workspaces
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況
 * Checks and creates workspace project structure, handling existing packages
 * and parent workspaces
 *
 * @param cwd - 工作目錄路徑 / Working directory path
 * @param options - 配置選項 / Configuration options
 * @returns 是否成功創建 / Whether creation was successful
 */
function createYarnWorkspaces(cwd, options = {}) {
    var _a;
    // 處理第一個參數可能是選項物件的情況
    // Handle case where first argument might be options object
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    // 預設使用當前工作目錄 / Default to current working directory
    cwd !== null && cwd !== void 0 ? cwd : (cwd = process.cwd());
    // 尋找專案根目錄資訊 / Find project root information
    const rootData = (0, find_root_1.findRootLazy)({
        cwd,
    });
    // 標準化路徑 / Normalize path
    cwd = (0, upath2_2.normalize)((_a = rootData === null || rootData === void 0 ? void 0 : rootData.cwd) !== null && _a !== void 0 ? _a : cwd);
    // 取得 Package 根目錄與 Workspaces 路徑
    // Get package root directory and workspace path
    let root = rootData === null || rootData === void 0 ? void 0 : rootData.pkg;
    let ws = rootData === null || rootData === void 0 ? void 0 : rootData.ws;
    let targetPath = (0, upath2_1.resolve)(root || cwd);
    // 除錯輸出 / Debug output
    options.debug && logger_1.consoleLogger.debug({
        targetPath,
        ws,
        options,
    });
    /**
     * 檢查是否已存在 Package
     * Check if package already exists
     */
    if (!options.ignoreExistsPackage && root) {
        logger_1.consoleLogger.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return false;
    }
    else if (root) {
        // 忽略已存在的 Package / Ignore existing package
        logger_1.consoleLogger.warn(`ignore exists package "${root}"`);
    }
    /**
     * 檢查是否已存在 Workspaces
     * Check if workspace already exists
     */
    if (ws) {
        // 檢查目標路徑是否與現有 Workspace 相同
        // Check if target path is same as existing workspace
        let bool = !(0, util_1.isSamePath)(targetPath, ws);
        logger_1.consoleLogger.warn(`detect exists workspace "${ws}"`);
        if (bool) {
            // 根據選項決定是否忽略父層 Workspaces
            // Decide whether to ignore parent workspaces based on options
            if (options.ignoreParentWorkspaces) {
                logger_1.consoleLogger.warn(`ignoreParentWorkspaces = true`);
                bool = false;
            }
            else {
                logger_1.consoleLogger.error(`target path already is workspace`);
            }
        }
        if (bool) {
            return false;
        }
    }
    return _createYarnWorkspaces(targetPath);
}
/**
 * 內部創建 Workspaces 實作函式
 * Internal implementation function for creating workspaces
 *
 * 執行實際的 Workspaces 初始化工作，包含：
 * - 讀取並更新 Lerna 配置
 * - 創建或更新 package.json
 * - 複製靜態範本檔案
 * - 創建 packages 目錄
 *
 * Performs actual workspace initialization including:
 * - Reading and updating Lerna configuration
 * - Creating or updating package.json
 * - Copying static template files
 * - Creating packages directory
 *
 * @param targetPath - 目標路徑 / Target path
 * @param options - 配置選項 / Configuration options
 * @returns 是否成功 / Whether successful
 */
function _createYarnWorkspaces(targetPath, options = {}) {
    var _a;
    logger_1.consoleLogger.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    /**
     * 嘗試讀取現有的 lerna.json 配置
     * Try to read existing lerna.json configuration
     */
    {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        if ((0, fs_extra_1.existsSync)(file)) {
            let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
            /**
             * 清理空的 packages 陣列
             * Clean up empty packages array
             */
            if (json.packages && !Object.keys(json.packages).length) {
                json.packages = undefined;
            }
            lerna = json;
        }
    }
    /**
     * 預設 packages 目錄模式
     * Default packages directory pattern
     */
    let packages = lerna && lerna.packages || [
        "packages/*",
    ];
    let file = (0, upath2_1.join)(targetPath, 'package.json');
    /**
     * 處理 package.json 不存在的情況
     * Handle case when package.json does not exist
     */
    if (!(0, fs_extra_1.existsSync)(file)) {
        // 使用目錄名作為預設 Package 名稱
        // Use directory name as default package name
        let name = (0, upath2_1.basename)(targetPath);
        // 創建目標目錄（如果不存在）
        // Create target directory if it doesn't exist
        if (!(0, fs_extra_1.existsSync)(targetPath)) {
            (0, fs_extra_1.mkdirSync)(targetPath);
        }
        // 合併預設配置與基本資訊
        // Merge default configuration with basic info
        pkg = Object.assign((0, lib_1.getDefaultPackageJson)(name), {
            name,
            workspaces: packages,
        });
        /**
         * 執行自定義初始化回呼
         * Execute custom initialization callback
         */
        if (options.initPackageJson) {
            let ret = options.initPackageJson(pkg);
            if (ret) {
                pkg = ret;
            }
        }
    }
    else {
        /**
         * 處理已存在的 package.json
         * Handle existing package.json
         */
        let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
        let workspaces;
        /**
         * 解析現有的 workspaces 配置
         * Parse existing workspaces configuration
         */
        if (json.workspaces && Object.keys(json.workspaces).length) {
            workspaces = json.workspaces;
            /**
             * 支援 nohoist 配置格式
             * Support nohoist configuration format
             * @see https://yarnpkg.com/blog/2018/02/15/nohoist/
             */
            // @ts-ignore
            packages = workspaces.packages || workspaces;
        }
        else {
            workspaces = packages;
        }
        /**
         * 更新 Package.json 內容
         * Update package.json content
         */
        pkg = Object.assign(json, {
            "private": true,
            "workspaces": workspaces,
        });
        /**
         * 合併預設腳本與欄位
         * Merge default scripts and fields
         */
        Object.entries((0, lib_1.getDefaultPackageJson)(json.name))
            .forEach(([field, value]) => {
            var _a, _b;
            /**
             * 特殊處理 scripts 欄位：合併而非覆蓋
             * Special handling for scripts field: merge instead of overwrite
             */
            if (field === 'scripts') {
                (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
                pkg.scripts = {
                    // @ts-ignore
                    ...value,
                    ...pkg.scripts,
                };
            }
            else {
                // 使用空值合併運算子設置預設值
                // Use nullish coalescing operator for default values
                (_b = pkg[field]) !== null && _b !== void 0 ? _b : (pkg[field] = value);
            }
        });
    }
    /**
     * 寫入格式化後的 package.json
     * Write formatted package.json
     */
    let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(pkg), null, 2);
    (0, fs_extra_1.writeFileSync)(file, s);
    logger_1.consoleLogger.success(`create workspace package.json`);
    /**
     * 更新 Lerna 配置（如果存在且需要更新）
     * Update Lerna configuration if exists and needs updating
     */
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna['useWorkspaces'] !== true)) {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        // 更新為 Yarn Workspaces 模式
        // Update to Yarn Workspaces mode
        lerna.packages = packages;
        (_a = lerna.npmClient) !== null && _a !== void 0 ? _a : (lerna.npmClient = 'pnpm');
        // lerna['useWorkspaces'] = true;
        let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(lerna), null, 2);
        (0, fs_extra_1.writeFileSync)(file, s);
        logger_1.consoleLogger.info(`update lerna.json`);
    }
    /**
     * 複製靜態範本檔案
     * Copy static template files
     */
    const file_map = (0, wsCopyStaticFiles_1.getWsCopyStaticFiles)();
    (0, static_file_1.copyStaticFiles)({
        cwd: targetPath,
        file_map,
    });
    /**
     * 根據 packages 模式創建目錄
     * Create directories based on packages pattern
     */
    createDirByPackages(targetPath, packages);
    return true;
}
/**
 * 根據 packages 模式創建目錄
 * Create directories based on packages pattern
 *
 * 解析 packages 陣列中的目錄模式（如 "packages/*"），
 * 並創建對應的實體目錄。
 * Parses directory patterns from packages array (e.g., "packages/*")
 * and creates corresponding physical directories.
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param packages - packages 模式陣列 / Array of package patterns
 * @returns 是否有創建任何目錄 / Whether any directories were created
 */
function createDirByPackages(cwd, packages) {
    return packages.some(function (value) {
        let bool;
        // 提取路徑的第一個部分（目錄名稱）
        // Extract first part of path (directory name)
        let s = value.split(/[\/\\]/)[0];
        /**
         * 只處理不包含 glob 模式的純目錄路徑
         * Only handle pure directory paths without glob patterns
         */
        if (!/[!?\*{}\[\]]/.test(s)) {
            let dir = (0, upath2_1.join)(cwd, s);
            // 目錄不存在時創建 / Create directory if it doesn't exist
            if (!(0, fs_extra_1.existsSync)(dir)) {
                (0, fs_extra_1.mkdirSync)(dir);
            }
            return true;
        }
        return bool;
    });
}
/**
 * 預設導出創建函式
 * Default export of creation function
 */
exports.default = createYarnWorkspaces;
//# sourceMappingURL=index.js.map
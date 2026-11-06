"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._precheckYarnWorkspaces = _precheckYarnWorkspaces;
exports._createYarnWorkspaces = _createYarnWorkspaces;
exports.createDirByPackages = createDirByPackages;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const index_1 = require("./index");
const util_1 = require("./util");
const find_root_1 = require("@yarn-tool/find-root");
const staticFiles_1 = require("@yarn-tool/fix-all/lib/file/staticFiles");
const static_file_1 = require("@yarn-tool/static-file");
const sort_package_json3_1 = require("sort-package-json3");
const logger_1 = require("debug-color2/logger");
const wsCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/ws/wsCopyStaticFiles");
/**
 * 創建 Workspaces 的核心前置檢查邏輯
 *
 * 處理參數正規化、尋找專案根目錄，並檢查：
 * - 是否已存在 Package
 * - 是否已存在（父層）Workspaces
 *
 * @param cwd - 工作目錄路徑；也可直接傳入 IOptions
 * @param options - 配置選項
 * @returns 前置檢查結果；`ok` 為 false 時不應繼續創建
 */
function _precheckYarnWorkspaces(cwd, options = {}) {
    var _a;
    /** 處理第一個參數可能是選項物件的情況 */
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    /** 預設使用當前工作目錄 */
    cwd !== null && cwd !== void 0 ? cwd : (cwd = process.cwd());
    /** 尋找專案根目錄資訊 */
    const rootData = (0, find_root_1.findRootLazy)({
        cwd,
    });
    /** 標準化路徑 */
    cwd = (0, upath2_1.normalize)((_a = rootData === null || rootData === void 0 ? void 0 : rootData.cwd) !== null && _a !== void 0 ? _a : cwd);
    /** 取得 Package 根目錄與 Workspaces 路徑 */
    let root = rootData === null || rootData === void 0 ? void 0 : rootData.pkg;
    let ws = rootData === null || rootData === void 0 ? void 0 : rootData.ws;
    /** 實際要初始化的目標路徑：優先採用既有 package 根目錄，否則退回 cwd。 */
    let targetPath = (0, upath2_1.resolve)(root || cwd);
    /** 除錯輸出 */
    options.debug && logger_1.consoleLogger.debug({
        targetPath,
        ws,
        options,
    });
    /**
     * 檢查是否已存在 Package
     */
    if (!options.ignoreExistsPackage && root) {
        logger_1.consoleLogger.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return { ok: false, targetPath, options };
    }
    else if (root) {
        /** 忽略已存在的 Package */
        logger_1.consoleLogger.warn(`ignore exists package "${root}"`);
    }
    /**
     * 檢查是否已存在 Workspaces
     */
    if (ws) {
        /** 檢查目標路徑是否與現有 Workspace 相同 */
        let bool = !(0, util_1.isSamePath)(targetPath, ws);
        logger_1.consoleLogger.warn(`detect exists workspace "${ws}"`);
        if (bool) {
            /** 根據選項決定是否忽略父層 Workspaces */
            if (options.ignoreParentWorkspaces) {
                logger_1.consoleLogger.warn(`ignoreParentWorkspaces = true`);
                bool = false;
            }
            else {
                logger_1.consoleLogger.error(`target path already is workspace`);
            }
        }
        if (bool) {
            return { ok: false, targetPath, options };
        }
    }
    return { ok: true, targetPath, options };
}
/**
 * 內部創建 Workspaces 實作函式
 *
 * 執行實際的 Workspaces 初始化工作，包含：
 * - 讀取並更新 Lerna 配置
 * - 創建或更新 package.json
 * - 複製靜態範本檔案
 * - 創建 packages 目錄
 *
 * @param targetPath - 目標路徑
 * @param options - 配置選項
 * @returns 是否成功
 */
function _createYarnWorkspaces(targetPath, options = {}) {
    var _a;
    logger_1.consoleLogger.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    /**
     * 嘗試讀取現有的 lerna.json 配置
     */
    {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        if ((0, fs_extra_1.existsSync)(file)) {
            let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
            /**
             * 清理空的 packages 陣列
             */
            if (json.packages && !Object.keys(json.packages).length) {
                json.packages = undefined;
            }
            lerna = json;
        }
    }
    /**
     * 預設 packages 目錄模式
     */
    let packages = lerna && lerna.packages || [
        "packages/*",
    ];
    let file = (0, upath2_1.join)(targetPath, 'package.json');
    /**
     * 處理 package.json 不存在的情況
     */
    if (!(0, fs_extra_1.existsSync)(file)) {
        /** 使用目錄名作為預設 Package 名稱 */
        let name = (0, upath2_1.basename)(targetPath);
        /** 創建目標目錄（如果不存在） */
        if (!(0, fs_extra_1.existsSync)(targetPath)) {
            (0, fs_extra_1.mkdirSync)(targetPath);
        }
        /** 合併預設配置與基本資訊 */
        pkg = Object.assign((0, index_1.getDefaultPackageJson)(name), {
            name,
            workspaces: packages,
        });
        /**
         * 執行自定義初始化回呼
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
         */
        let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
        let workspaces;
        /**
         * 解析現有的 workspaces 配置
         */
        if (json.workspaces && Object.keys(json.workspaces).length) {
            workspaces = json.workspaces;
            /**
             * 支援 nohoist 配置格式
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
         */
        pkg = Object.assign(json, {
            "private": true,
            "workspaces": workspaces,
        });
        /**
         * 合併預設腳本與欄位
         */
        Object.entries((0, index_1.getDefaultPackageJson)(json.name))
            .forEach(([field, value]) => {
            var _a, _b;
            /**
             * 特殊處理 scripts 欄位：合併而非覆蓋
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
                /** 使用空值合併運算子設置預設值 */
                (_b = pkg[field]) !== null && _b !== void 0 ? _b : (pkg[field] = value);
            }
        });
    }
    /**
     * 寫入格式化後的 package.json
     */
    let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(pkg), null, 2);
    (0, fs_extra_1.writeFileSync)(file, s);
    logger_1.consoleLogger.success(`create workspace package.json`);
    /**
     * 更新 Lerna 配置（如果存在且需要更新）
     */
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna['useWorkspaces'] !== true)) {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        /** 更新 Workspaces 模式 */
        lerna.packages = packages;
        (_a = lerna.npmClient) !== null && _a !== void 0 ? _a : (lerna.npmClient = 'pnpm');
        // lerna['useWorkspaces'] = true;
        let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(lerna), null, 2);
        (0, fs_extra_1.writeFileSync)(file, s);
        logger_1.consoleLogger.info(`update lerna.json`);
    }
    /**
     * 複製靜態範本檔案
     */
    const file_map = (0, wsCopyStaticFiles_1.getWsCopyStaticFiles)();
    /**
     * 複製靜態範本檔案
     *
     * 此呼叫點 addStaticFiles 預設為 true，可用 noStaticFiles 關閉
     */
    if ((0, staticFiles_1._isAddStaticFilesOrReset)(options, true)) {
        (0, static_file_1.copyStaticFiles)({
            cwd: targetPath,
            file_map,
        });
    }
    /**
     * 根據 packages 模式創建目錄
     */
    createDirByPackages(targetPath, packages);
    return true;
}
/**
 * 根據 packages 模式創建目錄
 *
 * 解析 packages 陣列中的目錄模式（如 "packages/*"），
 * 並創建對應的實體目錄。
 *
 * @param cwd - 當前工作目錄
 * @param packages - packages 模式陣列
 * @returns 是否有創建任何目錄
 */
function createDirByPackages(cwd, packages) {
    return packages.some(function (value) {
        let bool;
        /** 提取路徑的第一個部分（目錄名稱） */
        let s = value.split(/[\/\\]/)[0];
        /**
         * 只處理不包含 glob 模式的純目錄路徑
         */
        if (!/[!?\*{}\[\]]/.test(s)) {
            let dir = (0, upath2_1.join)(cwd, s);
            /** 目錄不存在時創建 */
            if (!(0, fs_extra_1.existsSync)(dir)) {
                (0, fs_extra_1.mkdirSync)(dir);
            }
            return true;
        }
        return bool;
    });
}
//# sourceMappingURL=core.js.map
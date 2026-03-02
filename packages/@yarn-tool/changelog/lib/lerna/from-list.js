"use strict";
/**
 * 基於套件列表更新 Changelog 模組
 * Update Changelog Based on Package List Module
 *
 * 根據工作區根目錄自動查找並更新指定套件的 Changelog
 * Automatically finds and updates changelog for specified package based on workspace root
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelogByCwd = updateChangelogByCwd;
const tslib_1 = require("tslib");
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = require("@yarn-tool/find-root");
const update_1 = tslib_1.__importDefault(require("./update"));
const lodash_1 = require("lodash");
/**
 * 根據工作目錄更新 Changelog
 * Update changelog based on working directory
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Partial<IOptionsWithType<IOptionsUpdateChangelog>>} [options] - 更新選項 / Update options
 * @returns {Promise<object>} 包含更新結果和元資訊的物件 / Object containing update result and metadata
 */
function updateChangelogByCwd(cwd, options) {
    /**
     * 查找工作區根資訊
     * Find workspace root information
     */
    let rootData = (0, find_root_1.findRoot)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
    });
    /**
     * 禁止在工作區根目錄建立 Changelog
     * Disallow creating changelog in workspace root
     */
    if (rootData.hasWorkspace && rootData.isWorkspace) {
        throw new Error(`disallow create changelog for workspace root`);
    }
    /**
     * 設定實際的套件目錄
     * Set actual package directory
     */
    cwd = rootData.pkg;
    /**
     * 從路徑獲取套件資訊
     * Get package info from path
     */
    let pkg = (0, ws_pkg_list_1.wsPkgListableFromPaths)([
        rootData.pkg,
    ])[0];
    /**
     * 合併選項
     * Merge options
     */
    options = {
        ...options,
    };
    /**
     * 設定預設選項值
     * Set default option values
     */
    options = (0, lodash_1.defaults)(options !== null && options !== void 0 ? options : {}, {
        rootPath: rootData.root,
    });
    /**
     * 執行更新並返回結果
     * Execute update and return result
     */
    return (0, update_1.default)(pkg, options)
        .then(data => {
        return {
            ...data,
            cwd,
            rootPath: options.rootPath,
            options,
            pkg,
        };
    });
}
/**
 * 預設匯出函數
 * Default export function
 */
exports.default = updateChangelogByCwd;
//# sourceMappingURL=from-list.js.map
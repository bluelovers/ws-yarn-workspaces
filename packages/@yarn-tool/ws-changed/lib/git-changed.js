"use strict";
/**
 * Git Changed 模組
 * Git Changed Module
 *
 * 基於 Git 暫存區變更檢測工作區中受影響的套件
 * Detects affected packages in workspace based on Git staged changes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsGitChangedPrefix = wsGitChangedPrefix;
exports.wsGitChanged = wsGitChanged;
const tslib_1 = require("tslib");
const listable_1 = require("ws-pkg-list/lib/listable");
const git_util_1 = require("./git-util");
const workspaces_config_1 = tslib_1.__importDefault(require("workspaces-config"));
const glob_regex_1 = tslib_1.__importDefault(require("glob-regex"));
const array_hyper_unique_1 = require("array-hyper-unique");
const util_1 = require("ws-pkg-list/lib/util");
/**
 * 從 Git 暫存區變更中提取套件前綴
 * Extract package prefixes from Git staged changes
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件前綴列表的物件 / Object containing cwd and package prefix list
 */
function wsGitChangedPrefix(cwd, options) {
    /**
     * 獲取暫存區變更的目錄
     * Get staged directories
     */
    let data = (0, git_util_1.wsGitDiffStagedDir)(cwd !== null && cwd !== void 0 ? cwd : process.cwd(), options);
    /**
     * 獲取工作區設定
     * Get workspace config
     */
    let config = (0, workspaces_config_1.default)(data.cwd);
    /**
     * 將套件 glob 模式轉換為正規表示式
     * Convert package glob patterns to regex
     */
    let source = config.packages.map(p => {
        let re = (0, glob_regex_1.default)(p);
        let source = re.source.replace(/\$$/, '');
        return source;
    }).join('|');
    /**
     * 建立匹配套件路徑的正規表示式
     * Create regex for matching package paths
     */
    let re = new RegExp(`(${source})`, 'i');
    /**
     * 從變更目錄中提取套件前綴
     * Extract package prefixes from changed directories
     */
    let list = data.list
        .map(p => {
        var _a;
        return (_a = re.exec(p)) === null || _a === void 0 ? void 0 : _a[0];
    })
        .filter(r => r === null || r === void 0 ? void 0 : r.length);
    /**
     * 去重處理
     * Deduplication
     */
    (0, array_hyper_unique_1.array_unique_overwrite)(list);
    return {
        cwd: data.cwd,
        list,
    };
}
/**
 * 獲取 Git 暫存區變更影響的套件列表
 * Get list of packages affected by Git staged changes
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件列表的物件 / Object containing cwd and package list
 */
function wsGitChanged(cwd, options) {
    /**
     * 獲取變更的套件前綴
     * Get changed package prefixes
     */
    let data = wsGitChangedPrefix(cwd, options);
    /**
     * 根據前綴獲取完整的套件資訊
     * Get full package info from prefixes
     */
    let list = (0, listable_1.wsPkgListableFromPaths)(data.list, data.cwd);
    /**
     * 標準化套件列表資訊
     * Normalize package list info
     */
    list = (0, util_1.normalizeListableExtra)(list, data.cwd);
    return {
        cwd: data.cwd,
        list,
    };
}
/**
 * 預設匯出函數
 * Default export function
 */
exports.default = wsGitChanged;
//# sourceMappingURL=git-changed.js.map
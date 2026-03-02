"use strict";
/**
 * Git 工具模組
 * Git Utility Module
 *
 * 提供工作區與 Git 倉庫整合的工具函數
 * Provides utility functions for workspace and Git repository integration
 *
 * Created by user on 2020/6/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRootWithGitRoot = wsRootWithGitRoot;
exports.wsGitDiffStagedFiles = wsGitDiffStagedFiles;
exports.wsGitDiffStagedDir = wsGitDiffStagedDir;
const find_root_1 = require("@yarn-tool/find-root");
const diff_staged_1 = require("@git-lazy/diff-staged");
const core_1 = require("git-root2/core");
const path_is_same_1 = require("path-is-same");
/**
 * 驗證工作區根目錄與 Git 根目錄是否一致
 * Validate workspace root matches Git root
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @returns {string} 驗證通過的倉庫根目錄 / Validated repository root
 * @throws {Error} 當工作區根目錄與 Git 根目錄不一致時拋出錯誤
 *                 Throws error when workspace root doesn't match Git root
 */
function wsRootWithGitRoot(cwd) {
    /**
     * 查找工作區根資訊
     * Find workspace root info
     */
    let rooData = (0, find_root_1.findRoot)({
        cwd,
    });
    /**
     * 工作區根目錄
     * Workspace root
     */
    let ws_root = rooData.root;
    /**
     * Git 倉庫根目錄
     * Git repository root
     */
    let git_root = (0, core_1.gitRoot)(cwd);
    /**
     * 驗證兩者是否一致
     * Validate they match
     */
    if (!(0, path_is_same_1.pathIsSame)(ws_root, git_root)) {
        throw new Error(`ws_root not same as git_root\nws_root: ${ws_root}\ngit_root: ${git_root}`);
    }
    return ws_root;
}
/**
 * 獲取暫存區變更的檔案列表
 * Get list of staged files
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和檔案列表的物件 / Object containing cwd and file list
 */
function wsGitDiffStagedFiles(cwd, options) {
    /**
     * 驗證並獲取倉庫根目錄
     * Validate and get repository root
     */
    cwd = wsRootWithGitRoot(cwd);
    /**
     * 獲取暫存區變更的檔案
     * Get staged file changes
     */
    let list = (0, diff_staged_1.gitDiffStaged)(cwd, {
        bin: options === null || options === void 0 ? void 0 : options.gitBin,
    });
    return {
        cwd,
        list,
    };
}
/**
 * 獲取暫存區變更的目錄列表
 * Get list of staged directories
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和目錄列表的物件 / Object containing cwd and directory list
 */
function wsGitDiffStagedDir(cwd, options) {
    /**
     * 驗證並獲取倉庫根目錄
     * Validate and get repository root
     */
    cwd = wsRootWithGitRoot(cwd);
    /**
     * 獲取暫存區變更的目錄
     * Get staged directory changes
     */
    let list = (0, diff_staged_1.gitDiffStagedDir)(cwd, {
        bin: options === null || options === void 0 ? void 0 : options.gitBin,
    });
    return {
        cwd,
        list,
    };
}
//# sourceMappingURL=git-util.js.map
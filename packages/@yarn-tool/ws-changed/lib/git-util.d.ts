/**
 * Git 工具模組
 * Git Utility Module
 *
 * 提供工作區與 Git 倉庫整合的工具函數
 * Provides utility functions for workspace and Git repository integration
 *
 * Created by user on 2020/6/9.
 */
/**
 * 驗證工作區根目錄與 Git 根目錄是否一致
 * Validate workspace root matches Git root
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @returns {string} 驗證通過的倉庫根目錄 / Validated repository root
 * @throws {Error} 當工作區根目錄與 Git 根目錄不一致時拋出錯誤
 *                 Throws error when workspace root doesn't match Git root
 */
export declare function wsRootWithGitRoot(cwd: string): string;
/**
 * 獲取暫存區變更的檔案列表
 * Get list of staged files
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和檔案列表的物件 / Object containing cwd and file list
 */
export declare function wsGitDiffStagedFiles(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};
/**
 * 獲取暫存區變更的目錄列表
 * Get list of staged directories
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和目錄列表的物件 / Object containing cwd and directory list
 */
export declare function wsGitDiffStagedDir(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};

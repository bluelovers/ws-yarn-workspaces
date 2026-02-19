import Bluebird from 'bluebird';
/**
 * npmAutoFixAll 的選項介面
 * Options interface for npmAutoFixAll
 */
export interface INpmAutoFixAll {
    /**
     * 是否覆寫 hosted git 資訊
     * Whether to overwrite hosted git info
     */
    overwriteHostedGitInfo?: boolean;
    /**
     * Git 分支名稱
     * Git branch name
     */
    branch?: string;
    /**
     * 是否重置靜態檔案
     * Whether to reset static files
     */
    resetStaticFiles?: boolean;
}
/**
 * 自動修復 workspaces/package 的主要函數
 * Main function for auto-fixing workspaces/packages
 *
 * 執行以下操作：
 * 1. 尋找工作區根目錄
 * 2. 複製靜態檔案（.gitignore, .npmignore 等）
 * 3. 更新 git 相關資訊（homepage, repository, bugs）
 * 4. 修復 lerna.json 配置
 * 5. 遍歷所有套件進行修復
 *
 * Performs the following operations:
 * 1. Find workspace root directory
 * 2. Copy static files (.gitignore, .npmignore, etc.)
 * 3. Update git-related info (homepage, repository, bugs)
 * 4. Fix lerna.json configuration
 * 5. Iterate all packages for fixing
 *
 * @param {string} cwd - 當前工作目錄 / Current working directory
 * @param {INpmAutoFixAll} options - 選項 / Options
 * @returns {Bluebird<void>} Promise 物件 / Promise object
 *
 * @example
 * // 在當前目錄執行
 * await npmAutoFixAll(process.cwd());
 *
 * @example
 * // 帶選項執行
 * await npmAutoFixAll(process.cwd(), {
 *   overwriteHostedGitInfo: true,
 *   branch: 'main',
 *   resetStaticFiles: true,
 * });
 */
export declare function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll): Bluebird<void>;
export default npmAutoFixAll;

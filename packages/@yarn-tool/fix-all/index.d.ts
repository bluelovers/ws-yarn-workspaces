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
     *
     * 若為 true 會強制觸發 addStaticFiles（重置後重新加入）
     * If true, forces addStaticFiles (re-add after reset)
     */
    resetStaticFiles?: boolean;
    /**
     * 是否自動偵測並加入靜態檔案
     * Whether to auto-detect and add static files
     *
     * 僅在指定此選項時才會自動偵測並複製靜態檔案，預設不執行
     * Static files are only auto-detected/copied when this option is given; disabled by default
     *
     * 注意：resetStaticFiles 為 true 時會強制視為 true
     * Note: forced to true when resetStaticFiles is true
     */
    addStaticFiles?: boolean;
    /**
     * 是否略過（不加入）靜態檔案
     * Whether to skip (not add) static files
     *
     * 為 true 時 addStaticFiles 視為 false（優先於 addStaticFiles）
     * When true, addStaticFiles is treated as false (takes precedence over addStaticFiles)
     *
     * 注意：resetStaticFiles 為 true 時仍會強制加入
     * Note: static files are still force-added when resetStaticFiles is true
     */
    noStaticFiles?: boolean;
}
/**
 * 自動修復 workspaces/package 的主要函數
 * Main function for auto-fixing workspaces/packages
 *
 * 執行以下操作：
 * 1. 尋找工作區根目錄
 * 2. 複製靜態檔案（.gitignore, .npmignore 等，依 addStaticFiles / noStaticFiles / resetStaticFiles 判定）
 * 3. 更新 git 相關資訊（homepage, repository, bugs）
 * 4. 修復 lerna.json 配置
 * 5. 遍歷所有套件進行修復
 *
 * Performs the following operations:
 * 1. Find workspace root directory
 * 2. Copy static files (.gitignore, .npmignore, etc.; resolved via addStaticFiles / noStaticFiles / resetStaticFiles)
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
 *   addStaticFiles: true,
 *   noStaticFiles: false,
 *   resetStaticFiles: true,
 * });
 */
export declare function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll): Bluebird<void>;
export default npmAutoFixAll;

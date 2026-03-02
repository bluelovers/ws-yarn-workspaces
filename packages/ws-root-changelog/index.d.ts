/**
 * 工作區根目錄 Changelog 模組
 * Workspace Root Changelog Module
 *
 * 為 Monorepo 工作區根目錄生成包含所有套件 Changelog 連結的總覽文件
 * Generates overview document with links to all package changelogs for Monorepo workspace root
 */
/**
 * 列出所有套件的 Changelog 連結
 * List changelog links for all packages
 *
 * @param {string} cwd - 工作區根目錄 / Workspace root directory
 * @returns {string[]} Markdown 格式的套件連結列表 / List of package links in Markdown format
 * @throws {RangeError} 當工作區中沒有找到任何套件時拋出錯誤
 *                     Throws error when no packages found in workspace
 */
export declare function listChangelog(cwd: string): string[];
/**
 * 查找工作區根目錄路徑（內部函數）
 * Find workspace root path (internal function)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @returns {string} 工作區根目錄路徑 / Workspace root path
 */
export declare function _findWorkspacesRootPath(cwd?: string): string;
/**
 * 獲取工作區根目錄 Changelog 檔案路徑
 * Get workspace root changelog file path
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱，預設為 './CHANGELOG.md' / Filename, default is './CHANGELOG.md'
 * @returns {string} 完整的檔案路徑 / Full file path
 */
export declare function getWorkspacesRootChangelogPath(cwd?: string, filename?: string): string;
/**
 * 輸出工作區根目錄 Changelog（同步）
 * Output workspace root changelog (sync)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱 / Filename
 * @returns {Object} 包含檔案路徑和內容的物件 / Object containing file path and content
 */
export declare function outputWorkspacesRootChangelog(cwd?: string, filename?: string): {
    file: string;
    md: string;
};
/**
 * 輸出工作區根目錄 Changelog（非同步）
 * Output workspace root changelog (async)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱 / Filename
 * @returns {Promise<Object>} 包含檔案路徑和內容的物件 / Object containing file path and content
 */
export declare function outputWorkspacesRootChangelogAsync(cwd?: string, filename?: string): Promise<{
    file: string;
    md: string;
}>;
/**
 * 建立工作區根目錄 Changelog 內容
 * Create workspace root changelog content
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @returns {string} Markdown 格式的 Changelog 內容 / Changelog content in Markdown format
 */
export declare function createWorkspacesRootChangelog(cwd?: string): string;
/**
 * 預設匯出函數
 * Default export function
 */
export default createWorkspacesRootChangelog;

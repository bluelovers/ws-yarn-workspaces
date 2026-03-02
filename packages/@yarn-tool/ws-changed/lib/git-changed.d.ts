/**
 * Git Changed 模組
 * Git Changed Module
 *
 * 基於 Git 暫存區變更檢測工作區中受影響的套件
 * Detects affected packages in workspace based on Git staged changes
 */
import { IListableRowExtra } from 'ws-pkg-list';
/**
 * 從 Git 暫存區變更中提取套件前綴
 * Extract package prefixes from Git staged changes
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件前綴列表的物件 / Object containing cwd and package prefix list
 */
export declare function wsGitChangedPrefix(cwd?: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};
/**
 * 獲取 Git 暫存區變更影響的套件列表
 * Get list of packages affected by Git staged changes
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件列表的物件 / Object containing cwd and package list
 */
export declare function wsGitChanged(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: IListableRowExtra[];
};
/**
 * 預設匯出函數
 * Default export function
 */
export default wsGitChanged;

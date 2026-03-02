/**
 * Lerna Changed 模組
 * Lerna Changed Module
 *
 * 使用 Lerna 獲取工作區中已變更的套件列表
 * Uses Lerna to get list of changed packages in workspace
 */
import { IListableRowExtra } from 'ws-pkg-list';
/**
 * 獲取 Lerna 變更的套件列表
 * Get list of packages changed according to Lerna
 *
 * 執行 `lerna changed` 命令並解析輸出
 * Executes `lerna changed` command and parses output
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.lernaBin] - Lerna 執行檔路徑 / Lerna binary path
 * @returns {Object} 包含 cwd 和變更套件列表的物件 / Object containing cwd and changed packages list
 */
export declare function lernaChanged(cwd?: string, options?: {
    lernaBin?: string;
}): {
    cwd: string;
    list: IListableRowExtra[];
};
/**
 * 預設匯出函數
 * Default export function
 */
export default lernaChanged;

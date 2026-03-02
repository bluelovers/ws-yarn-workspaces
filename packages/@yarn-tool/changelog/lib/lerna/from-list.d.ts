/**
 * 基於套件列表更新 Changelog 模組
 * Update Changelog Based on Package List Module
 *
 * 根據工作區根目錄自動查找並更新指定套件的 Changelog
 * Automatically finds and updates changelog for specified package based on workspace root
 */
import { IListableRow } from 'ws-pkg-list';
import { IOptionsWithType, IOptionsUpdateChangelog } from '../types';
/**
 * 根據工作目錄更新 Changelog
 * Update changelog based on working directory
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Partial<IOptionsWithType<IOptionsUpdateChangelog>>} [options] - 更新選項 / Update options
 * @returns {Promise<object>} 包含更新結果和元資訊的物件 / Object containing update result and metadata
 */
export declare function updateChangelogByCwd(cwd?: string, options?: Partial<IOptionsWithType<IOptionsUpdateChangelog>>): Promise<{
    cwd: string;
    rootPath: string;
    options: Partial<IOptionsWithType<IOptionsUpdateChangelog>>;
    pkg: IListableRow;
    logPath: string;
    newEntry: string;
    version: string;
}>;
/**
 * 預設匯出函數
 * Default export function
 */
export default updateChangelogByCwd;

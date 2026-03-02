/**
 * Changelog 更新模組
 * Changelog Update Module
 *
 * 使用 conventional commits 更新套件的 CHANGELOG.md
 * Updates package CHANGELOG.md using conventional commits
 */
import { IListableRow } from 'ws-pkg-list';
import { IOptionsUpdateChangelog, IOptionsWithType, IReturnTypeUpdateChangelog } from '../types';
/**
 * 更新指定套件的 Changelog
 * Update changelog for specified package
 *
 * @param {IListableRow} pkg - 套件資訊 / Package information
 * @param {IOptionsWithType<IOptionsUpdateChangelog>} [options] - 更新選項 / Update options
 * @returns {Promise<IReturnTypeUpdateChangelog>} 更新結果 / Update result
 */
export declare function updateChangelog(pkg: IListableRow, options?: IOptionsWithType<IOptionsUpdateChangelog>): Promise<IReturnTypeUpdateChangelog>;
/**
 * 預設匯出更新函數
 * Default export update function
 */
export default updateChangelog;

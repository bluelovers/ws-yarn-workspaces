/**
 * 版本推薦模組
 * Version Recommendation Module
 *
 * 根據 conventional commits 分析推薦下一個版本號
 * Recommends next version based on conventional commits analysis
 */
import { IListableRow } from 'ws-pkg-list';
import { IOptionsRecommendVersion, IOptionsWithType } from '../types';
/**
 * 推薦套件的下個版本號
 * Recommend next version for package
 *
 * 分析 Git 歷史中的 conventional commits 來決定版本遞增類型
 * Analyzes conventional commits in Git history to determine version bump type
 *
 * @param {IListableRow} pkg - 套件資訊 / Package information
 * @param {IOptionsWithType<IOptionsRecommendVersion>} [options] - 推薦選項 / Recommendation options
 * @returns {Promise<string>} 推薦的版本號 / Recommended version
 */
export declare function recommendVersion(pkg: IListableRow, options?: IOptionsWithType<IOptionsRecommendVersion>): Promise<string>;
/**
 * 預設匯出推薦函數
 * Default export recommendation function
 */
export default recommendVersion;

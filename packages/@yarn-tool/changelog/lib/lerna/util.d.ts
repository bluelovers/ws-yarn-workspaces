/**
 * Lerna Changelog 工具函數模組
 * Lerna Changelog Utility Functions Module
 *
 * 處理選項的預設值和規範解析
 * Handles option defaults and preset resolution
 */
import { IOptionsWithType, IOptionsUpdateChangelog, IOptionsRecommendVersion } from '../types';
/**
 * 處理並標準化選項
 * Process and normalize options
 *
 * 設定預設值並解析 changelog 預設規範
 * Sets defaults and resolves changelog preset
 *
 * @param {IOptionsWithType<T>} [options] - 輸入選項 / Input options
 * @returns {IOptionsWithType<T>} 標準化後的選項 / Normalized options
 */
export declare function handleOptions<T extends IOptionsRecommendVersion | IOptionsUpdateChangelog>(options?: IOptionsWithType<T>): IOptionsWithType<T>;

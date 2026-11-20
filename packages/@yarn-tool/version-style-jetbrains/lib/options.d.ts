import { IDateInput, IOptionsRuntime, IParseVersionResult, IRequiredOptionsRuntime, IVersionStyleOptions } from './types';
/**
 * 處理版本樣式選項（核心函數）
 *
 * 內部核心函數，處理各種輸入類型並轉換為 dayjs 日期物件
 *
 * @param optionsOrDate - 選項或日期
 * @returns 處理後的選項
 */
export declare function _handleVersionStyleOptionsCore<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput): IOptionsRuntime<T>;
/**
 * 從選項取得解析後的版本資訊
 *
 * 優先使用 currentVersion，否則從日期產生版本
 *
 * @param processed - 處理後的選項
 * @returns 解析後的版本資訊
 */
export declare function _getParsedVersionFromOptions(processed: IRequiredOptionsRuntime): IParseVersionResult;
/**
 * 處理版本樣式選項
 *
 * 將可選的選項轉換為完整的物件，設定預設值
 * 支援接受 Date 或 IVersionStyleOptions
 *
 * @param optionsOrDate - 原始選項或 Date
 * @returns 處理後的選項
 */
export declare function _handleVersionStyleOptions<T extends IVersionStyleOptions = IVersionStyleOptions>(optionsOrDate?: T | IDateInput): IRequiredOptionsRuntime<T>;

import { IOptions } from '../types';
/**
 * 比較兩組選項是否等價
 * Check whether two option sets are equivalent
 *
 * 只比較 loose 與 includePrerelease 兩個「會影響解析結果」的欄位；
 * 其餘欄位（如 noAmpersand）不參與，因為它們只影響前置字串處理。
 * Only compares `loose` and `includePrerelease`, the fields that actually
 * change parsing output; other fields (e.g. noAmpersand) are excluded because
 * they only affect the earlier string-level handling.
 *
 * @param oldOptions - 原選項 / Original options
 * @param newOptions - 新選項 / New options
 * @returns 是否等價 / Whether they are equivalent
 */
export declare function _isSameOptions(oldOptions: IOptions, newOptions: IOptions): boolean;
/**
 * 把選項複製到目標物件
 * Copy options into the target object
 *
 * 以 `!!` 強制布林，確保複製後的欄位一定是真正的 boolean。
 * Coerced with `!!` so the copied fields are always real booleans.
 *
 * @param oldOptions - 目標選項（被就地修改）/ Target options (mutated in place)
 * @param newOptions - 來源選項 / Source options
 * @returns 同一個目標選項 / The same target options
 */
export declare function _copyOptions(oldOptions: IOptions, newOptions: IOptions): IOptions;
/**
 * 正規化選項中的布林欄位
 * Normalize the boolean fields of the options
 *
 * 第三個參數傳 true（mode），連同未定義的欄位也一併補成 false，
 * 讓 Range 實例上的 loose / includePrerelease 一定是布林值。
 * The third argument (`mode`) is true so even undefined fields are materialized
 * as false, guaranteeing `loose` / `includePrerelease` on a Range instance are
 * always boolean.
 *
 * @param options - 選項物件（會被原地修改）/ Options object (mutated in place)
 * @returns 正規化後的選項 / Normalized options
 */
export declare function _normalizeOptions(options: IOptions): IOptions;

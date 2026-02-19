/**
 * 名稱正規化模組
 * Name Normalization Module
 *
 * 此模組提供將快取名稱正規化的功能，
 * This module provides functionality to normalize cache names,
 * 確保名稱在檔案系統中安全可用。
 * ensuring names are safe for use in file systems.
 *
 * @module cache-path/lib/normalizeName
 */
import { IOptions } from './types';
/**
 * 正規化快取名稱
 * Normalize cache name
 *
 * 將快取名稱轉換為檔案系統安全的名稱格式。
 * Converts cache name to a file-system-safe name format.
 * 可選擇使用雜湊函數將名稱轉換為短字串。
 * Optionally uses hash function to convert name to short string.
 *
 * 轉換規則：
 * Conversion rules:
 * 1. 移除前後空白 / Remove leading/trailing whitespace
 * 2. 將非字母數字的字元替換為底線 / Replace non-alphanumeric characters with underscore
 * 3. 將連續的點號替換為底線 / Replace consecutive dots with underscore
 * 4. 將連續的底線合併為單一底線 / Merge consecutive underscores into single underscore
 *
 * @param {string} name - 要正規化的名稱 / Name to normalize
 * @param {boolean | Function} [hash] - 是否使用雜湊，或自訂雜湊函數 / Whether to use hash, or custom hash function
 * @returns {string} 正規化後的名稱 / Normalized name
 * @throws {Error} 當正規化結果不安全時（例如只剩底線）/ When normalized result is unsafe (e.g., only underscores)
 *
 * @example
 * normalizeName('@scope/package-name'); // '_scope_package-name' 或 '_scope_package_name'
 * normalizeName('@scope/package-name', true); // 'a1b2c3d4' (雜湊值 / hash value)
 */
export declare function normalizeName(name: string, hash?: IOptions["hash"]): string;

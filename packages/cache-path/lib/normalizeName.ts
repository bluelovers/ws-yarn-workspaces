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
import hashSum from 'hash-sum';

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
export function normalizeName(name: string, hash?: IOptions["hash"]): string
{
	/**
	 * 雜湊分支優先：一旦要求雜湊就不再做字元替換，
	 * 因為雜湊值本身已是安全且唯一的目錄名
	 * Hash branch first: once hashing is requested no character substitution happens,
	 * because the hash value is already a safe and unique directory name
	 */
	if (hash)
	{
		/**
		 * 允許呼叫端注入自有演算法（例如需跨版本穩定的雜湊），
		 * 此時完全沿用其結果，不做任何後處理
		 * Callers may inject their own algorithm (e.g. one that must stay stable across versions);
		 * its result is used as-is with no post-processing
		 */
		if (typeof hash === 'function')
		{
			return hash(name)
		}

		/**
		 * 內建雜湊採 hash-sum，回傳短字串以避免 Windows 路徑長度上限
		 * Built-in hashing uses hash-sum, which returns a short string that avoids Windows path length limits
		 */
		return hashSum(name);
	}

	/**
	 * 正規化轉換：四個步驟的順序不可調換，
	 * 先收斂特殊字元、再收斂點號與底線，才能避免殘留連續分隔符
	 * Normalization steps: the four steps must stay ordered —
	 * collapsing special chars first, then dots and underscores, avoids leftover separators
	 */
	const normalized = name
		.trim()                                    /** 移除前後空白 / Remove leading/trailing whitespace */
		.replace(/[^\w\-\.]/g, '_')               /** 替換特殊字元為底線 / Replace special chars with underscore */
		.replace(/\.+/g, '_')                     /** 替換連續點號為底線 / Replace consecutive dots with underscore */
		.replace(/_+/g, '_')                      /** 合併連續底線 / Merge consecutive underscores */
	;

	/**
	 * 只剩底線代表原名稱毫無可辨識內容，
	 * 放行會讓多個不同名稱碰撞到同一目錄，故直接拋錯
	 * An all-underscore result means the original name had no identifiable content;
	 * allowing it would collide unrelated names into one directory, so it throws instead
	 */
	if (!/[^_]/.test(normalized))
	{
		throw new Error(`unsafe normalizeName { ${name} => ${normalized} }`)
	}

	return normalized
}

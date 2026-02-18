/**
 * 清理 package.json 空欄位的工具模組
 * Utility module for cleaning empty fields in package.json
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';

/**
 * 判斷值是否為空配置
 * Determine if value is an empty configuration
 *
 * 檢查值是否為 undefined、null、空物件或空字串
 * Check if value is undefined, null, empty object, or empty string
 *
 * @param {any[] | object | string | unknown} value - 要檢查的值 / Value to check
 * @returns {boolean} 是否為空配置 / Whether it's an empty configuration
 */
export function isEmptyConfig(value: any[] | object | string | unknown)
{
	return typeof value === 'undefined' || value === null || typeof value === 'object' && !Object.keys(value).length || typeof value === 'string' && !value.length;
}

/**
 * 清理空欄位的核心函數
 * Core function for cleaning empty fields
 *
 * 移除 package.json 中指定的空欄位
 * Remove specified empty fields from package.json
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @param {(keyof T)[]} keys - 要檢查的欄位名稱陣列 / Array of field names to check
 * @returns {T} 清理後的 package.json 物件 / Cleaned package.json object
 */
export function _fixEmptyFieldsCore<T extends IPackageJson>(pkg: T, root: string, keys: (keyof T)[])
{
	for (const key of keys)
	{
		if (isEmptyConfig(pkg[key]))
		{
			delete pkg[key];
		}
	}

	return pkg;
}

/**
 * 修復 package.json 中的空欄位
 * Fix empty fields in package.json
 *
 * 移除 bin 和 resolutions 欄位中的空值
 * Remove empty values from bin and resolutions fields
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @returns {T} 清理後的 package.json 物件 / Cleaned package.json object
 */
export function fixEmptyFields<T extends IPackageJson>(pkg: T, root: string)
{
	return _fixEmptyFieldsCore(pkg, root, [
		'bin',
		'resolutions',
	])
}

/**
 * 處理 package.json exports 欄位的工具模組
 * Utility module for handling package.json exports field
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { PackageExportsEntry, PackageExportsFallback } from '@ts-type/package-dts/types/package.json';
/**
 * 在 exports 物件中添加 package.json entry 的核心函數
 * Core function to add package.json entry in exports object
 *
 * 確保 exports 包含 './package.json' 入口點，讓外部可以匯入 package.json
 * Ensure exports includes './package.json' entry point for external package.json import
 *
 * @template T - exports 欄位類型 / exports field type
 * @param {T} pkgExports - package.json 的 exports 物件 / exports object from package.json
 * @returns {T} 修正後的 exports 物件 / Corrected exports object
 */
export declare function _pkgExportsAddPJsonEntryCore<T extends IPackageJson["exports"]>(pkgExports: T): T;
/**
 * 在 package.json 的 exports 欄位中添加 package.json entry
 * Add package.json entry to exports field in package.json
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @returns {T} 修正後的 package.json 物件 / Corrected package.json object
 */
export declare function pkgExportsAddPJsonEntry<T extends IPackageJson>(pkg: T): T;
/**
 * 判斷是否為有效的 package exports entry
 * Determine if it's a valid package exports entry
 *
 * 檢查 entry 是否以 './' 開頭且值不為空
 * Check if entry starts with './' and value is not empty
 *
 * @param {string} entry - exports 的鍵名 / exports key name
 * @param {PackageExportsEntry | PackageExportsFallback} value - exports 的值 / exports value
 * @returns {boolean} 是否為有效的 PackageExportsEntry / Whether it's a valid PackageExportsEntry
 */
export declare function _isPackageExportsEntry(entry: string | keyof keyof IPackageJson["exports"], value: PackageExportsEntry | PackageExportsFallback): value is PackageExportsEntry;
/**
 * 驗證 package exports 路徑是否存在
 * Verify if package exports paths exist
 *
 * 檢查 exports 中定義的所有檔案路徑是否存在於檔案系統中
 * Check if all file paths defined in exports exist in the file system
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {object} options - 選項 / Options
 * @param {string} options.cwd - 當前工作目錄 / Current working directory
 * @returns {null} 無返回值 / No return value
 * @throws {Error} 當 exports 路徑不存在時拋出錯誤 / Throws error when exports paths don't exist
 */
export declare function pkgExportsVerify<T extends IPackageJson>(pkg: T, options?: {
    cwd?: string;
}): null;

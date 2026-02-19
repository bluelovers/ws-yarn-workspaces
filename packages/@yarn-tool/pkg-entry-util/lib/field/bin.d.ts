/**
 * 處理 package.json entry 相關欄位的工具模組
 * Utility module for handling package.json entry-related fields
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
/**
 * 修復 bin 欄位的路徑
 * Fix the path of bin field
 *
 * 檢查 bin 檔案是否存在於根目錄，若不存在則檢查是否在 bin/ 子目錄中
 * Check if bin file exists in root directory, if not, check if it's in bin/ subdirectory
 *
 * @param {string} bin - bin 欄位的原始路徑 / Original path from bin field
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @returns {string | null} 修正後的路徑或 null（若無需修正）/ Corrected path or null (if no fix needed)
 */
export declare function fixBinPath(bin: string, root: string): string;
/**
 * 修復 package.json 的 bin 欄位路徑
 * Fix bin field paths in package.json
 *
 * 支援字串格式與物件格式的 bin 欄位，自動修正不正確的路徑
 * Supports both string and object format bin fields, automatically corrects incorrect paths
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @returns {T} 修正後的 package.json 物件 / Corrected package.json object
 */
export declare function fixPkgBinField<T extends IPackageJson>(pkg: T, root: string): T;

/**
 * 快取路徑取得模組
 * Cache Path Getter Module
 *
 * 此模組提供取得快取目錄路徑的同步和非同步函數，
 * This module provides synchronous and asynchronous functions to get cache directory paths,
 * 支援自訂名稱、雜湊和隨機目錄功能。
 * supporting custom names, hashing, and random directory features.
 *
 * @module cache-path/lib/getCachePath
 */
import { IOptions, ICachePathThunk } from './types';
import Bluebird from 'bluebird';
/**
 * 快取根目錄下的預設基礎目錄名稱
 * Default base directory name at cache root
 */
export declare const defaultBase = ".cache";
/**
 * 取得快取目錄路徑（同步版本）
 * Get cache directory path (synchronous version)
 *
 * 此函數會根據選項配置，返回適當的快取目錄路徑。
 * This function returns an appropriate cache directory path based on options configuration.
 * 支援多種呼叫方式和配置選項。
 * Supports multiple calling styles and configuration options.
 *
 * @param {string | IOptions} [_options] - 快取名稱或選項配置 / Cache name or options configuration
 * @param {IOptions} [opt] - 額外的選項配置 / Additional options configuration
 * @returns {string | ICachePathThunk} 快取目錄路徑或 thunk 函數 / Cache directory path or thunk function
 *
 * @example
 * // 取得預設快取目錄 / Get default cache directory
 * const cacheDir = getCachePath();
 *
 * @example
 * // 取得具名快取目錄 / Get named cache directory
 * const cacheDir = getCachePath('my-cache');
 *
 * @example
 * // 取得 thunk 函數以便組合路徑 / Get thunk function for path composition
 * const cacheThunk = getCachePath({ name: 'my-cache', thunk: true });
 * const filePath = cacheThunk('subdir', 'file.txt');
 */
export declare function getCachePath(options: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options?: IOptions): string;
export declare function getCachePath(options?: IOptions): string;
/**
 * 取得快取目錄路徑（非同步版本）
 * Get cache directory path (asynchronous version)
 *
 * 此函數是非同步版本的 getCachePath，返回 Bluebird Promise。
 * This function is the asynchronous version of getCachePath, returning a Bluebird Promise.
 * 適用於需要非同步檔案操作的場景。
 * Suitable for scenarios requiring asynchronous file operations.
 *
 * @param {string | IOptions} [options] - 快取名稱或選項配置 / Cache name or options configuration
 * @param {IOptions} [opt] - 額外的選項配置 / Additional options configuration
 * @returns {Bluebird<string | ICachePathThunk>} 快取目錄路徑或 thunk 函數的 Promise / Promise of cache directory path or thunk function
 *
 * @example
 * const cacheDir = await getCachePathAsync('my-cache');
 * console.log(cacheDir); // 快取目錄路徑 / Cache directory path
 */
export declare function getCachePathAsync(options: IOptions & {
    thunk: true;
}): Bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options: IOptions & {
    thunk: true;
}): Bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options?: IOptions): Bluebird<string>;
export declare function getCachePathAsync(options?: IOptions): Bluebird<string>;

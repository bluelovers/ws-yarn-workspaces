/**
 * 快取根目錄取得模組
 * Cache Root Directory Getter Module
 *
 * 此模組提供取得快取根目錄的同步和非同步函數，
 * This module provides synchronous and asynchronous functions to get cache root directory,
 * 會根據配置的順序嘗試多個可能的快取位置。
 * trying multiple possible cache locations based on configured order.
 *
 * @module cache-path/lib/getCacheRoot
 */
import Bluebird from 'bluebird';
import { IOptions } from './types';
/**
 * 取得快取根目錄（同步版本）
 * Get cache root directory (synchronous version)
 *
 * 此函數會根據配置的 fnOrder 順序，依序嘗試各種快取位置，
 * This function tries various cache locations in order based on configured fnOrder,
 * 返回第一個可寫入的目錄路徑。
 * returning the first writable directory path.
 *
 * @param {IOptions | string} [_options] - 選項配置或 cwd 路徑 / Options configuration or cwd path
 * @returns {string} 快取根目錄的絕對路徑 / Absolute path to cache root directory
 * @throws {Error} 當找不到可用的快取目錄時 / When no available cache directory is found
 *
 * @example
 * const cacheRoot = getCacheRoot();
 * console.log(cacheRoot); // 例如: '/Users/user/.cache' / e.g.: '/Users/user/.cache'
 */
export declare function getCacheRoot(_options?: IOptions | string): string;
/**
 * 取得快取根目錄（非同步版本）
 * Get cache root directory (asynchronous version)
 *
 * 此函數是非同步版本的 getCacheRoot，返回 Bluebird Promise。
 * This function is the asynchronous version of getCacheRoot, returning a Bluebird Promise.
 * 適用於需要非同步檔案操作的場景。
 * Suitable for scenarios requiring asynchronous file operations.
 *
 * @param {IOptions | string} [options] - 選項配置或 cwd 路徑 / Options configuration or cwd path
 * @returns {Bluebird<string>} 快取根目錄絕對路徑的 Promise / Promise of absolute path to cache root directory
 *
 * @example
 * const cacheRoot = await getCacheRootAsync();
 * console.log(cacheRoot); // 例如: '/Users/user/.cache' / e.g.: '/Users/user/.cache'
 */
export declare function getCacheRootAsync(options?: IOptions | string): Bluebird<string>;

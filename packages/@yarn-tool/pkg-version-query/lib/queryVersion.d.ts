/**
 * Query package versions with cache support.
 * 查詢套件版本並支援快取機制。
 *
 * @module queryVersion
 *
 * 主要功能：
 * - 從 npm registry 查詢套件版本
 * - 支援 LRU 快取，減少重複查詢
 * - 處理版本範圍語法 (如 ^, ~, npm: 協議)
 * - 錯誤處理與快取錯誤結果
 */
import { Options } from 'package-json';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from './types';
/**
 * Query package version with LRU cache.
 * 使用 LRU 快取查詢套件版本。
 *
 * @param name - Package name / 套件名稱
 * @param targetVersion - Target version or range (default: 'latest') / 目標版本或範圍
 * @param options - Query options / 查詢選項
 * @returns Promise resolving to version string / 回傳版本字串的 Promise
 *
 * @example
 * ```ts
 * const version = await queryVersionWithCache('lodash');
 * // => '4.17.21'
 *
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * // => '4.9.5'
 * ```
 */
export declare function queryVersionWithCache(name: string, targetVersion?: string, options?: IOptionsQueryVersion<Options>): Bluebird<string>;
export declare function queryVersion(name: string, targetVersion?: string, save?: boolean, options?: IOptionsQueryVersion<Options>): Bluebird<string>;
export default queryVersionWithCache;

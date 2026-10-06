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
/**
 * 查詢版本的核心流程：registry 查詢 → 失敗時正規化版本重試 → 結果回寫快取。
 *
 * Core query flow: registry lookup → normalise the version and retry on failure →
 * write the outcome back to the cache.
 *
 * @param name 套件名稱 / Package name
 * @param targetVersion 目標版本或範圍，預設 latest / Target version or range, defaults to latest
 * @param save 是否將結果寫回快取；正規化後的遞迴重試傳 false / Whether to write the outcome back to the cache; pass false for the normalised retry
 * @param options 查詢與快取選項 / Query and cache options
 * @returns 解析出的版本字串 / The resolved version string
 */
export declare function queryVersion(name: string, targetVersion?: string, save?: boolean, options?: IOptionsQueryVersion<Options>): Bluebird<string>;
export default queryVersionWithCache;

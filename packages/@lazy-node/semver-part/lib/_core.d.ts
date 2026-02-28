/**
 * 核心版本部分處理工具 / Core version part handling utilities
 *
 * @module @lazy-node/semver-part/lib/_core
 *
 * 此模組提供內部工具函數，用於將版本部分字串轉換為有效的 semver 版本字串。
 * This module provides internal utility functions for converting version part
 * strings into valid semver version strings.
 */
/**
 * 將部分版本轉換為不安全的完整版本字串
 * Convert a partial version to an unsafe full version string
 *
 * 當版本部分不完整時，使用 0.0.x 格式填補
 * When version parts are incomplete, pads with 0.0.x format
 *
 * @param part - 版本部分字串 / Version part string
 * @param defaultValue - 預設值 / Default value
 * @returns 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * _versionUnsafe('5'); // '0.0.5'
 * _versionUnsafe('5', '10'); // '0.0.5'
 * _versionUnsafe(undefined, '10'); // '0.0.10'
 * ```
 */
export declare function _versionUnsafe(part: string, defaultValue?: string): string;
/**
 * 將部分版本安全地轉換為完整版本字串
 * Safely convert a partial version to a full version string
 *
 * 嘗試智慧地補全版本字串
 * Attempts to intelligently complete version strings
 *
 * @param part - 版本部分字串 / Version part string
 * @returns 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * _versionSafe('1.2.3'); // '1.2.3' (已是完整版本)
 * _versionSafe('2.3'); // '0.2.3' (補上 major)
 * _versionSafe('5'); // '0.0.5' (僅有 patch)
 * ```
 */
export declare function _versionSafe(part: string): string;
/**
 * 將兩個版本部分標準化為相同格式的完整版本
 * Normalize two version parts to full versions of the same format
 *
 * 根據輸入的版本部分格式，智慧地選擇適當的補全策略
 * Intelligently selects appropriate completion strategy based on input format
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @returns 標準化後的版本元組 / Normalized version tuple
 *
 * @example
 * ```typescript
 * _part('1.2.3', '1.3.0'); // ['1.2.3', '1.3.0']
 * _part('2.3', '3.4'); // ['0.2.3', '0.3.4']
 * _part('5', '10'); // ['0.0.5', '0.0.10']
 * ```
 */
export declare function _part(part1: string, part2: string): [string, string];
/**
 * 將版本部分陣列合併為版本字串
 * Join version parts array into a version string
 *
 * @param parts - 版本部分陣列 / Array of version parts
 * @returns 版本字串 / Version string
 *
 * @example
 * ```typescript
 * partsToVersion(['1', '2', '3']); // '1.2.3'
 * partsToVersion(['1', '2', '3', 'beta']); // '1.2.3.beta'
 * ```
 */
export declare function partsToVersion(parts: string[]): string;
/**
 * 將版本字串分割為版本部分陣列
 * Split a version string into an array of version parts
 *
 * 最多返回三個部分，超過三個的部分會合併為第三個部分
 * Returns at most three parts; excess parts are merged into the third part
 *
 * @param version - 版本字串 / Version string
 * @returns 版本部分陣列 / Array of version parts
 *
 * @example
 * ```typescript
 * versionToParts('1.2.3'); // ['1', '2', '3']
 * versionToParts('1.2.3-beta.1'); // ['1', '2', '3-beta.1']
 * versionToParts('1.2'); // ['1', '2']
 * ```
 */
export declare function versionToParts(version: string): string[];

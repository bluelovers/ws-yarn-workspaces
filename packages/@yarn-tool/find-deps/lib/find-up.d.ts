/**
 * 向上依賴尋找模組
 * Upward Dependency Finder Module
 *
 * 此模組提供從指定套件向上尋找所有依賴此套件的功能，
 * This module provides functionality to find all packages that depend on specified packages upward,
 * 即找出「誰依賴了我」。
 * i.e., finding "who depends on me".
 *
 * @module find-deps/lib/find-up
 */
import { IListableRowExtraWithDeps } from 'ws-pkg-list';
/**
 * 遞迴尋找單一目標套件的向上依賴（核心實作）
 * Recursively find upward dependencies for a single target package (core implementation)
 *
 * 此函數會找出所有直接或間接依賴目標套件的套件，
 * This function finds all packages that directly or indirectly depend on the target package,
 * 並將結果儲存在 map 物件中。
 * storing results in the map object.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string} target - 目標套件名稱 / Target package name
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @param {Record<string, string[]>} [map={}] - 儲存結果的映射物件 / Map object to store results
 * @returns {Record<string, string[]>} 目標套件及其向上依賴列表的映射 / Mapping of target package to its upward dependency list
 */
export declare function findUpDepsDeepRecordCore<R extends IListableRowExtraWithDeps>(target: string, record: Record<string, R>, map?: Record<string, string[]>): Record<string, string[]>;
/**
 * 遞迴尋找多個目標套件的向上依賴（核心實作）
 * Recursively find upward dependencies for multiple target packages (core implementation)
 *
 * 此函數會對每個目標套件呼叫 findUpDepsDeepRecordCore。
 * This function calls findUpDepsDeepRecordCore for each target package.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string[]} targets - 目標套件名稱陣列 / Array of target package names
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @param {Record<string, string[]>} [map={}] - 儲存結果的映射物件 / Map object to store results
 * @returns {Record<string, string[]>} 每個目標套件及其向上依賴列表的映射 / Mapping of each target to its upward dependency list
 */
export declare function findUpDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(targets: string[], record: Record<string, R>, map?: Record<string, string[]>): Record<string, string[]>;
/**
 * 尋找多個目標套件的所有向上依賴
 * Find all upward dependencies for multiple target packages
 *
 * 此函數會分析指定的目標套件，返回每個目標及其向上依賴的排序列表。
 * This function analyzes specified target packages, returning a sorted list of each target and its upward dependencies.
 * 結果會依據依賴數量進行排序，依賴較多的排在前面。
 * Results are sorted by dependency count, with more dependencies first.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string[]} targets - 目標套件名稱陣列 / Array of target package names
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @returns {[string, string[]][]} 排序後的 [目標名稱, 向上依賴列表] 陣列 / Sorted array of [target name, upward dependency list] pairs
 *
 * @example
 * const upDeps = findUpDepsAllDeep(['pkg-a'], record);
 * // 返回 [['pkg-a', ['pkg-b', 'pkg-c']]] 表示 pkg-b 和 pkg-c 依賴 pkg-a
 * // Returns [['pkg-a', ['pkg-b', 'pkg-c']]] meaning pkg-b and pkg-c depend on pkg-a
 */
export declare function findUpDepsAllDeep<R extends IListableRowExtraWithDeps>(targets: string[], record: Record<string, R>): [string, string[]][];
export default findUpDepsAllDeep;

"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpDepsDeepRecordCore = findUpDepsDeepRecordCore;
exports.findUpDepsAllDeepRecordCore = findUpDepsAllDeepRecordCore;
exports.findUpDepsAllDeep = findUpDepsAllDeep;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const array_hyper_unique_1 = require("array-hyper-unique");
const find_1 = require("./find");
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
function findUpDepsDeepRecordCore(target, record, map = {}) {
    var _a, _b;
    // 若目標套件不存在或已處理過，直接返回
    // Return directly if target package doesn't exist or has been processed
    if (!record[target] || ((_a = map[target]) === null || _a === void 0 ? void 0 : _a.length)) {
        return map;
    }
    // 初始化目標套件的向上依賴列表
    // Initialize upward dependency list for target package
    map[target] = (_b = map[target]) !== null && _b !== void 0 ? _b : [];
    // 遍歷所有套件，找出依賴目標套件的套件
    // Traverse all packages to find those that depend on target package
    Object.values(record)
        .reduce((map, row) => {
        // 檢查此套件是否在任何依賴欄位中包含目標套件
        // Check if this package contains target in any dependency field
        let bool = types_1.packageJsonDependenciesFields
            .some(field => {
            var _a, _b;
            return (_b = (_a = row === null || row === void 0 ? void 0 : row[field]) === null || _a === void 0 ? void 0 : _a[target]) === null || _b === void 0 ? void 0 : _b.length;
        });
        // 若此套件依賴目標套件
        // If this package depends on target package
        if (bool) {
            // 將此套件加入目標的向上依賴列表
            // Add this package to target's upward dependency list
            map[target].push(row.name);
            // 遞迴尋找此套件的向上依賴
            // Recursively find upward dependencies of this package
            findUpDepsDeepRecordCore(row.name, record, map);
            // 將此套件的向上依賴也加入目標的列表
            // Add this package's upward dependencies to target's list
            map[target].push(...map[row.name]);
        }
        return map;
    }, map);
    // 移除重複的套件名稱
    // Remove duplicate package names
    (0, array_hyper_unique_1.array_unique_overwrite)(map[target]);
    return map;
}
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
function findUpDepsAllDeepRecordCore(targets, record, map = {}) {
    return targets
        .reduce((map, target) => {
        // 對每個目標執行向上依賴尋找
        // Execute upward dependency search for each target
        findUpDepsDeepRecordCore(target, record, map);
        return map;
    }, map);
}
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
function findUpDepsAllDeep(targets, record) {
    // 建立向上依賴映射
    // Build upward dependency map
    let map = findUpDepsAllDeepRecordCore(targets, record);
    // 建立向下依賴映射（用於排序）
    // Build downward dependency map (for sorting)
    let map2 = (0, find_1.findDepsAllDeepRecordCore)(Object.keys(map), record);
    // 將映射轉換為陣列
    // Convert map to array
    let list = Object.entries(map);
    // 依據依賴數量排序（多的在前）
    // Sort by dependency count (more first)
    list.sort((a, b) => {
        return b[1].length - a[1].length;
    });
    // 對每個目標的向上依賴列表進行排序
    // Sort upward dependency list for each target
    list.forEach(a => {
        a[1].sort((a, b) => {
            // 先依據向下依賴數量排序，若相同則依據向上依賴數量排序
            // Sort by downward dependency count first, then by upward dependency count if equal
            return (map2[a].length - map2[b].length) || (map[b].length - map[a].length);
        });
    });
    return list;
}
exports.default = findUpDepsAllDeep;
//# sourceMappingURL=find-up.js.map
/**
 * 向下依賴尋找模組
 * Downward Dependency Finder Module
 *
 * 此模組提供從指定套件向下尋找所有依賴套件的功能，
 * This module provides functionality to find all dependency packages downward from specified packages,
 * 遞迴遍歷整個依賴樹。
 * recursively traversing the entire dependency tree.
 *
 * @module find-deps/lib/find
 */

import { IListableRowExtra, IListableRowWithDeps, IListableRowExtraWithDeps } from 'ws-pkg-list';
import { packageJsonDependenciesFields } from '@ts-type/package-dts/lib/package-json/types';

/**
 * 遞迴尋找多個套件的所有深層依賴（核心實作）
 * Recursively find all deep dependencies for multiple packages (core implementation)
 *
 * 此函數會遍歷所有指定的套件名稱，遞迴找出其所有依賴，
 * This function traverses all specified package names, recursively finding all their dependencies,
 * 並將結果儲存在 map 物件中。
 * storing results in the map object.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string[]} names - 要尋找依賴的套件名稱陣列 / Array of package names to find dependencies for
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @param {Record<string, string[]>} [map={}] - 儲存結果的映射物件 / Map object to store results
 * @returns {Record<string, string[]>} 每個套件及其依賴列表的映射 / Mapping of each package to its dependency list
 */
export function findDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(names: string[],
	record: Record<string, R>,
	map: Record<string, string[]> = {},
)
{
	return names
		.reduce((map, name) => {
			// 若已處理過此套件，跳過
			// Skip if this package has already been processed
			if (map[name])
			{
				return map
			}

			// 遞迴尋找此套件的所有依賴
			// Recursively find all dependencies of this package
			let list = findDepsDeep(name, record);

			// 初始化此套件的依賴列表
			// Initialize dependency list for this package
			map[name] = map[name] ?? [];

			// 若有依賴，繼續遞迴處理
			// If there are dependencies, continue recursive processing
			if (list?.length)
			{
				findDepsAllDeepRecordCore(list, record, map)
			}

			// 將找到的依賴加入列表
			// Add found dependencies to the list
			map[name].push(...list);

			return map
		}, map)
	;
}

/**
 * 尋找多個套件的所有深層依賴
 * Find all deep dependencies for multiple packages
 *
 * 此函數會分析指定的套件，返回每個套件及其依賴的排序列表。
 * This function analyzes specified packages, returning a sorted list of each package and its dependencies.
 * 結果會依據依賴數量進行排序，依賴較少的排在前面。
 * Results are sorted by dependency count, with fewer dependencies first.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string[]} names - 要尋找依賴的套件名稱陣列 / Array of package names to find dependencies for
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @returns {[string, string[]][]} 排序後的 [套件名稱, 依賴列表] 陣列 / Sorted array of [package name, dependency list] pairs
 *
 * @example
 * const deps = findDepsAllDeep(['pkg-a', 'pkg-b'], record);
 * // 返回 [['pkg-a', ['dep1', 'dep2']], ['pkg-b', ['dep3']]]
 */
export function findDepsAllDeep<R extends IListableRowExtraWithDeps>(names: string[], record: Record<string, R>
): [string, string[]][]
{
	// 使用核心函數建立依賴映射
	// Build dependency map using core function
	let map = findDepsAllDeepRecordCore(names, record)

	// 將映射轉換為陣列
	// Convert map to array
	let list = Object.entries(map);

	// 依據依賴數量排序（少的在前）
	// Sort by dependency count (fewer first)
	list.sort((a, b) => {
		return (a[1].length - b[1].length)
	})

	// 對每個套件的依賴列表進行排序
	// Sort dependency list for each package
	list.forEach(a => {

		a[1].sort((a, b) => {
			return (map[a].length - map[b].length)
		})

	})

	return list
}

/**
 * 遞迴尋找單一套件的所有深層依賴
 * Recursively find all deep dependencies for a single package
 *
 * 此函數會遍歷套件的所有依賴欄位（dependencies, devDependencies 等），
 * This function traverses all dependency fields of a package (dependencies, devDependencies, etc.),
 * 遞迴找出所有在 workspace 中的依賴套件。
 * recursively finding all dependency packages that exist in the workspace.
 *
 * @template R - 套件記錄的類型 / Type of package record
 * @param {string} name - 要尋找依賴的套件名稱 / Package name to find dependencies for
 * @param {Record<string, R>} record - workspace 中所有套件的記錄 / Record of all packages in workspace
 * @param {string[]} [list=[]] - 儲存結果的陣列 / Array to store results
 * @returns {string[]} 所有依賴套件的名稱陣列 / Array of all dependency package names
 */
export function findDepsDeep<R extends IListableRowExtraWithDeps>(name: string,
	record: Record<string, R>,
	list: string[] = [],
)
{
	// 確認套件存在於記錄中
	// Confirm package exists in record
	if (name in record)
	{
		let row = record[name];

		// 遍歷所有依賴欄位（dependencies, devDependencies, peerDependencies 等）
		// Traverse all dependency fields (dependencies, devDependencies, peerDependencies, etc.)
		packageJsonDependenciesFields
			.forEach(field =>
			{
				// 遍歷此欄位中的所有依賴
				// Traverse all dependencies in this field
				Object.keys(row[field] ?? {})
					.forEach(name2 =>
					{
						// 若依賴存在於 workspace 中、尚未加入列表、且不是自己
						// If dependency exists in workspace, not yet in list, and not self
						if ((name2 in record) && !list.includes(name2) && name2 !== name)
						{
							// 加入依賴列表
							// Add to dependency list
							list.push(name2)

							// 遞迴尋找此依賴的依賴
							// Recursively find dependencies of this dependency
							findDepsDeep(name2, record, list);
						}

					})
				;

			})
		;

	}

	return list
}

export default findDepsAllDeep

/**
 * Workspace 版本修復工具
 * Workspace version fix utility
 *
 * 用於同步和修復 monorepo workspace 中的套件版本依賴
 * Used to sync and fix package version dependencies in monorepo workspaces
 */

import { wsPkgDepsListable } from 'ws-pkg-list/lib/deps-tree';
import { IListableRow, IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';
import {
	IPackageJsonDependenciesField,
	packageJsonDependenciesFields,
	IDependency,
} from '@ts-type/package-dts/lib/package-json/types';
import { listableToRecord } from 'ws-pkg-list/lib/util';
import { parseRange } from '@lazy-node/semver-simple-parse';
import { replaceSimpleSemVerVersion } from '@lazy-node/semver-simple-parse/lib/replaceSimpleSemVerVersion';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
import { EnumSemverVersion } from '@lazy-node/semver-ampersand/lib/const';

/**
 * 版本修復結果映射介面
 * Version fix result map interface
 */
export interface IMap<R extends IListableRow>
{
	/** 已變更的套件列表 / List of changed packages */
	changed: R[],
	/** 未變更的套件列表 / List of unchanged packages */
	others: R[],
	/** 版本資料映射 / Version data mapping */
	data: Record<string, string>,
}

/**
 * 執行時快取介面
 * Runtime cache interface
 */
export interface ICache<R extends IListableRow = IListableRow>{
	/** 可列出的套件列表 / Listable packages list */
	listable?: R[],
	/** 套件名稱到資料的映射 / Package name to data mapping */
	record?: Record<string, R>,
	/** 套件名稱列表 / Package names list */
	names?: string[],
	/** 結果映射 / Result map */
	map?: IMap<R>,
}

/**
 * 快取輸入類型（至少需要 listable 或 record）
 * Cache input type (requires at least listable or record)
 */
export type ICacheInput<R extends IListableRow = IListableRow> = ITSRequireAtLeastOne<ICache<R>, 'listable' | 'record'>;

/**
 * 處理執行時快取，初始化所有必要欄位
 * Process runtime cache, initialize all required fields
 *
 * @param {ICacheInput<R>} cache - 輸入快取物件 / Input cache object
 * @returns {Required<ICache<R>>} 完整快取物件 / Complete cache object
 */
export function handleRuntimeCache<R extends IListableRow>(cache: ICacheInput<R>)
{
	// 將套件列表轉換為以名稱為鍵的映射 / Convert package list to name-keyed map
	cache.record ??= listableToRecord(cache.listable);
	// 提取所有套件名稱 / Extract all package names
	cache.names ??= Object.keys(cache.record);

	// 初始化結果映射 / Initialize result map
	cache.map ??= {} as IMap<R>;

	// 初始化變更相關陣列 / Initialize change-related arrays
	cache.map.changed ??= [];
	cache.map.others ??= [];
	cache.map.data ??= {};

	return cache as Required<ICache<R>>
}

/**
 * 修復套件依賴版本的核心函數
 * Core function for fixing package dependency versions
 *
 * 將 workspace 內部套件的依賴版本更新為當前實際版本
 * Updates dependency versions of internal workspace packages to current actual versions
 *
 * @param {T} row - 套件 package.json 的依賴欄位 / Package.json dependency fields
 * @param {ICacheInput<R>} cache - 快取資料 / Cache data
 * @returns {Object} 修復結果 / Fix result
 */
export function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T, cache: ICacheInput<R>)
{
	const { record, names, map } = handleRuntimeCache(cache);

	/** 標記是否有版本變更 / Flag indicating if any version changed */
	let changed: boolean;

	// 遍歷所有依賴欄位（dependencies, devDependencies, peerDependencies 等）
	// Iterate through all dependency fields
	packageJsonDependenciesFields
		.forEach(field =>
		{
			if (row[field])
			{

				names
					.forEach(name =>
					{
						// 取得舊版本號 / Get old version
						const old = row[field][name];

						// 跳過未定義或萬用字元版本 / Skip undefined or wildcard versions
						if (typeof old !== 'undefined' && old !== EnumSemverVersion.STAR)
						{
							// 解析版本範圍 / Parse version range
							const parsed = parseRange(old);
							// 取得套件當前版本 / Get package current version
							const version = record[name].version;

							// 替換版本號並生成完整版本字串 / Replace version and generate full version string
							const semver = replaceSimpleSemVerVersion(parsed[0] as any, version).toFullString();

							// 如果版本有變更則更新 / Update if version changed
							if (semver !== old)
							{
								row[field][name] = semver;
								changed = true;
								map.data[name] = version;
							}
						}

					})
				;

			}
		})
	;

	return {
		row,
		map,
		changed,
		cache: cache as ICache<R>,
	}
}

/**
 * 修復 Workspace 版本的核心函數
 * Core function for fixing workspace versions
 *
 * 遍歷所有 workspace 套件並同步其內部依賴版本
 * Iterates through all workspace packages and syncs their internal dependency versions
 *
 * @param {R[]} listable - 可列出的套件列表 / Listable packages list
 * @param {string} [cwd] - 當前工作目錄 / Current working directory
 * @returns {Object} 修復結果包含變更與未變更的套件 / Fix result with changed and unchanged packages
 */
export function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string)
{
	// 初始化快取 / Initialize cache
	const cache = handleRuntimeCache({
			listable,
	});

	// 使用 reduce 遍歷所有套件並修復版本 / Use reduce to iterate all packages and fix versions
	const result = listable.reduce((map, row) =>
	{
		let changed: boolean;

		// 執行版本修復並解構結果 / Execute version fix and destructure result
		({
			changed,
			map,
		} = fixPkgDepsVersionsCore(row, cache));

		// 根據是否變更分類套件 / Categorize packages based on whether changed
		if (changed)
		{
			map.changed.push(row);
		}
		else
		{
			map.others.push(row);
		}

		return map
	}, cache.map);

	return {
		cwd,
		listable,
		record: cache.record,
		names: cache.names,
		...result,
	}
}

/**
 * 修復 Workspace 版本的主要入口函數
 * Main entry function for fixing workspace versions
 *
 * 自動偵測 workspace 中的所有套件並同步版本
 * Automatically detects all packages in workspace and syncs versions
 *
 * @param {string} [cwd] - 當前工作目錄，預設為 process.cwd() / Current working directory, defaults to process.cwd()
 * @returns {Object} 修復結果 / Fix result
 *
 * @example
 * // 修復當前目錄的 workspace 版本
 * const result = fixWsVersions();
 * console.log(`Changed: ${result.changed.length} packages`);
 */
export function fixWsVersions(cwd?: string)
{
	return fixWsVersionsCore(wsPkgDepsListable(cwd), cwd);
}

/** 預設導出 / Default export */
export default fixWsVersions

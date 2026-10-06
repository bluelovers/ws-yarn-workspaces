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
import { EnumOperatorBase } from '@lazy-node/semver-simple-parse/lib/types';

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
 * 預設 Workspace protocol 前綴
 * Default Workspace protocol prefix
 *
 * @see https://pnpm.io/workspaces#workspace-protocol-workspace
 */
export const DEFAULT_WORKSPACE_PROTOCOL = 'workspace:';

/**
 * Workspace protocol 相關選項
 * Options related to the Workspace protocol
 */
export interface IOptionsWorkspaceProtocol
{
	/**
	 * Workspace protocol 前綴，預設 `workspace:`
	 * Workspace protocol prefix, defaults to `workspace:`
	 *
	 * 為求未來擴充性可替換成其他 protocol；以字面比對，分隔符（如 `:`）需自行包含在內。
	 * Kept configurable so it can be swapped for another protocol in the future; matched literally,
	 * include the separator (e.g. `:`) yourself.
	 */
	protocol?: string;
}

/**
 * 取得目前使用的 Workspace protocol 前綴
 * Get the Workspace protocol prefix currently in use
 */
export function getWorkspaceProtocol(opts?: IOptionsWorkspaceProtocol): string
{
	return opts?.protocol ?? DEFAULT_WORKSPACE_PROTOCOL;
}

/**
 * 偵測版本字串是否為 Workspace protocol
 * Detect whether a version string uses the Workspace protocol
 */
export function isWorkspaceProtocol(value: unknown, opts?: IOptionsWorkspaceProtocol): value is string
{
	return typeof value === 'string' && value.startsWith(getWorkspaceProtocol(opts));
}

/**
 * 解析 Workspace protocol 的結果
 * Result of parsing a Workspace protocol specifier
 */
export interface IParsedWorkspaceProtocol
{
	/** 原始字串 / The original string */
	value: string;
	/** 偵測到的 protocol 前綴 / The detected protocol prefix */
	protocol: string;
	/** 移除 protocol 後的版本範圍 / The version range after removing the protocol */
	range: string;
}

/**
 * 解析 Workspace protocol，非 Workspace protocol 時回傳 null
 * Parse a Workspace protocol; returns null when it is not a Workspace protocol
 */
export function parseWorkspaceProtocol(value: string, opts?: IOptionsWorkspaceProtocol): IParsedWorkspaceProtocol | null
{
	const protocol = getWorkspaceProtocol(opts);

	if (isWorkspaceProtocol(value, opts))
	{
		return {
			value,
			protocol,
			range: value.slice(protocol.length),
		};
	}

	return null;
}

/**
 * 判斷移除 protocol 後的範圍是否為 bare operator（`*` / `^` / `~` / 空字串）
 * Whether the range (after removing the protocol) is a bare operator (`*` / `^` / `~` / empty)
 */
export function isWorkspaceProtocolBareRange(range: string): boolean
{
	return range === EnumSemverVersion.ANY
		|| range === EnumSemverVersion.STAR
		|| range === EnumOperatorBase.CARET
		|| range === EnumOperatorBase.TILDE;
}

/**
 * 以套件實際版本解析 bare operator 的選項
 * Options for resolving bare operators with the actual package version
 */
export interface IOptionsWorkspaceProtocolToRange extends IOptionsWorkspaceProtocol
{
	/**
	 * 套件實際版本，用於解析 bare operator（`*` / `^` / `~`）
	 * The actual package version, used to resolve bare operators (`*` / `^` / `~`)
	 */
	version?: string;
}

/**
 * 將 Workspace protocol 轉換為一般版本範圍
 * Convert a Workspace protocol specifier into a plain version range
 *
 * @example
 * workspaceProtocolToRange('workspace:*', { version: '1.5.0' })       // '1.5.0'
 * workspaceProtocolToRange('workspace:~', { version: '1.5.0' })       // '~1.5.0'
 * workspaceProtocolToRange('workspace:^', { version: '1.5.0' })       // '^1.5.0'
 * workspaceProtocolToRange('workspace:^1.5.0', { version: '1.5.0' })  // '^1.5.0'
 *
 * 非 Workspace protocol 時原樣回傳。
 * Returned as-is when it is not a Workspace protocol.
 */
export function workspaceProtocolToRange(value: string, opts?: IOptionsWorkspaceProtocolToRange): string
{
	const parsed = parseWorkspaceProtocol(value, opts);

	if (!parsed)
	{
		return value;
	}

	const { range } = parsed;
	const version = opts?.version;

	// `workspace:*` / `workspace:` → 套件實際版本
	// `workspace:*` / `workspace:` → the actual package version
	if (range === EnumSemverVersion.ANY || range === EnumSemverVersion.STAR)
	{
		return version ?? EnumSemverVersion.STAR;
	}

	// `workspace:^` / `workspace:~` → 保留 operator 並補上實際版本
	// `workspace:^` / `workspace:~` → keep the operator and append the actual version
	if (range === EnumOperatorBase.CARET || range === EnumOperatorBase.TILDE)
	{
		return typeof version === 'string' ? range + version : value;
	}

	// `workspace:^1.5.0` → `^1.5.0`（版本是否同步由呼叫端決定）
	// `workspace:^1.5.0` → `^1.5.0` (whether the version is synced is up to the caller)
	return range;
}

/**
 * 將一般版本範圍轉回 Workspace protocol（逆向轉換），並可更換輸出的 protocol
 * Convert a plain version range back into a Workspace protocol specifier (reverse conversion),
 * with a swappable output protocol
 *
 * @example
 * rangeToWorkspaceProtocol('^1.5.0')                                   // 'workspace:^1.5.0'
 * rangeToWorkspaceProtocol('workspace:^1.5.0')                         // 'workspace:^1.5.0'（冪等）
 * rangeToWorkspaceProtocol('workspace:^1.5.0', { protocol: 'custom:' }) // 'custom:^1.5.0'
 *
 * 純版本範圍不會包含 `:`，因此既有的 protocol 前綴會被移除後再接上目標 protocol，
 * 除了避免重複疊加，也能藉由 `protocol` 更換輸出的 protocol。
 * A plain version range never contains `:`, so any existing protocol prefix is removed before the
 * target protocol is prepended; this avoids double-prefixing and lets `protocol` swap the output.
 */
export function rangeToWorkspaceProtocol(value: string, opts?: IOptionsWorkspaceProtocol): string
{
	const protocol = getWorkspaceProtocol(opts);

	const idx = value.indexOf(':');
	const range = idx === -1 ? value : value.slice(idx + 1);

	return protocol + range;
}

export interface IOptionsFixWsVersions extends IOptionsWorkspaceProtocol
{
	/**
	 * 是否保留 Workspace protocol（`workspace:*` 等）
	 * Whether to keep the Workspace protocol (`workspace:*` and friends)
	 *
	 * 為 falsy 時（預設），Workspace protocol 會被轉換為一般版本。
	 * When falsy (the default), the Workspace protocol is converted into a plain version range.
	 *
	 * @see https://pnpm.io/workspaces#workspace-protocol-workspace
	 */
	saveWorkspaceProtocol?: boolean;
	/**
	 * 當前工作目錄 / Current working directory
	 */
	cwd?: string;
}

export function handleOptionsFixWsVersions(cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions): IOptionsFixWsVersions
{
	let options: IOptionsFixWsVersions = {};

	if (typeof cwd === 'object')
	{
		options = cwd ?? {};
	}
	else if (typeof cwd === 'string' && cwd.length > 0)
	{
		options = {
			cwd,
		};
	}

	if (opts)
	{
		if (!options)
		{
			options = opts;
		}
		else
		{
			options = {
				...options,
				...opts,
			};
		}
	}

	return options ?? {};
}

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
 * `saveWorkspaceProtocol` 為 falsy 時（預設），`workspace:*` 等 Workspace protocol 會被轉換為一般版本範圍。
 * When `saveWorkspaceProtocol` is falsy (the default), Workspace protocols such as `workspace:*`
 * are converted into plain version ranges.
 *
 * @param {T} row - 套件 package.json 的依賴欄位 / Package.json dependency fields
 * @param {ICacheInput<R>} cache - 快取資料 / Cache data
 * @param {IOptionsFixWsVersions} [opts] - 修復選項 / Fix options
 * @returns {Object} 修復結果 / Fix result
 */
export function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T, cache: ICacheInput<R>, opts?: IOptionsFixWsVersions)
{
	const options = handleOptionsFixWsVersions(opts);
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
							// 取得套件當前版本 / Get package current version
							const version = record[name].version;

							/** Workspace protocol 的解析結果；非 Workspace protocol 時為 null / Parsed Workspace protocol, null when not a Workspace protocol */
							const wsProtocol = isWorkspaceProtocol(old, options) ? parseWorkspaceProtocol(old, options) : null;

							/** 實際要修復的版本範圍（已移除 workspace protocol）/ The range to fix (workspace protocol stripped) */
							let range: string;
							/** 若需保留 Workspace protocol，則記錄要加回的前綴 / The prefix to re-apply when the Workspace protocol must be kept */
							let protocol: string | undefined;

							if (wsProtocol)
							{
								if (options.saveWorkspaceProtocol)
								{
									/**
									 * bare operator（* / ^ / ~）沒有版本可修復，維持原樣
									 * A bare operator (* / ^ / ~) carries no version to fix, so keep it as-is
									 */
									if (isWorkspaceProtocolBareRange(wsProtocol.range))
									{
										return;
									}

									range = wsProtocol.range;
									protocol = wsProtocol.protocol;
								}
								else
								{
									/**
									 * Workspace protocol → 一般版本範圍
									 */
									range = workspaceProtocolToRange(old, {
										protocol: wsProtocol.protocol,
										version,
									});
								}
							}
							else
							{
								range = old;
							}

							/** 解析版本範圍 */
							const parsed = parseRange(range);

							/** 替換版本號並生成完整版本字串 */
							const semver = (protocol ?? EnumSemverVersion.ANY) + replaceSimpleSemVerVersion(parsed[0] as any, version).toFullString();

							/** 如果版本有變更則更新 */
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
export function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions)
{
	const options = handleOptionsFixWsVersions(cwd, opts);

	/** 初始化快取 / Initialize cache */
	const cache = handleRuntimeCache({
			listable,
	});

	/* 使用 reduce 遍歷所有套件並修復版本 / Use reduce to iterate all packages and fix versions */
	const result = listable.reduce((map, row) =>
	{
		let changed: boolean;

		/** 執行版本修復並解構結果 / Execute version fix and destructure result */
		({
			changed,
			map,
		} = fixPkgDepsVersionsCore(row, cache, options));

		/** 根據是否變更分類套件 / Categorize packages based on whether changed */
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
		cwd: options.cwd,
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
export function fixWsVersions(cwd?: string | IOptionsFixWsVersions, opts?: IOptionsFixWsVersions)
{
	const options = handleOptionsFixWsVersions(cwd, opts);
	return fixWsVersionsCore(wsPkgDepsListable(options.cwd), options);
}

/** 預設導出 / Default export */
export default fixWsVersions

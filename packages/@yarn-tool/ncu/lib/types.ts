/**
 * Type definitions for @yarn-tool/ncu.
 * @yarn-tool/ncu 的類型定義。
 *
 * @packageDocumentation
 *
 * 包含 npm-check-updates 選項、版本快取、遠端套件查詢等相關類型。
 */
import { Argv } from 'yargs';
import IPackageJson from '@ts-type/package-dts/package-json';
import { IVersionValue, EnumVersionValue, IDependency } from '@ts-type/package-dts/lib/package-json/types';

import setupNcuToYargs from './cli';
import { FullMetadata, AbbreviatedMetadata } from 'package-json';
import { IUnpackYargsArgv } from '@yarn-tool/yargs-util';
import { RunOptions } from 'npm-check-updates';

export * from '@ts-type/package-dts/lib/package-json/types';

export type { IUnpackYargsArgv }

/**
 * npm 套件管理器的版本查詢方法 (npm resolution methods)
 * 鍵為我們對外使用的版本策略 (versionTarget)，值為 `npm-check-updates`
 * 內部 package-manager 方法名稱；兩者命名不同，因此需要這張對照表。
 * Keys are the public version strategies, values are the method names inside
 * `npm-check-updates`; the two vocabularies differ, hence this mapping table.
 */
export enum EnumPackageManagersNpmMethod
{
	'major' = 'greatestMajor',
	'minor' = 'greatestMinor',
	'latest' = 'latest',
	'greatest' = 'greatest',
	'newest' = 'newest'
}

/**
 * 版本快取鍵 (version cache key)
 * 三者共同決定一筆快取的唯一性：同一套件在不同策略或不同舊版本下不共用快取。
 * These three fields make a cache entry unique: the same package under another
 * strategy or another old version does not share the entry.
 */
export interface IVersionCacheMapKey
{
	/** 套件名稱 / Package name */
	name: string,
	/** 使用的版本解析策略 / Version resolution strategy used */
	versionTarget: EnumVersionValue,
	/** 更新前的版本（可能是範圍或策略關鍵字） / Version before update (may be a range or a strategy keyword) */
	version_old: IVersionValue,
}

/**
 * 版本快取值 (version cache value)
 * 在鍵的基礎上補上解析結果，供後續還原「更新前 → 更新後」對照。
 * Adds the resolved result on top of the key so the before/after mapping can be
 * rebuilt later.
 */
export interface IVersionCacheMapValue extends IVersionCacheMapKey
{
	/** 更新後的版本 / Version after update */
	version_new: IVersionValue,
}

/**
 * `setupNcuToYargs` 的回傳型別 (return type of `setupNcuToYargs`)
 * 用 `ReturnType` 從實作推導，選項增減時型別會自動跟著更新。
 * Derived from the implementation via `ReturnType`, so the type stays in sync
 * whenever options are added or removed.
 */
export type ISetupNcuToYargsReturnType = ReturnType<typeof setupNcuToYargs>;

/**
 * npm-check-updates 的執行選項 (options for npm-check-updates)
 * 由 `setupNcuToYargs` 解析出的 argv 型別（去掉本套件自行處理的 `filter`）
 * 與 `RunOptions.filter`、以及 JSON 更新結果欄位合併而成。
 * Merges the argv type produced by `setupNcuToYargs` (with `filter`, which this
 * package handles itself, omitted), `RunOptions.filter`, and the JSON update
 * result fields.
 */
export type IOptionsNpmCheckUpdates = Partial<
Omit<IUnpackYargsArgv<ISetupNcuToYargsReturnType>, 'filter'>> & Pick<RunOptions, 'filter'> & {
	/** 更新前的 package.json 內容，會被序列化成 `packageData` 傳給 ncu / Pre-update package.json content, serialised into `packageData` for ncu */
	json_old: IPackageJson;
	/** 操作的工作目錄 / Working directory of the operation */
	cwd?: string;
	/** 以字串提供的 package.json 內容 / package.json content provided as a string */
	packageData?: string;
	/** 套件管理器，程式化呼叫時一律被正規化為 npm / Package manager, always normalised to npm in programmatic use */
	packageManager?: 'npm' | 'bower';

	/** ncu 回傳的更新後 package.json / Updated package.json returned by ncu */
	json_new?: IPackageJson;
	/** 是否有任何更新發生 / Whether any update happened */
	json_changed?: boolean;

	/** 套件名稱 → 新版本的對照 / Map of package name to new version */
	list_updated?: Record<string, string>;

	/** 輸出等級，`silent` 會關閉表格輸出 / Output level, `silent` disables the table */
	loglevel?: 'silent' | 'verbose';

	/** 只在 major / minor 範圍內尋找最高版本 / Find the highest version within major or minor */
	semverLevel?: EnumVersionValue.major | EnumVersionValue.minor,

	/** 版本解析策略 / Version resolution strategy */
	versionTarget?: EnumVersionValue,

	/** 更新前的依賴對照，供表格與回報使用 / Pre-update dependency map, used by the table and reports */
	current?: IDependency;

	/** 允許跳離目前版本範圍的升級（例如 `~` 約束） / Allow upgrades that leave the current range (e.g. `~`) */
	noSafe?: boolean;
}

/**
 * @deprecated 請改用 {@link IOptionsNpmCheckUpdates} / use {@link IOptionsNpmCheckUpdates} instead
 */
export { IOptionsNpmCheckUpdates as IOptions }

/**
 * `package-json` 的回傳型別 (return type of `package-json`)
 * 視查詢欄位而回傳完整 (full) 或精簡 (abbreviated) 中繼資料。
 * Either the full or the abbreviated metadata, depending on the requested fields.
 */
export type IRomotePackageJsonReturnType = FullMetadata | AbbreviatedMetadata;

/**
 * 查詢遠端版本時的額外選項 (extra options for remote version queries)
 */
export interface IOptionsFetchVersion
{
	/** 要讀取的中繼資料欄位，預設 `versions` / Metadata field to read, defaults to `versions` */
	field?: string | 'time' | 'versions' | 'dist-tags.latest',

	/** 版本過濾器，用來只保留符合目前版本範圍的版本 / Version filter, used to keep only versions satisfying the current range */
	filter?(version: IVersionValue): boolean,

	/** 目前版本，供過濾器參考 / Current version, referenced by the filter */
	currentVersion?: IVersionValue,
}

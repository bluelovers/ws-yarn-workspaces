/**
 * 本套件共用的型別定義 (Shared type definitions)
 *
 * 集中放置安裝流程的選項 (Options) 與回傳值 (Return value) 介面，
 * 讓各模組之間共用同一組結構，避免型別重複宣告。
 *
 * Centralises the option and result interfaces used by the install flow
 * so every module shares a single definition instead of duplicating types.
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
import { IFindRootOptions, IFindRootReturnType } from '@yarn-tool/find-root';
import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { IOptionsAddDepsToPackageJson as IOptionsInstallDepsFromWorkspaces } from '@yarn-tool/pkg-deps-add';
import { installDepsFromYarnLockCore } from './installDepsFromYarnLock';
import { filterInstallDeps } from './installDeps';

/**
 * 重新匯出 workspace 安裝選項，讓使用端只需從本模組取得型別
 *
 * Re-exported so consumers can import the workspace install options
 * from this single type module.
 */
export type { IOptionsInstallDepsFromWorkspaces }

/**
 * 檢查安裝目標時的選項 (Options for checking an install target)
 */
export interface IOptionsCheckInstallTarget
{
	/**
	 * 是否忽略輸入的版本，一律查詢 `latest`
	 *
	 * When true, any version in the input is ignored and `latest` is queried.
	 */
	excludeVersion?: boolean;

	/**
	 * 已知的 package.json 內容，供存在性檢查使用
	 *
	 * The known package.json content used for the existence check.
	 */
	pkg?: IPackageJson;

	/**
	 * 是否先檢查套件是否已存在於依賴欄位
	 *
	 * Whether to check whether the package already exists in dependency fields first.
	 */
	checkExists?: boolean;
}

/**
 * 檢查安裝目標的回傳值 (Result of an install-target check)
 */
export interface IReturnTypeCheckInstallTarget
{
	/**
	 * 套件名稱，不含版本 (Package name without version)
	 */
	name: string;

	/**
	 * 預設要寫入的依賴字串，例如 `^1.2.3`
	 *
	 * The dependency string to write, e.g. `^1.2.3`.
	 */
	target: string;

	/**
	 * 檢查結果錯誤碼 (Result error code)
	 */
	error: EnumInstallTypesErrorCode;

	/**
	 * 供顯示的訊息，直接取自 registry 的棄用說明時可能為英文
	 *
	 * Human readable message; may come verbatim from the registry deprecation note.
	 */
	msg: string;
}

/**
 * 依查詢結果安裝時的選項 (Options when installing from a version query)
 */
export interface IOptionsInstallDepsFromQuery extends IOptionsInstallDepsFromWorkspaces
{
	/**
	 * 傳給版本查詢模組的選項，例如 registry 或 timeout 設定
	 *
	 * Options passed to the version query module (registry, timeout, ...).
	 */
	queryOptions?: IOptionsQueryVersion<Options>,
}

/**
 * 依 yarn.lock 安裝時的選項 (Options when installing from yarn.lock)
 *
 * 同時涵蓋版本查詢與 lock 條目分組兩組設定，因為流程需要先查遠端版本、
 * 再對照 lock 內的既有條目。
 *
 * Merges version-query and lock-grouping options, since the flow queries the
 * remote version first and then matches it against existing lock entries.
 */
export interface IOptionsInstallDepsFromYarnLock extends IOptionsInstallDepsFromQuery, IGroupYarnLockParsedEntriesOptions
{

}

/**
 * 強制補上指定鍵的工具型別 (Utility type that guarantees the given keys exist)
 *
 * 回傳值通常由空物件逐步填入，型別上無法表達「這些鍵一定存在」，
 * 因此以條件型別把 `K` 加進去，讓使用端不必再手動斷言。
 *
 * Results are built up from an empty object, so the type cannot express that
 * certain keys are always present; this conditional type adds `K` for callers.
 */
export type IFilteredRecord<T extends Record<string, any>, K extends string> = T extends Record<string, infer U>
	? T & Record<K, U>
	: T

/**
 * 新增的依賴清單，元素為 `[套件名稱, semver]`
 *
 * List of newly added dependencies as `[name, semver]` tuples.
 */
export type IAddedList = [name: string, semver: string][]

/**
 * 依賴變動的摘要 (Summary of dependency changes)
 */
export interface IResultInstallDepsChanged
{
	/**
	 * 本次實際新增的依賴 (Dependencies added by this run)
	 */
	added: IAddedList;

	/**
	 * 本來就存在、未被更動的套件名稱 (Packages that already existed)
	 */
	exists: string[];

	/**
	 * package.json 是否有被更動 (Whether package.json was modified)
	 */
	updated: boolean;
}

/**
 * 安裝流程取得的環境資訊 (Environment info collected during install)
 */
export interface IResultInstallDepsInfo
{
	/**
	 * 實際使用的操作目錄 (The working directory actually used)
	 */
	cwd: string;

	/**
	 * 尋找到的 workspace / 專案根目錄資料 (Resolved root data)
	 */
	rootData: IFindRootReturnType;

	/**
	 * 被修改的 package.json 內容 (The mutated package.json object)
	 */
	pkg: IPackageJson;
}

/**
 * 安裝流程的完整回傳值 (Full install result)
 *
 * `others` 是既不屬於工作區本地套件、也無法從 yarn.lock 取得版本的套件，
 * 需要交由呼叫端自行決定後續處理。
 *
 * `others` holds packages that are neither workspace-local nor resolvable from
 * yarn.lock, leaving the follow-up handling to the caller.
 */
export interface IResultInstallDeps extends IResultInstallDepsChanged, IResultInstallDepsInfo
{
	/**
	 * 未被處理的套件名稱 (Package names left unprocessed)
	 */
	others: string[];
}

/**
 * 過濾安裝目標後的回傳值 (Result after filtering install targets)
 *
 * 與 {@link IResultInstallDeps} 的差別在於此處回傳的是「已解析完成」的套件名稱，
 * 供後續直接產生安裝指令。
 *
 * Differs from {@link IResultInstallDeps} by returning fully resolved package
 * names, ready to be turned into an install command.
 */
export interface IResultFilterInstallDeps extends IResultInstallDepsChanged, IResultInstallDepsInfo
{
	/**
	 * 已解析完成的套件名稱 (Fully resolved package names)
	 */
	packageNames: string[];
}

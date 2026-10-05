/**
 * Created by user on 2024/5/31.
 *
 * fnm (Fast Node Manager) Environment Detection Module
 * fnm (Fast Node Manager) 環境偵測模組
 *
 * This module provides utilities to detect whether the current Node.js process
 * is running within an fnm-managed environment, and to extract related path information.
 * 本模組提供工具來偵測當前 Node.js 程序是否在 fnm 管理的環境中執行，並提取相關路徑資訊。
 */

import { dirname, join, normalize } from "upath2";
import { ITSMergeBoth, ITSOverwrite, ITSPartialPick, ITSPartialRecord, ITSTypeAndStringLiteral } from 'ts-type';
import { pathExists, pathExistsSync, realpathSync } from "fs-extra";
import { sortObjectKeys } from 'sort-object-keys2';

/**
 * Environment variables type for fnm detection
 * fnm 偵測用的環境變數類型
 *
 * @description
 * This type defines the environment variables that fnm sets when managing Node.js versions.
 * 此類型定義了 fnm 管理 Node.js 版本時設定的環境變數。
 *
 * - FNM_DIR: The main fnm directory where node versions and aliases are stored
 *            fnm 的主目錄，存放 node 版本和別名
 * - FNM_MULTISHELL_PATH: The current multishell path (temporary symlink directory)
 *                        當前的 multishell 路徑（臨時符號連結目錄）
 */
export type IDetectFnmByEnv = Record<string, string> & ITSPartialRecord<'FNM_DIR' | 'FNM_MULTISHELL_PATH', string>

/**
 * Detection method enumeration
 * 偵測方法列舉
 *
 * @description
 * Defines the two methods used to detect fnm environment:
 * 定義用於偵測 fnm 環境的兩種方法：
 *
 * - execpath: Detection via process.execPath (Node.js executable path)
 *             通過 process.execPath（Node.js 執行檔路徑）偵測
 * - env: Detection via environment variables (FNM_DIR, FNM_MULTISHELL_PATH)
 *        通過環境變數（FNM_DIR, FNM_MULTISHELL_PATH）偵測
 */
const enum EnumDetectFnmBy
{
	/** Detection via Node.js executable path / 通過 Node.js 執行檔路徑偵測 */
	execpath = 'execpath',
	/** Detection via environment variables / 通過環境變數偵測 */
	env = 'env',
}

/**
 * Type alias for detection method with string literal support
 * 支援字串字面量的偵測方法類型別名
 */
export type IEnumDetectFnmBy = ITSTypeAndStringLiteral<EnumDetectFnmBy>

/**
 * Base interface for fnm detection results
 * fnm 偵測結果的基礎介面
 *
 * @template T - The detection method type / 偵測方法類型
 *
 * @description
 * This interface defines the common structure returned by all fnm detection functions.
 * 此介面定義了所有 fnm 偵測函數返回的共同結構。
 */
export interface IDetectFnmByResult<T extends EnumDetectFnmBy = EnumDetectFnmBy>
{
	/**
	 * Whether fnm environment is detected
	 * 是否偵測到 fnm 環境
	 *
	 * @description
	 * True if the current process is running under fnm management.
	 * 若當前程序在 fnm 管理下執行則為 true。
	 */
	isFnm: boolean;

	/**
	 * Whether the resolved path exists
	 * 解析後的路徑是否存在
	 *
	 * 比 isFnm 更加安全的能夠確認 fnm 環境真實存在
	 */
	exists?: boolean;

	/**
	 * Detection source marker
	 * 偵測來源標記
	 *
	 * @description
	 * Indicates which detection method was used (execpath or env).
	 * 指示使用的偵測方法（execpath 或 env）。
	 */
	detectedBy: ITSTypeAndStringLiteral<T>;

	/**
	 * Type of fnm path detected
	 * 偵測到的 fnm 路徑類型
	 *
	 * @description
	 * Indicates the type of fnm path: fnm_multishells, aliases, or node-versions.
	 * 指示 fnm 路徑的類型：fnm_multishells、aliases 或 node-versions。
	 */
	fnmPathType?: EnumDetectFnmPathType;

	/**
	 * The detected fnm path
	 * 偵測到的 fnm 路徑
	 */
	fnmPath?: string;

	/**
	 * Real path after resolving symlinks (using realpathSync)
	 * 解析真實路徑後的路徑（使用 realpathSync）
	 *
	 * @description
	 * The actual path after resolving all symbolic links.
	 * 解析所有符號連結後的實際路徑。
	 */
	fnmPathReal?: string;

	/**
	 * FNM_DIR environment variable value
	 * FNM_DIR 環境變數值
	 *
	 * @description
	 * The main fnm directory path where node versions and aliases are stored.
	 * fnm 的主目錄路徑，存放 node 版本和別名。
	 * Example: 'C:/Users/User/AppData/Roaming/fnm'
	 */
	fnmDir?: string;

	/**
	 * Resolved multishell path
	 * 解析出的 multishell 路徑
	 *
	 * @description
	 * The temporary symlink directory created by fnm for the current shell session.
	 * fnm 為當前 shell 工作階段建立的臨時符號連結目錄。
	 */
	multishellPath?: string;

	/**
	 * Multishell directory (base path)
	 * Multishell 目錄（基礎路徑）
	 */
	multishellDir?: string;

	/**
	 * Multishell key (session identifier)
	 * Multishell 鍵值（工作階段識別碼）
	 */
	multishellKey?: string;

	/**
	 * Default alias path
	 * 預設別名路徑
	 */
	aliasesDefaultPath?: string;

	/**
	 * Real path of default alias
	 * 預設別名的真實路徑
	 */
	aliasesDefaultPathReal?: string;

	/**
	 * Whether the default alias is detected
	 * 此路徑是否與預設別名為相同路徑
	 */
	isSameAsAliasDefault?: boolean;

	/**
	 * Aliases directory path
	 * aliases 路徑
	 *
	 * @description
	 * Path to the fnm aliases directory.
	 * fnm 別名目錄的路徑。
	 */
	aliasesPath?: string;

	/**
	 * Alias name
	 * 別名名稱
	 */
	aliasesName?: string;

	/**
	 * Node version string
	 * Node 版本字串
	 */
	version?: string;

	/**
	 * Node version installation path
	 * node-versions installation 路徑
	 *
	 * @description
	 * Path to the specific Node.js version installation directory.
	 * 特定 Node.js 版本的安裝目錄路徑。
	 */
	installationPath?: string;
}

/**
 * Detection result specifically from execPath method
 * 來自 execPath 方法的偵測結果
 *
 * @description
 * Extends the base result with execpath detection method type.
 * 擴充基礎結果，加入 execpath 偵測方法類型。
 */
export interface IDetectFnmByExecPathResult extends IDetectFnmByResult<EnumDetectFnmBy.execpath>
{

}

/**
 * Detection result specifically from environment variables method
 * 來自環境變數方法的偵測結果
 *
 * @description
 * Extends the base result with env detection method type.
 * 擴充基礎結果，加入 env 偵測方法類型。
 */
export interface IDetectFnmByEnvResult extends IDetectFnmByResult<EnumDetectFnmBy.env>
{
}

/**
 * Combined detection result from all methods
 * 結合所有方法的偵測結果
 *
 * @description
 * This interface represents the comprehensive detection result that combines
 * information from both execpath and env detection methods.
 * 此介面表示綜合偵測結果，結合了 execpath 和 env 兩種偵測方法的資訊。
 *
 * @example
 * ```json
 * {
 * 	isFnm: true,
 * 	fnmPathType: 'fnm_multishells',
 * 	exists: true,
 * 	isSameAsAliasDefault: true,
 * 	fnmPath: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711',
 * 	fnmPathReal: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	fnmDir: 'C:/Users/User/AppData/Roaming/fnm',
 * 	aliasesDefaultPath: 'C:/Users/User/AppData/Roaming/fnm/aliases/default',
 * 	aliasesDefaultPathReal: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	installationPath: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	multishellDir: 'C:/Users/User/AppData/Local/fnm_multishells',
 * 	multishellKey: '20128_1771488837711',
 * 	multishellPath: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711',
 * 	version: 'v24.13.1'
 * }
 * ```
 */
export interface IDetectFnmByAllResult extends Omit<IDetectFnmByResult, 'detectedBy'>
{
	/**
	 * Array of detection sources
	 * 偵測來源陣列
	 *
	 * @description
	 * List of all detection methods that successfully detected fnm.
	 * 所有成功偵測到 fnm 的偵測方法列表。
	 */
	detectedBy: IEnumDetectFnmBy[];
}

/**
 * Enumeration of fnm path types
 * fnm 路徑類型列舉
 *
 * @description
 * Defines the different types of paths that fnm uses:
 * 定義 fnm 使用的不同路徑類型：
 *
 * - fnm_multishells: Temporary symlink directories for shell sessions
 *                    Shell 工作階段的臨時符號連結目錄
 * - aliases: Named pointers to specific Node.js versions
 *            指向特定 Node.js 版本的命名指標
 * - node-versions: Direct paths to installed Node.js versions
 *                  已安裝 Node.js 版本的直接路徑
 */
export const enum EnumDetectFnmPathType
{
	/** Multishell temporary directory / Multishell 臨時目錄 */
	fnm_multishells = 'fnm_multishells',
	/** Alias directory / 別名目錄 */
	aliases = 'aliases',
	/** Node version installation directory / Node 版本安裝目錄 */
	node_versions = 'node-versions',
}

/**
 * Core function to detect fnm path type
 * 偵測 fnm 路徑類型的核心函數
 *
 * @description
 * Analyzes a normalized path to determine if it's a fnm_multishells,
 * aliases, or node-versions path based on path patterns.
 * 根據路徑特徵判斷是 fnm_multishells、aliases 還是 node-versions 路徑。
 *
 * @param normalizedFnmPath - The normalized fnm path to analyze / 已正規化的 fnm 路徑
 * @param inDeep - Whether to perform deep detection (reserved parameter) / 是否深入偵測（保留參數）
 * @returns Path type information including fnmPathType, fnmPath, fnmDir, etc. / 路徑類型資訊
 *
 * @example
 * ```ts
 * // fnm_multishells path
 * _detectFnmPathTypeCore('C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711')
 * // Returns: { fnmPathType: 'fnm_multishells', fnmPath: '...', multishellKey: '20128_1771488837711', ... }
 * ```
 */
export function _detectFnmPathTypeCore(normalizedFnmPath: string, inDeep?: boolean)
{
	/**
	 * 空字串或 undefined 直接略過比對並回傳 undefined，
	 * 讓呼叫端能以 falsy 判斷「非 fnm 路徑」
	 * An empty string or undefined skips matching and returns undefined,
	 * so callers can treat a falsy result as "not an fnm path"
	 */
	if (normalizedFnmPath?.length)
	{
		/**
		 * 以條件式賦值保存比對結果，捕獲組可直接用於回傳值
		 * Keeps the match result via assignment-in-condition so capture groups feed the return value directly
		 */
		let m: RegExpMatchArray;

		/**
		 * 比對 fnm_multishells 路徑模式 / Match fnm_multishells path pattern
		 * Pattern: .../fnm_multishells/{key}
		 */
		if (m = normalizedFnmPath.match(/((.+\/fnm_multishells)\/([^/]+))/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.fnm_multishells as const,
				fnmPath: m[1],
				multishellKey: m[3],
				multishellPath: m[1],
				multishellDir: m[2],
			}
		}
		/**
		 * 比對 aliases 路徑模式 / Match aliases path pattern
		 * Pattern: .../fnm/aliases/{name}
		 */
		else if (m = normalizedFnmPath.match(/((.+\/fnm)\/aliases\/([^/]+))/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.aliases as const,
				fnmPath: m[1],
				fnmDir: m[2],
				aliasesName: m[3],
				aliasesPath: m[1],
			}
		}
		/**
		 * 比對 node-versions 路徑模式 / Match node-versions path pattern
		 * Pattern: .../fnm/node-versions/{version}/installation
		 */
		else if (m = normalizedFnmPath.match(/((.+\/fnm)\/node-versions\/([^/]+)\/installation)/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.node_versions as const,
				fnmPath: m[1],
				fnmDir: m[2],
				version: m[3],
				installationPath: m[1],
			}
		}

		/**
		 * 三種模式皆不符（非 fnm 路徑）時不另外組裝結果，
		 * 維持隱含回傳 undefined，讓呼叫端以 falsy 判定「未偵測到」
		 * When none of the three patterns match (not an fnm path), no result is
		 * assembled and the implicit undefined return stays, so callers can treat
		 * a falsy value as "not detected"
		 */
	}
}

/**
 * Public API to detect fnm path type
 * 偵測 fnm 路徑類型的對外介面
 *
 * @description
 * Wrapper function that normalizes the path before calling the core detection function.
 * 對外提供的介面，會先將路徑正規化後再呼叫核心函數。
 *
 * @param normalizedFnmPath - fnm path (will be auto-normalized) / fnm 路徑（會自動正規化）
 * @param inDeep - Whether to perform deep detection (reserved parameter) / 是否深入偵測（保留參數）
 * @returns Path type information / 路徑類型資訊
 */
export function detectFnmPathType(normalizedFnmPath: string, inDeep?: boolean)
{
	return _detectFnmPathTypeCore(normalize(normalizedFnmPath), inDeep);
}

/**
 * Build the node version installation path
 * 建立 node 版本安裝路徑
 *
 * @description
 * Constructs the path to a specific Node.js version's installation directory.
 * 建構特定 Node.js 版本的安裝目錄路徑。
 *
 * @param fnmDir - The fnm main directory / fnm 主目錄
 * @param nodeVersion - The Node.js version string / Node.js 版本字串
 * @returns The full installation path / 完整的安裝路徑
 *
 * @example
 * ```ts
 * _toFnmPathNodeVersion('C:/Users/User/AppData/Roaming/fnm', 'v24.13.1')
 * // Returns: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation'
 * ```
 */
export function _toFnmPathNodeVersion(fnmDir: string, nodeVersion: string)
{
	return join(fnmDir, 'node-versions', nodeVersion, 'installation')
}

/**
 * Enumeration of common fnm alias names
 * 常見 fnm 別名名稱列舉
 *
 * @description
 * Defines the standard alias names used by fnm:
 * 定義 fnm 使用的標準別名名稱：
 *
 * - default: The default Node.js version
 *            預設的 Node.js 版本
 * - latest: The latest available Node.js version
 *           最新的可用 Node.js 版本
 * - lts-latest: The latest LTS (Long Term Support) version
 *               最新的 LTS（長期支援）版本
 */
export const enum EnumDetectFnmPathAliases
{
	/** Default Node.js version alias / 預設 Node.js 版本別名 */
	default = 'default',
	/** Latest Node.js version alias / 最新 Node.js 版本別名 */
	latest = 'latest',
	/** Latest LTS version alias / 最新 LTS 版本別名 */
	lts_latest = 'lts-latest',
}

/**
 * Build fnm path based on path type
 * 根據路徑類型建立 fnm 路徑
 *
 * @description
 * Factory function that constructs the appropriate fnm path based on the detected path type.
 * 根據偵測到的路徑類型，建構適當 fnm 路徑的工廠函數。
 *
 * @param fnmPathType - Object containing path type and related information / 包含路徑類型和相關資訊的物件
 * @returns The constructed path / 建構的路徑
 */
export function toFnmPath(fnmPathType: ITSPartialPick<ReturnType<typeof detectFnmPathType>, 'fnmPathType' | 'fnmPath' | 'multishellKey' | 'fnmDir' | 'aliasesName' | 'version'>)
{
	/**
	 * 依路徑類型分派到對應的建構函式；
	 * 未列出的類型回傳 undefined（刻意不覆蓋未知型別）
	 * Dispatches to the matching builder by path type;
	 * unlisted types return undefined (unknown types are intentionally not handled)
	 */
	switch (fnmPathType.fnmPathType)
	{
		/**
		 * multishell 路徑由目錄加工作階段鍵值組成 / Multishell path = directory + session key
		 */
		case EnumDetectFnmPathType.fnm_multishells:
			return _toFnmPathMultishell(fnmPathType.fnmPath, fnmPathType.multishellKey);
		/**
		 * 別名路徑由 fnm 主目錄加別名組成 / Alias path = fnm main directory + alias name
		 */
		case EnumDetectFnmPathType.aliases:
			return _toFnmPathAliases(fnmPathType.fnmDir, fnmPathType.aliasesName);
		/**
		 * 安裝路徑需以節點版本推算 / Installation path is derived from the Node.js version
		 */
		case EnumDetectFnmPathType.node_versions:
			return _toFnmPathNodeVersion(fnmPathType.fnmDir, fnmPathType.version);
	}
}

/**
 * Build multishell path
 * 建立 multishell 路徑
 *
 * @description
 * Constructs the path to a fnm multishell directory.
 * 建構 fnm multishell 目錄的路徑。
 *
 * @param fnmDir - The multishell base directory / multishell 基礎目錄
 * @param name - The multishell key (session identifier) / multishell 鍵值（工作階段識別碼）
 * @returns The full multishell path / 完整的 multishell 路徑
 *
 * @example
 * ```ts
 * _toFnmPathMultishell('C:/Users/User/AppData/Local/fnm_multishells', '20128_1771488837711')
 * // Returns: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711'
 * ```
 */
export function _toFnmPathMultishell(fnmDir: string, name: string)
{
	return join(fnmDir, name)
}

/**
 * Build alias path
 * 建立別名路徑
 *
 * @description
 * Constructs the path to an fnm alias directory.
 * 建構 fnm 別名目錄的路徑。
 *
 * @param fnmDir - The fnm main directory / fnm 主目錄
 * @param name - The alias name / 別名名稱
 * @returns The full alias path / 完整的別名路徑
 *
 * @example
 * ```ts
 * _toFnmPathAliases('C:/Users/User/AppData/Roaming/fnm', 'default')
 * // Returns: 'C:/Users/User/AppData/Roaming/fnm/aliases/default'
 * ```
 */
export function _toFnmPathAliases(fnmDir: string, name: string | ITSTypeAndStringLiteral<EnumDetectFnmPathAliases>)
{
	return join(fnmDir, 'aliases', name)
}

/**
 * Fill and merge records
 * 填充並合併記錄
 *
 * @description
 * Merges properties from fillFrom into source, only filling in undefined properties.
 * This ensures that existing values in source are not overwritten.
 * 將 fillFrom 的屬性合併到 source，只填充未定義的屬性。
 * 這確保 source 中的現有值不會被覆蓋。
 *
 * @template T - Source object type / 來源物件類型
 * @template R - Fill object type / 填充物件類型
 * @param source - The target object to fill into / 要填充的目標物件
 * @param fillFrom - The source object to fill from / 要從中填充的來源物件
 * @returns Merged object with both types / 合併後的物件
 */
export function _fillMergeRecord<T extends Record<string, any>, R extends Record<string, any>>(source: T, fillFrom: R)
{
	/**
	 * fillFrom 可能為 undefined（偵測失敗時），此時直接回傳 source
	 * fillFrom may be undefined (when detection failed), in which case source is returned as-is
	 */
	if (fillFrom)
	{
		/**
		 * 逐一走訪 fillFrom 的鍵，只補上 source 尚未定義的欄位，
		 * 以保留偵測流程中已取得的優先資訊
		 * Walk each key of fillFrom, filling only fields not yet defined on source,
		 * so information already gathered earlier in the detection flow is preserved
		 */
		for (const key in fillFrom)
		{
			/**
			 * 只在 source 沒有此鍵時才填充 / Only fill if source doesn't have this key
			 * `??=` 確保既有的定義值（含 null 以外的 falsy）不會被覆蓋
			 * `??=` guarantees existing defined values (including falsy ones other than null) are not overwritten
			 */
			// @ts-ignore
			if (fillFrom[key]) source[key] ??= fillFrom[key];
		}
	}

	return source as any as ITSOverwrite<R, T>
}


/**
 * Detect fnm environment via process.execPath
 * 依靠 process.execPath 偵測 fnm 環境
 *
 * @description
 * Detects whether the current Node.js process is running under fnm management
 * by analyzing the executable path. fnm's execPath typically contains "fnm_multishells"
 * or is within the fnm directory (e.g., node-versions, aliases).
 * 偵測邏輯：檢查 process.execPath 是否包含 fnm 相關路徑
 * - fnm 的 execPath 通常會包含 "fnm_multishells"
 * - 或在 fnm 目錄下（如 node-versions, aliases）
 *
 * @param execPath - Node.js executable path (defaults to process.execPath) / Node.js 執行檔路徑（預設為 process.execPath）
 * @param nodeVersion - Node.js version (defaults to process.version) / Node.js 版本（預設為 process.version）
 * @returns Detection result with path information / 包含路徑資訊的偵測結果
 *
 * @example
 * ```ts
 * const result = detectFnmByExecPath();
 * // execPath example: 'C:/Users/User/AppData/Local/fnm_multishells/7064_1771483456556/node.exe'
 * // Result: { isFnm: true, fnmPathType: 'fnm_multishells', ... }
 * ```
 */
export function detectFnmByExecPath(execPath: string = process.execPath, nodeVersion: string = process.version): IDetectFnmByExecPathResult
{
	/**
	 * 統一路徑風格（使用 upath2 轉換為 Unix 風格），
	 * 否則 Windows 的反斜線會讓後續正規表示式比對失敗
	 * Normalize path style (using upath2 to convert to Unix style),
	 * otherwise Windows backslashes would break the regex matching below
	 */
	const normalizedExecPath = normalize(execPath);

	/**
	 * 使用 detectFnmPathType 解析路徑類型 / Use detectFnmPathType to parse path type
	 * 找不到 fnm 路徑特徵時會得到 undefined，稍後轉為 isFnm: false
	 * A path without fnm characteristics yields undefined, later turned into isFnm: false
	 */
	let fnmPathType = detectFnmPathType(normalizedExecPath);

	return sortDetectFnmByResult(_handleDetectFnmByResult(EnumDetectFnmBy.execpath, fnmPathType, nodeVersion));
}

/**
 * Handle detection result processing
 * 處理偵測結果的共通函數
 *
 * @description
 * Processes the detected path type information and resolves real paths using realpathSync.
 * Extracts and constructs all relevant fnm paths based on the detection results.
 * 根據路徑類型解析相關路徑資訊，並使用 realpathSync 取得真實路徑。
 *
 * @template T - Detection method type / 偵測方法類型
 * @param detectedBy - Detection source marker / 偵測來源標記
 * @param fnmPathType - Detected fnm path type information / 偵測到的 fnm 路徑類型資訊
 * @param nodeVersion - Node.js version / Node.js 版本
 * @returns Complete detection result / 完整的偵測結果
 */
export function _handleDetectFnmByResult<T extends EnumDetectFnmBy>(detectedBy: T, fnmPathType: ReturnType<typeof detectFnmPathType>, nodeVersion?: string): IDetectFnmByResult<T>
{

	/**
	 * 從路徑型別判斷是否為 fnm 環境 / Determine if this is an fnm environment from the path type
	 * 以 `!!` 將 undefined 正規化成布林值 / `!!` normalizes undefined into a boolean
	 */
	const isFnm = !!fnmPathType?.fnmPathType;

	/** 解析符號連結後的真實路徑 / Real path after resolving symlinks */
	let fnmPathReal: string;
	/** 路徑是否存在；以 null 表示尚未檢查（有別於 false） / Whether the path exists; null means "not checked yet" (distinct from false) */
	let exists: boolean = null;
	/** 預設別名路徑 / Default alias path */
	let aliasesDefaultPath: string;
	/** 預設別名的真實路徑 / Real path of the default alias */
	let aliasesDefaultPathReal: string;

	/** 真實路徑是否與預設別名相同 / Whether the real path equals the default alias */
	let isSameAsAliasDefault: boolean;

	/**
	 * 根據路徑類型進行處理 / Process based on path type
	 * 非 fnm 環境時跳過所有路徑解析，回傳最基本的結果
	 * When not an fnm environment, all path resolution is skipped and only the minimal result is returned
	 */
	if (isFnm === true)
	{
		/** 重新解析真實路徑後再次比對出的路徑型別 / Path type re-detected from the resolved real path */
		let fnmPathType2: ReturnType<typeof detectFnmPathType>;

		/**
		 * 使用 realpathSync 解析真實路徑 / Use realpathSync to resolve the real path
		 * 以 try/catch 包覆是因為路徑可能已不存在（multishell 為臨時目錄），
		 * 失敗時保留原本的偵測結果、不中斷流程
		 * Wrapped in try/catch because the path may no longer exist (multishell dirs are temporary);
		 * on failure the original detection result is kept and processing continues
		 */
		try {
			fnmPathReal = normalize(realpathSync(fnmPathType.fnmPath));
			fnmPathType2 = _detectFnmPathTypeCore(fnmPathReal);

			/**
			 * 如果尚未設定 fnmDir 則填入 / Fill in fnmDir if not already set
			 * `??=` 避免覆蓋已由路徑比對取得的值 / `??=` avoids overwriting a value already obtained from path matching
			 */
			fnmPathType.fnmDir ??= fnmPathType2.fnmDir;
		} catch { }

		/**
		 * 處理不同的路徑類型 / Handle different path types
		 * 目前三種型別皆無額外動作，保留 switch 作為型別擴充點
		 * All three types currently take no extra action; the switch remains an extension point
		 */
		switch (fnmPathType.fnmPathType)
		{
			case EnumDetectFnmPathType.fnm_multishells:
				/**
				 * Multishell 路徑是臨時符號連結 / Multishell paths are temporary symlinks
				 * 依賴後續的 realpathSync 與 exists 檢查 / Relies on the later realpathSync and exists checks
				 */
				break;

			case EnumDetectFnmPathType.node_versions:
				/**
				 * 直接的 node 版本安裝路徑 / Direct node version installation path
				 * 已是最終路徑，無需再推導 / Already the final path, no further derivation needed
				 */
				break;

			case EnumDetectFnmPathType.aliases:
				/**
				 * 指向某個版本的別名路徑 / Alias path pointing to a version
				 * 真實路徑會指向 node-versions 安裝目錄 / Its real path points at a node-versions installation directory
				 */
				break;
		}

		/**
		 * 如果真實路徑類型與偵測類型不同，合併額外資訊
		 * If the real path type differs from the detected type, merge the additional info
		 * 例如 aliases 經解析後指向 node-versions，可補上安裝路徑等欄位
		 * e.g. an alias resolving to node-versions lets installation paths be filled in
		 */
		if (fnmPathType2 && fnmPathType2.fnmPathType !== fnmPathType.fnmPathType)
		{
			_fillMergeRecord(fnmPathType, fnmPathType2);
		}

		/**
		 * 如果解析後的路徑不是 node-versions 路徑，嘗試計算 installationPath
		 * If the resolved path is not a node-versions path, try to compute installationPath
		 * multishell 等路徑無法直接得知安裝目錄，需另行推算
		 * Paths such as multishell do not reveal the installation directory, so it must be derived
		 */
		if (fnmPathType2?.fnmPathType !== EnumDetectFnmPathType.node_versions)
		{
			/**
			 * 從 fnmPathType.fnmDir 計算 installationPath / Calculate installationPath from fnmPathType.fnmDir
			 * fnmPathType.fnmDir example: C:\Users\User\AppData\Roaming\fnm
			 * 兩者缺一就無法組出安裝路徑，故需同時成立 / Both are required to build the path, so both must be present
			 */
			if (fnmPathType.fnmDir && nodeVersion)
			{
				fnmPathType2 = _detectFnmPathTypeCore(_toFnmPathNodeVersion(fnmPathType.fnmDir, nodeVersion));

				_fillMergeRecord(fnmPathType, fnmPathType2);
			}
		}

		/**
		 * 檢查解析後的路徑是否存在 / Check if the resolved path exists
		 * 路徑已失效（例如 shell 工作階段結束）時回傳 false
		 * Returns false when the path is stale (e.g. after the shell session ended)
		 */
		exists = pathExistsSync(fnmPathReal);

		/**
		 * 計算預設別名路徑 / Compute the default alias path
		 * 無 fnmDir 時為 falsy，`&&` 的結果（false）不會被採用
		 * Without fnmDir the `&&` yields falsy, which is simply not picked up
		 */
		aliasesDefaultPath = (fnmPathType.fnmDir) && _toFnmPathAliases(fnmPathType.fnmDir, EnumDetectFnmPathAliases.default);

		/**
		 * 解析預設別名的真實路徑 / Resolve the real path of the default alias
		 * try/catch 是因為預設別名可能尚未建立，失敗時僅略過比對
		 * try/catch because the default alias may not exist yet; on failure the comparison is simply skipped
		 */
		try {
			aliasesDefaultPathReal = normalize(realpathSync(aliasesDefaultPath));

			isSameAsAliasDefault = aliasesDefaultPathReal && aliasesDefaultPathReal === fnmPathReal;
		} catch { }
	}

	/**
	 * 以 _fillMergeRecord 將路徑型別資訊併入結果；
	 * source 中已定義的欄位優先，偵測細節只用來補空缺
	 * Merge path type details into the result via _fillMergeRecord;
	 * defined fields in source win, detection details only fill the gaps
	 */
	return _fillMergeRecord({
		isFnm,
		detectedBy,
		fnmPathReal,
		exists,
		aliasesDefaultPath,
		aliasesDefaultPathReal,
		isSameAsAliasDefault,
	}, fnmPathType);
}




/**
 * Detect fnm environment via environment variables
 * 依靠環境變數偵測 fnm 環境
 *
 * @description
 * Detects whether the current Node.js process is running under fnm management
 * by checking for FNM_DIR or FNM_MULTISHELL_PATH environment variables.
 * 偵測邏輯：檢查 FNM_DIR 或 FNM_MULTISHELL_PATH 環境變數是否存在
 *
 * @param env - Environment variables object (defaults to process.env) / 環境變數物件（預設為 process.env）
 * @param nodeVersion - Node.js version (defaults to process.version) / Node.js 版本（預設為 process.version）
 * @returns Detection result with path information / 包含路徑資訊的偵測結果
 *
 * @example
 * ```ts
 * const result = detectFnmByEnv(process.env);
 * // If FNM_MULTISHELL_PATH is set, uses that for detection
 * // Otherwise, uses FNM_DIR combined with nodeVersion
 * ```
 */
export function detectFnmByEnv(env: IDetectFnmByEnv = process.env, nodeVersion: string = process.version): IDetectFnmByEnvResult
{
	/**
	 * 使用 detectFnmPathType 解析 FNM_MULTISHELL_PATH 的路徑類型
	 * Use detectFnmPathType to parse path type from FNM_MULTISHELL_PATH
	 * 變數未設定時 `&&` 回傳 falsy，等同「未偵測到」
	 * When the variable is unset the `&&` yields falsy, i.e. "not detected"
	 */
	let fnmPathType = env.FNM_MULTISHELL_PATH && detectFnmPathType(env.FNM_MULTISHELL_PATH);

	/**
	 * 如果 FNM_MULTISHELL_PATH 沒有結果，嘗試使用 FNM_DIR 加上 nodeVersion
	 * If no result from FNM_MULTISHELL_PATH, try FNM_DIR with nodeVersion
	 * 兩者皆存在才組得出 node-versions 安裝路徑 / Both must exist to derive the node-versions installation path
	 */
	if (!fnmPathType && env.FNM_DIR && nodeVersion)
	{
		fnmPathType = detectFnmPathType(_toFnmPathNodeVersion(env.FNM_DIR, nodeVersion));
	}

	return sortDetectFnmByResult(_handleDetectFnmByResult(EnumDetectFnmBy.env, fnmPathType, nodeVersion));
}



/**
 * Sort detection result object keys
 * 對偵測結果進行排序
 *
 * @description
 * Sorts the keys of the result object in a specified order for better readability.
 * 將結果物件的 key 按照指定順序排列，方便閱讀。
 *
 * @template T - The result object type / 結果物件類型
 * @param result - The detection result object / 偵測結果物件
 * @returns Sorted result object / 排序後的結果物件
 */
export function sortDetectFnmByResult<T extends Partial<Omit<IDetectFnmByResult, 'detectedBy'>>>(result: T)
{
	return sortObjectKeys(result, {
		keys: [
			'isFnm',
			'detectedBy',
			'fnmPathType',
			'exists',
			'isSameAsAliasDefault',
			'fnmPath',
			'fnmPathReal',
			'fnmDir',
		],
	});
}

/**
 * Simple check if current process is running under fnm
 * 簡單檢查當前程序是否在 fnm 下執行
 *
 * @description
 * A convenience function that returns a boolean indicating whether fnm is detected.
 * This is a simplified version of detectFnmByExecPath for quick checks.
 * 便利函數，返回布林值指示是否偵測到 fnm。
 * 這是 detectFnmByExecPath 的簡化版本，用於快速檢查。
 *
 * @returns True if fnm is detected, false otherwise / 若偵測到 fnm 則為 true，否則為 false
 *
 * @example
 * ```ts
 * if (isFNM()) {
 *   console.log('Running under fnm');
 * }
 * ```
 */
export function isFNM()
{
	return detectFnmByExecPath(process.execPath, null).isFnm
}

/**
 * Input type for detectFnmByAll function
 * detectFnmByAll 函數的輸入類型
 *
 * @description
 * Defines the input parameters for combined detection.
 * 定義結合偵測的輸入參數。
 */
export type IDetectFnmByAllInput = {
	/** Node.js executable path / Node.js 執行檔路徑 */
	execPath: string,
	/** Environment variables object / 環境變數物件 */
	env: IDetectFnmByEnv,
	/** Node.js version string / Node.js 版本字串 */
	version: string,
}

/**
 * Detect fnm environment using both execpath and env methods
 * 同時使用 execpath 與 env 偵測 fnm 環境
 *
 * @description
 * Combines both detection methods (execpath and env) and returns comprehensive results
 * indicating which method(s) successfully detected fnm.
 * 結合兩種偵測方式，並回傳得知是來自 execpath 或者 env。
 *
 * @param pc - Input object with execPath, env, and version (defaults to process) / 包含 execPath、env 和 version 的輸入物件（預設為 process）
 * @returns Combined detection result with detection sources / 包含偵測來源資訊的結合偵測結果
 *
 * @example
 * ```ts
 * const result = detectFnmByAll();
 * // result.detectedBy could be ['execpath'], ['env'], ['execpath', 'env'], or []
 * // result.isFnm is true if any detection method succeeded
 * ```
 */
export function detectFnmByAll(pc: IDetectFnmByAllInput = process)
{
	/**
	 * 使用 detectFnmByExecPath 進行 execpath 偵測
	 * Use detectFnmByExecPath for execpath detection
	 */
	const execPathResult = detectFnmByExecPath(pc.execPath);

	/**
	 * 使用 detectFnmByEnv 進行 env 偵測 / Use detectFnmByEnv for env detection
	 */
	const envResult = detectFnmByEnv(pc.env);

	/**
	 * 合併後的結果；以 `??=` 保證先成功者為主體、後成功者只補空缺
	 * Merged result; `??=` keeps the first success as the base and lets the second only fill gaps
	 */
	let merged: ReturnType<typeof detectFnmByExecPath & typeof envResult>;

	/**
	 * 收集偵測來源 / Collect detection sources
	 * 依實際成功的順序記錄，供呼叫端判斷結果可信度
	 * Recorded in the order methods actually succeeded, so callers can weigh reliability
	 */
	const detectedBy: IEnumDetectFnmBy[] = [];

	/**
	 * 如果 execpath 偵測成功 / If execpath detection succeeded
	 */
	if (execPathResult.isFnm) {
		detectedBy.push(execPathResult.detectedBy);

		// @ts-ignore
		merged ??= _fillMergeRecord(execPathResult, envResult);
	}

	/**
	 * 如果 env 偵測成功 / If env detection succeeded
	 */
	if (envResult.isFnm) {
		detectedBy.push(envResult.detectedBy);

		// @ts-ignore
		merged ??= _fillMergeRecord(envResult, execPathResult);
	}

	/**
	 * 如果兩種偵測都沒成功，預設使用其中一個結果
	 * Default to one of the results if neither detection succeeded
	 * execPathResult 恆為物件，可保證 merged 一定有值
	 * execPathResult is always an object, so merged is guaranteed to be defined
	 */
	// @ts-ignore
	merged ??= execPathResult || envResult

	/**
	 * 最終判斷：任一方法成功即表示偵測到 fnm
	 * Final determination: fnm is detected if either method succeeded
	 */
	const isFnm = execPathResult.isFnm || envResult.isFnm;

	return sortDetectFnmByResult(_fillMergeRecord({
		isFnm,
		detectedBy,
	}, merged));
}

/**
 * Default export: detectFnmByExecPath
 * 預設匯出：detectFnmByExecPath
 *
 * @description
 * The default export is the execpath-based detection function,
 * which is the most commonly used detection method.
 * 預設匯出是基於 execpath 的偵測函數，
 * 這是最常用的偵測方法。
 */
export default detectFnmByExecPath

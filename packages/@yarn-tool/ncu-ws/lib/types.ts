/**
 * Type definitions for @yarn-tool/ncu-ws.
 * @yarn-tool/ncu-ws 的類型定義。
 *
 * @packageDocumentation
 *
 * 包含 runtime 配置、argv 參數、以及 workspace 相關類型定義。
 */

import { Console2 } from 'debug-color2';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IUnpackYargsArgv } from '@yarn-tool/yargs-util';
import { setupNcuToYargs2 } from './argv';
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { IPackageJson } from '@ts-type/package-dts/package-json';

/**
 * 執行時期的輸入配置 (Runtime input configuration)
 * 由呼叫端（CLI 或測試）提供輸出管線與回呼，預設值在 `_handleNcuArgvAuto` 內補齊。
 * The caller (CLI or tests) supplies the output channels and callback; defaults are
 * filled in inside `_handleNcuArgvAuto`.
 */
export interface IRuntimeInput
{
	/** 一般輸出用的 console / Console used for regular output */
	console: Console2,
	/** 除錯輸出用的 console / Console used for debug output */
	consoleDebug: Console2,

	/**
	 * 輸出目前處理的根目錄 / 套件資訊的回呼
	 * Callback printing the root / package currently being processed
	 *
	 * @param rootData - 找到的根目錄資料 / The resolved root data
	 * @param argv - 帶有 cwd 的參數 / Arguments carrying `cwd`
	 */
	printRootData(rootData: IFindRootReturnType, argv: {
		cwd: string,
	}): void,
}

/**
 * 完整的執行時期環境 (Complete runtime environment)
 * 由 `_handleRuntime` 建立：在輸入配置之上補上工作目錄、根目錄、
 * package.json 與 resolutions 等執行期才決定的欄位。
 * Built by `_handleRuntime`: it adds the fields only known at runtime (working
 * directory, root, package.json and resolutions) on top of the input configuration.
 */
export interface IRuntime extends IRuntimeInput
{
	/** 目前操作的工作目錄 / Working directory of the current operation */
	cwd: string,
	/** 專案根目錄資料 / Project root data */
	rootData: IFindRootReturnType,

	/** 目前套件 package.json 的路徑 / Path of the current package.json */
	pkg_file: string,
	/** 目前套件 package.json 的內容 / Content of the current package.json */
	pkg_data: IPackageJson,

	/** 目前生效的 resolutions 設定 / The resolutions currently in effect */
	resolutions: IDependency,

	/** workspace 根套件 package.json 的路徑（非 workspace 模式時為 undefined） / Workspace root package.json path (undefined outside workspace mode) */
	pkg_file_ws: string,
	/** workspace 根套件 package.json 的內容（非 workspace 模式時為 undefined） / Workspace root package.json content (undefined outside workspace mode) */
	pkg_data_ws: IPackageJson,

	/** 是否改以 workspace 根的設定運作 / Whether the workspace root's settings are used instead */
	doWorkspace: boolean,
}

/**
 * 解析後的命令列參數 (Parsed CLI arguments)
 * 由 `setupNcuToYargs2` 的回傳型別推導，選項變動時會自動同步。
 * Derived from the return type of `setupNcuToYargs2`, so option changes stay in sync.
 */
export type IArgvRuntime = IUnpackYargsArgv<ReturnType<typeof setupNcuToYargs2>>;

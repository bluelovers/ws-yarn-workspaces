/**
 * 執行時期環境建構模組 / Runtime environment construction module
 *
 * 負責建立和配置 ncu 執行所需的完整運行環境
 * Responsible for building and configuring the complete runtime environment required for ncu execution
 */

import { IArgvRuntime, IRuntime, IRuntimeInput } from './types';
import { findRoot } from '@yarn-tool/find-root';
import { join } from 'upath2';
import { readPackageJson } from '@ts-type/package-dts';
import { IPackageJson } from '@ts-type/package-dts/package-json';

/**
 * 處理並建立執行時期環境
 * Process and build the runtime environment
 *
 * 此函數會：
 * - 尋找 workspace 根目錄
 * - 讀取 package.json 資訊
 * - 處理 resolutions 設定
 * - 判斷是否在 workspace 模式下運行
 *
 * This function will:
 * - Find workspace root directory
 * - Read package.json information
 * - Process resolutions configuration
 * - Determine if running in workspace mode
 *
 * @param argv - 命令列參數 / Command line arguments
 * @param runtimeInput - 執行時期輸入配置 / Runtime input configuration
 * @returns 完整的執行時期環境 / Complete runtime environment
 */
export function _handleRuntime(argv: IArgvRuntime, runtimeInput: IRuntimeInput)
{
	const { cwd } = argv;

	/**
	 * 尋找專案根目錄資訊
	 * Find project root directory information
	 */
	const rootData = findRoot({
		...argv,
		cwd,
	}, true);

	/**
	 * 設定當前套件的 package.json 路徑和內容
	 * Set current package's package.json path and content
	 */
	let pkg_file = join(rootData.pkg, 'package.json');
	let pkg_data = readPackageJson(pkg_file);

	/**
	 * 取得 resolutions 設定（用於強制指定特定版本）
	 * Get resolutions configuration (used to force specific versions)
	 */
	let resolutions = pkg_data.resolutions;

	/**
	 * workspace 根套件的 package.json 路徑和內容
	 * Workspace root package's package.json path and content
	 */
	let pkg_file_ws: string;
	let pkg_data_ws: IPackageJson;

	/**
	 * 判斷是否需要在 workspace 模式下運行
	 * 條件：不在 workspace 目錄中，但專案擁有 workspace 結構
	 *
	 * Determine if need to run in workspace mode
	 * Condition: not in workspace directory, but project has workspace structure
	 */
	let doWorkspace = !rootData.isWorkspace && rootData.hasWorkspace;

	/**
	 * 如果在 workspace 模式下，讀取 workspace 根套件的資訊
	 * If in workspace mode, read workspace root package information
	 */
	if (doWorkspace)
	{
		pkg_file_ws = join(rootData.ws, 'package.json');
		pkg_data_ws = readPackageJson(pkg_file_ws);

		/**
		 * 使用 workspace 根的 resolutions 設定
		 * Use workspace root's resolutions configuration
		 */
		resolutions = pkg_data_ws.resolutions;
	}

	/**
	 * 回傳完整的執行時期環境物件
	 * Return complete runtime environment object
	 */
	return {
		...runtimeInput,

		cwd,

		rootData,

		pkg_file,
		pkg_data,

		resolutions,

		pkg_file_ws,
		pkg_data_ws,

		doWorkspace,
	}
}

/**
 * 將套件來源目錄以符號連結 (Symlink) 掛入 node_modules 的工具函式
 * Utility functions that link a package source directory into node_modules via symlink
 *
 * 路徑未完整指定時會自動向上推斷工作區根目錄 (Workspace Root) 與套件根目錄，
 * 並可透過內建 CLI 命令 `node-modules-link` 操作。
 * When paths are incomplete, the workspace root and package root are detected
 * automatically; the built-in `node-modules-link` CLI exposes the same behavior.
 */

import { join } from 'upath2';
import { IPackageJson } from '@ts-type/package-dts';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { readPackageJSON } from 'find-yarn-workspace-root2/core';
import { fsSymlinkSync } from 'fs-symlink-extra';
import { getModulesDir } from '@yarn-tool/node-modules/lib/util';

/**
 * 連結選項 (Link Options)
 *
 * 繼承 Partial<IFindRootOptions>，因此可直接透傳 findRoot 的選項
 * （如 throwError、skipCheckWorkspace）控制根目錄推斷行為。
 * Extends Partial<IFindRootOptions>, so findRoot options (e.g. throwError,
 * skipCheckWorkspace) pass through to control root detection behavior.
 */
export interface IOptions extends Partial<IFindRootOptions>
{
	name: string,  /** 建立連結的名稱（含 scope，如 @scope/pkg） / Link name, including scope (e.g. @scope/pkg) */
	targetNodeModulesPath: string,  /** 目標 node_modules 目錄路徑 / Target node_modules directory path */
	sourcePackagePath: string,  /** 要被連結的來源套件目錄 / Source package directory to be linked */
	cwd?: string,  /** 路徑推斷的起始目錄，預設 process.cwd() / Starting directory for path detection, defaults to process.cwd() */
	targetNodeModulesName?: string,  /** 非標準命名的模組目錄名稱，預設 node_modules / Custom modules directory name, defaults to node_modules */
	overwrite?: boolean,  /** 是否覆寫既存在的連結，預設 true / Whether to overwrite an existing link, defaults to true */
}

/**
 * 核心連結函式：不做任何路徑推斷，直接於目標目錄建立符號連結
 * Core linking function: creates the symlink directly in the target directory without path detection
 *
 * @param options - 已完整指定的連結選項 / Fully specified link options
 * @returns 傳入的選項再加上 resultPath / The input options plus resultPath
 *
 * 邊界情況：overwrite 預設為 true，因為工作區開發中重複連結很常見；
 * 若目標已存在而 overwrite 為 false，錯誤會由底層的 fsSymlinkSync 拋出。
 * Edge case: overwrite defaults to true because relinking is common during
 * workspace development; if the target exists while overwrite is false, the
 * underlying fsSymlinkSync throws the error.
 */
export function linkToNodeModulesCore<T extends IOptions>(options: T)
{
	let resultPath = join(options.targetNodeModulesPath, options.name);

	/**
	 * 第一個參數為來源套件目錄，第二個參數為連結要寫入的位置
	 * The first argument is the source package directory, the second is where the link is written
	 */
	fsSymlinkSync(options.sourcePackagePath, resultPath, {
		overwrite: options.overwrite ?? true,
	});

	return {
		...options,
		resultPath,
	}
}

/**
 * 建立（或更新）套件到 node_modules 的符號連結
 * Create (or update) a symlink from a package into node_modules
 *
 * @param options - 連結選項；路徑可省略以自動推斷 / Link options; paths may be omitted for auto detection
 * @returns 傳入的選項再加上 resultPath / The input options plus resultPath
 *
 * 只有在來源或目標路徑缺失時才會呼叫 findRoot，兩者皆已指定時可省去一次
 * 檔案系統探測。
 * findRoot is only called when source or target path is missing, saving one
 * filesystem traversal when both are already provided.
 */
export function linkToNodeModules<T extends Partial<IOptions>>(options?: T)
{
	/**
	 * 允許無參數呼叫，並逐項補上預設值，讓後續邏輯不必再判斷 undefined
	 * Allows calling with no arguments and fills defaults item by item so
	 * later logic never has to check for undefined
	 */
	options ??= {} as T;
	options.cwd ??= process.cwd();

	/**
	 * 任一路徑缺失時才推斷根目錄；同時指定來源與目標則完全跳過
	 * Detect the root only when either path is missing; providing both
	 * source and target skips detection entirely
	 */
	if (!options.sourcePackagePath || !options.targetNodeModulesPath)
	{
		let rootData = findRoot(options as IFindRootOptions);

		/** 來源預設為目前套件的根目錄 / Source defaults to the current package root directory */
		options.sourcePackagePath ??= rootData.pkg;
		/** 目標預設為專案根目錄下的模組目錄 / Target defaults to the modules directory under the project root */
		options.targetNodeModulesPath ??= getModulesDir(rootData.root, options.targetNodeModulesName)
	}

	/**
	 * 名稱預設讀取來源套件的 package.json.name，
	 * 如此 scoped package 才會建立在 node_modules 的 scope 子目錄下。
	 * The name defaults to the source package.json name so scoped packages
	 * are created under the scope subdirectory of node_modules.
	 */
	options.name ??= readPackageJSON<IPackageJson>(options.sourcePackagePath).name;

	/**
	 * 此時選項已補齊，但泛型 T 無法讓編譯器推知，故以斷言轉為 IOptions
	 * Options are complete here, but the generic T does not tell the compiler
	 * that, so an assertion to IOptions is required
	 */
	return linkToNodeModulesCore(options as IOptions)
}

/**
 * 預設匯出主要入口函式，兼容 `import linkToNodeModules from ...` 的用法
 * Default-export the main entry for `import linkToNodeModules from ...` usage
 */
export default linkToNodeModules

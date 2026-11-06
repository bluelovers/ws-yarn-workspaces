/**
 * 創建 Workspaces 工具模組
 *
 * 提供初始化 Workspaces 專案結構的功能，
 * 包含 package.json 設定、
 * Lerna 整合、
 * 目錄創建與靜態檔案複製等功能。
 */

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { resolve, join, basename } from 'upath2';
import pkgDir from 'pkg-dir';
import { consoleLogger as console } from 'debug-color2/logger';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs-extra';
import { sortPackageJson } from 'sort-package-json3';
import { getDefaultPackageJson } from './lib';
import { isSamePath } from './lib/util';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { getWsCopyStaticFiles } from '@yarn-tool/static-file/lib/ws/wsCopyStaticFiles';
import { findRootLazy } from '@yarn-tool/find-root';
import { normalize as pathNormalize } from 'upath2';
import { _isAddStaticFilesOrReset } from '@yarn-tool/fix-all/lib/file/staticFiles';
import { INpmAutoFixAll } from '@yarn-tool/fix-all';

export * from './lib/index';
export * from './lib/util';

/**
 * 創建 Workspaces 的選項介面
 */
export interface IOptions extends Pick<INpmAutoFixAll, 'addStaticFiles' | 'noStaticFiles'>
{
	/**
	 * 工作目錄路徑
	 */
	cwd?: string,

	/**
	 * 忽略父層 Workspaces
	 */
	ignoreParentWorkspaces?: boolean,

	/**
	 * 忽略已存在的 Package
	 */
	ignoreExistsPackage?: boolean,

	/**
	 * 初始化 Package.json 的回呼函式
	 * @template T - 擴展屬性類型
	 * @param current - 當前的 package.json
	 * @returns 修改後的 package.json
	 */
	initPackageJson?<T extends Record<string, any> = {}>(current: IPackageJson): IPackageJson & T,

	/**
	 * 啟用除錯模式
	 */
	debug?: boolean,
}

/**
 * 創建 Workspaces 主函式
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建
 */
export function createYarnWorkspaces(cwd?: string, options: IOptions = {})
{
	/** 處理第一個參數可能是選項物件的情況 */
	if (cwd && typeof cwd != 'string')
	{
		options = cwd;
		cwd = options.cwd;
	}

	/** 預設使用當前工作目錄 */
	cwd ??= process.cwd();

	/** 尋找專案根目錄資訊 */
	const rootData = findRootLazy({
		cwd,
	});

	/** 標準化路徑 */
	cwd = pathNormalize(rootData?.cwd ?? cwd);

	/** 取得 Package 根目錄與 Workspaces 路徑 */
	let root: string = rootData?.pkg;
	let ws: string = rootData?.ws;

	/** 實際要初始化的目標路徑：優先採用既有 package 根目錄，否則退回 cwd。 */
	let targetPath = resolve(root || cwd);

	/** 除錯輸出 */
	options.debug && console.debug({
		targetPath,
		ws,
		options,
	});

	/**
	 * 檢查是否已存在 Package
	 */
	if (!options.ignoreExistsPackage && root)
	{
		console.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);

		return false;
	}
	else if (root)
	{
		/** 忽略已存在的 Package */
		console.warn(`ignore exists package "${root}"`);
	}

	/**
	 * 檢查是否已存在 Workspaces
	 */
	if (ws)
	{
		/** 檢查目標路徑是否與現有 Workspace 相同 */
		let bool: boolean = !isSamePath(targetPath, ws);

		console.warn(`detect exists workspace "${ws}"`);

		if (bool)
		{
			/** 根據選項決定是否忽略父層 Workspaces */
			if (options.ignoreParentWorkspaces)
			{
				console.warn(`ignoreParentWorkspaces = true`);
				bool = false;
			}
			else
			{
				console.error(`target path already is workspace`);
			}
		}

		if (bool)
		{
			return false;
		}
	}

	return _createYarnWorkspaces(targetPath, options);
}

/**
 * 內部創建 Workspaces 實作函式
 *
 * 執行實際的 Workspaces 初始化工作，包含：
 * - 讀取並更新 Lerna 配置
 * - 創建或更新 package.json
 * - 複製靜態範本檔案
 * - 創建 packages 目錄
 *
 * @param targetPath - 目標路徑
 * @param options - 配置選項
 * @returns 是否成功
 */
export function _createYarnWorkspaces(targetPath: string, options: IOptions = {})
{
	console.info(`create in target path "${targetPath}"`);

	let pkg: IPackageJson;

	let lerna: ILernaJson;

	/**
	 * 嘗試讀取現有的 lerna.json 配置
	 */
	{
		let file = join(targetPath, 'lerna.json');

		if (existsSync(file))
		{
			let json: ILernaJson = JSON.parse(readFileSync(file).toString());

			/**
			 * 清理空的 packages 陣列
			 */
			if (json.packages && !Object.keys(json.packages).length)
			{
				json.packages = undefined;
			}

			lerna = json;
		}
	}

	/**
	 * 預設 packages 目錄模式
	 */
	let packages = lerna && lerna.packages || [
		"packages/*",
	];

	let file = join(targetPath, 'package.json');

	/**
	 * 處理 package.json 不存在的情況
	 */
	if (!existsSync(file))
	{
		/** 使用目錄名作為預設 Package 名稱 */
		let name = basename(targetPath);

		/** 創建目標目錄（如果不存在） */
		if (!existsSync(targetPath))
		{
			mkdirSync(targetPath);
		}

		/** 合併預設配置與基本資訊 */
		pkg = Object.assign(getDefaultPackageJson(name), {
			name,
			workspaces: packages,
		});

		/**
		 * 執行自定義初始化回呼
		 */
		if (options.initPackageJson)
		{
			let ret = options.initPackageJson(pkg);

			if (ret)
			{
				pkg = ret;
			}
		}
	}
	else
	{
		/**
		 * 處理已存在的 package.json
		 */
		let json: IPackageJson = JSON.parse(readFileSync(file).toString());

		let workspaces: ILernaJson['packages'];

		/**
		 * 解析現有的 workspaces 配置
		 */
		if (json.workspaces && Object.keys(json.workspaces).length)
		{
			workspaces = json.workspaces;

			/**
			 * 支援 nohoist 配置格式
			 * @see https://yarnpkg.com/blog/2018/02/15/nohoist/
			 */
			// @ts-ignore
			packages = workspaces.packages || workspaces;
		}
		else
		{
			workspaces = packages;
		}

		/**
		 * 更新 Package.json 內容
		 */
		pkg = Object.assign(json, {
			"private": true,
			"workspaces": workspaces,
		});

		/**
		 * 合併預設腳本與欄位
		 */
		Object.entries(getDefaultPackageJson(json.name))
			.forEach(([field, value]) => {

				/**
				 * 特殊處理 scripts 欄位：合併而非覆蓋
				 */
				if (field === 'scripts')
				{
					pkg.scripts ??= {};
					pkg.scripts = {
						// @ts-ignore
						...value,
						...pkg.scripts,
					}
				}
				else
				{
					/** 使用空值合併運算子設置預設值 */
					pkg[field] ??= value
				}

			})
		;

	}

	/**
	 * 寫入格式化後的 package.json
	 */
	let s = JSON.stringify(sortPackageJson(pkg), null, 2);
	writeFileSync(file, s);

	console.success(`create workspace package.json`);

	/**
	 * 更新 Lerna 配置（如果存在且需要更新）
	 */
	if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna['useWorkspaces'] !== true))
	{
		let file = join(targetPath, 'lerna.json');

		/** 更新 Workspaces 模式 */
		lerna.packages = packages;
		lerna.npmClient ??= 'pnpm';
		// lerna['useWorkspaces'] = true;

		let s = JSON.stringify(sortPackageJson(lerna), null, 2);
		writeFileSync(file, s);

		console.info(`update lerna.json`);
	}

	/**
	 * 複製靜態範本檔案
	 */
	const file_map = getWsCopyStaticFiles();

	/**
	 * 複製靜態範本檔案
	 *
	 * 此呼叫點 addStaticFiles 預設為 true，可用 noStaticFiles 關閉
	 */
	if (_isAddStaticFilesOrReset(options, true))
	{
		copyStaticFiles({
			cwd: targetPath,
			file_map,
		});
	}

	/**
	 * 根據 packages 模式創建目錄
	 */
	createDirByPackages(targetPath, packages);

	return true;
}

/**
 * 根據 packages 模式創建目錄
 *
 * 解析 packages 陣列中的目錄模式（如 "packages/*"），
 * 並創建對應的實體目錄。
 *
 * @param cwd - 當前工作目錄
 * @param packages - packages 模式陣列
 * @returns 是否有創建任何目錄
 */
export function createDirByPackages(cwd: string, packages: string[])
{
	return packages.some(function (value)
	{
		let bool: boolean;

		/** 提取路徑的第一個部分（目錄名稱） */
		let s = value.split(/[\/\\]/)[0];

		/**
		 * 只處理不包含 glob 模式的純目錄路徑
		 */
		if (!/[!?\*{}\[\]]/.test(s))
		{
			let dir = join(cwd, s);

			/** 目錄不存在時創建 */
			if (!existsSync(dir))
			{
				mkdirSync(dir);
			}

			return true;
		}

		return bool;
	})
}

/**
 * 預設導出創建函式
 */
export default createYarnWorkspaces;

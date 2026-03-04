/**
 * 計算套件初始化目標路徑
 * Calculate package initialization target path
 *
 * 此模組用於在 Yarn Workspaces 環境中，根據套件名稱解析出正確的目標目錄路徑
 * This module resolves the correct target directory path based on package name in Yarn Workspaces environment
 */

import { validateNpmPackageName } from '@yarn-tool/validate-npm-package-name';
import { join, resolve } from "path";
import { pathExistsSync } from 'fs-extra';
import { parseStaticPackagesPaths, IParseStaticPackagesPathsReturnType } from 'workspaces-config';
import { searchWorkspacePrefixByName } from '@yarn-tool/search-workspace-prefix-by-name';

/**
 * 取得目標目錄配置
 * Get target directory configuration
 *
 * 根據輸入的套件名稱和工作區配置，計算出目標目錄路徑
 * Calculates the target directory path based on input package name and workspace configuration
 *
 * @param options - 配置選項 / Configuration options
 * @returns 目標目錄資訊 / Target directory information
 */
export function getTargetDir(options: {
	/** 輸入的套件名稱 / Input package name */
	inputName: string,
	/** 當前工作目錄 / Current working directory */
	cwd: string,

	/** 目標套件名稱（可選）/ Target package name (optional) */
	targetName?: string,
	/** 工作區根目錄路徑（可選）/ Workspace root directory path (optional) */
	hasWorkspace?: string,
	/** 工作區前綴（可選）/ Workspace prefix (optional) */
	workspacePrefix?: string,
	/** 工作區配置（可選）/ Workspace configuration (optional) */
	workspacesConfig?: IParseStaticPackagesPathsReturnType
})
{
	/** 目標目錄路徑 / Target directory path */
	let targetDir: string;
	/** 目標套件名稱 / Target package name */
	let targetName: string = options.targetName || null;
	/** 解構配置選項 / Destructure configuration options */
	let { inputName, cwd, hasWorkspace, workspacePrefix, workspacesConfig } = options;

	/**
	 * 驗證工作區配置
	 * Validate workspace configuration
	 *
	 * 如果有指定工作區但找不到前綴設定，拋出錯誤
	 * Throw error if workspace is specified but prefix config is not found
	 */
	if (hasWorkspace && !workspacesConfig?.prefix?.length)
	{
		throw new RangeError(`can't found workspace prefix`);
	}

	/**
	 * 驗證目標套件名稱
	 * Validate target package name
	 *
	 * 如果提供了 targetName，進行 npm 套件名稱驗證
	 * Perform npm package name validation if targetName is provided
	 */
	if (targetName)
	{
		validateNpmPackageName(targetName, true);
	}

	/** 是否為作用域套件模式 / Whether it's a scoped package pattern */
	let scopedPackagePattern: boolean;

	/**
	 * 處理輸入的套件名稱
	 * Process input package name
	 *
	 * 根據輸入名稱計算目標目錄
	 * Calculate target directory based on input name
	 */
	if (inputName)
	{
		/** 設定目標套件名稱 / Set target package name */
		targetName = targetName || inputName;

		/** 驗證輸入的套件名稱 / Validate input package name */
		let ret = validateNpmPackageName(inputName, true);
		/** 套件名稱 / Package name */
		let name = inputName;

		/** 基礎路徑 / Base path */
		let basePath: string;

		/**
		 * 計算基礎路徑
		 * Calculate base path
		 *
		 * 如果在工作區環境中，使用工作區前綴；否則使用當前目錄
		 * Use workspace prefix if in workspace environment, otherwise use current directory
		 */
		if (hasWorkspace)
		{
			/** 搜尋工作區前綴 / Search workspace prefix */
			const workspacePrefix = searchWorkspacePrefixByName({
				inputName,
				workspacesConfig,
			})

			/** 組合工作區路徑 / Join workspace path */
			basePath = join(hasWorkspace, workspacePrefix);
		}
		else
		{
			/** 使用當前目錄作為基礎路徑 / Use current directory as base path */
			basePath = cwd;
		}

		/**
		 * 處理作用域套件名稱 (@scope/name)
		 * Process scoped package name (@scope/name)
		 *
		 * 將作用域套件名稱轉換為檔案系統路徑格式
		 * Convert scoped package name to filesystem path format
		 */
		if (ret.scopedPackagePattern)
		{
			/**
			 * 轉換作用域名稱
			 * Convert scope name
			 *
			 * 1. 將斜線和反斜線替換為底線
			 * 2. 移除開頭的 @ 符號
			 *
			 * 1. Replace slashes and backslashes with underscores
			 * 2. Remove leading @ symbol
			 */
			name = name
				.replace(/[\/\\]+/g, '_')
				.replace(/^@/g, '')
			;

			/**
			 * 檢查子目錄是否存在
			 * Check if subdirectory exists
			 *
			 * 如果子套件目錄不存在，使用子套件名稱作為目錄名
			 * Use subpackage name as directory name if subdirectory doesn't exist
			 */
			if (!pathExistsSync(join(basePath, ret.subname)))
			{
				name = ret.subname;
			}
		}

		/** 記錄是否為作用域套件 / Record whether it's a scoped package */
		scopedPackagePattern = ret.scopedPackagePattern;

		/** 解析最終目標目錄路徑 / Resolve final target directory path */
		targetDir = resolve(basePath, name);
	}
	/**
	 * 無輸入名稱時使用當前目錄
	 * Use current directory when no input name
	 */
	else
	{
		targetDir = cwd;
	}

	/**
	 * 回傳目錄配置結果
	 * Return directory configuration result
	 */
	return {
		/** 目標目錄路徑 / Target directory path */
		targetDir,
		/** 目標套件名稱 / Target package name */
		targetName,
		/** 當前工作目錄 / Current working directory */
		cwd,
		/** 是否為作用域套件模式 / Whether it's a scoped package pattern */
		scopedPackagePattern,
	}
}

/**
 * 預設匯出 getTargetDir 函式
 * Default export of getTargetDir function
 */
export default getTargetDir

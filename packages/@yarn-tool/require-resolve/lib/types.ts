import type { IPathItem } from '@yarn-tool/get-paths-by-type';
import type { IPackageJson } from '@ts-type/package-dts';

/**
 * 核心解析選項介面
 * Core resolution options interface
 */
export interface IOptionsRequireResolveCore
{
	/** 模組解析的搜尋路徑 / Search paths for module resolution */
	paths?: (string | IPathItem)[];
}

/**
 * require.resolve 擴充選項介面
 * Extended options interface for require.resolve
 */
export interface IOptionsRequireResolve extends IOptionsRequireResolveCore
{
	/** 模組名稱對應表 / Module name mapping table */
	map?: Record<string, string>;
	/** 自訂 require 函數 / Custom require function */
	require?: NodeRequire;
	/** 是否包含全域路徑 / Whether to include global paths */
	includeGlobal?: boolean | IPathItem[];
	/** 是否包含當前目錄 / Whether to include current directory */
	includeCurrentDirectory?: boolean;
	/** 工作目錄 / Working directory */
	cwd?: string;
}

/**
 * 模組未找到錯誤類型
 * Module not found error type
 *
 * @typeParam E - 原始錯誤類型 / Original error type
 */
export type IErrorModuleNotFound<E = Error> = E & {
	/** 錯誤代碼 / Error code */
	code: string | 'MODULE_NOT_FOUND';
	/** require 堆疊 / Require stack */
	requireStack: string[];
};

/**
 * 解析套件時的選項配置
 * Options configuration for package resolution
 *
 * @deprecated 使用 IOptionsRequireResolve 代替 / Use IOptionsRequireResolve instead
 */
export type IOptionsRequireResolveNode = IOptionsRequireResolve;

/**
 * 套件核心資訊
 * Core package information
 */
export interface IPackageCoreInfo
{
	/** 模組名稱 / Module name */
	name: string;
	/** 套件根目錄 / Package root directory */
	pkgRoot: string;
	/** 入口點位置 / Entry point location */
	entryPointLocation: string;
}

/**
 * 完整套件資訊
 * Complete package information
 *
 * @typeParam P - package.json 的類型 / Type of package.json
 */
export interface IPackageInfo<P extends IPackageJson = IPackageJson> extends IPackageCoreInfo
{
	/** 解析後的 package.json 物件 / Parsed package.json object */
	pkg: P;
	/** package.json 檔案的絕對路徑 / Absolute path to package.json file */
	pkgJsonLocation: string;
	/** 相對於套件根目錄解析路徑的函數 / Function to resolve paths relative to package root */
	resolveLocation: (path: string, ...paths: string[]) => string;
}

/**
 * 解析結果
 * Resolution result
 */
export interface IResolveResult
{
	/** 解析後的模組路徑 / Resolved module path */
	result?: string;
	/** 錯誤物件（若發生錯誤）/ Error object (if error occurred) */
	error?: IErrorModuleNotFound<Error>;
}

export type {
	IPathItem,
	IPackageJson,
}
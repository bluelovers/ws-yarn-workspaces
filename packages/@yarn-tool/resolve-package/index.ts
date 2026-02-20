import { dirname, normalize, sep, resolve } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';
import { sync as pkgDir } from 'pkg-dir';

/**
 * 解析套件時的選項配置
 * Options configuration for package resolution
 *
 * @see RequireResolve
 */
export interface IOptions
{
	/** 模組解析的搜尋路徑 / Search paths for module resolution */
	paths?: string[];
}

/**
 * 解析套件的核心函數
 * Core function for package resolution
 *
 * 此函數嘗試解析模組的入口點位置，若失敗則改為解析 package.json 位置。
 * This function attempts to resolve the module's entry point location,
 * falling back to package.json location if the first attempt fails.
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 包含模組名稱、套件根目錄和入口點位置的物件 / Object containing module name, package root, and entry point location
 */
export function resolvePackageCore(moduleName: string, options?: IOptions)
{
	let entryPointLocation: string;

	// 嘗試解析模組入口點 / Try to resolve module entry point
	try
	{
		entryPointLocation = require.resolve(moduleName, options);
	}
	catch (e)
	{
		// 若失敗則解析 package.json 作為替代 / Fallback to resolving package.json
		entryPointLocation = require.resolve(moduleName + '/package.json', options);
	}

	// 從入口點位置找到套件根目錄 / Find package root from entry point location
	const pkgRoot = pkgDir(entryPointLocation);

	return {
		name: moduleName,
		pkgRoot,
		entryPointLocation,
	}
}

/**
 * 解析並取得套件的根目錄路徑
 * Resolve and get the package root directory path
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 套件根目錄的絕對路徑 / Absolute path to the package root directory
 */
export function resolvePackageRoot(moduleName: string, options?: IOptions)
{
	return resolvePackageCore(moduleName, options).pkgRoot
}

/**
 * 解析並取得套件的 package.json 檔案位置
 * Resolve and get the package.json file location
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns package.json 檔案的絕對路徑 / Absolute path to the package.json file
 */
export function resolvePackageJsonLocation(moduleName: string, options?: IOptions)
{
	return resolve(resolvePackageRoot(moduleName, options), 'package.json')
}

/**
 * 建立一個相對於套件根目錄解析路徑的函數
 * Create a function that resolves paths relative to the package root
 *
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 接受路徑參數並返回絕對路徑的函數 / Function that accepts path arguments and returns absolute paths
 */
export function createResolveLocationFn(moduleName: string, options?: IOptions)
{
	const { pkgRoot } = resolvePackageCore(moduleName, options);
	return (path: string, ...paths: string[]) => resolve(pkgRoot, path, ...paths)
}

/**
 * 讀取模組的 package.json 內容
 * Read the module's package.json content
 *
 * @typeParam P - package.json 的類型，預設為 IPackageJson / Type of package.json, defaults to IPackageJson
 * @param moduleName - 要讀取的模組名稱 / Module name to read
 * @param options - 解析選項 / Resolution options
 * @returns 解析後的 package.json 物件 / Parsed package.json object
 */
export function readModulePackageJson<P extends IPackageJson>(moduleName: string, options?: IOptions): P
{
	return require(resolvePackageJsonLocation(moduleName, options))
}

/**
 * 解析套件並取得完整資訊
 * Resolve package and get complete information
 *
 * 此函數提供最完整的套件解析功能，返回包含套件根目錄、入口點、
 * package.json 內容及路徑解析函數的完整物件。
 * This function provides the most comprehensive package resolution,
 * returning a complete object with package root, entry point,
 * package.json content, and a path resolution function.
 *
 * @typeParam P - package.json 的類型，預設為 IPackageJson / Type of package.json, defaults to IPackageJson
 * @param moduleName - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 包含完整套件資訊的物件 / Object containing complete package information
 */
export function resolvePackage<P extends IPackageJson>(moduleName: string, options?: IOptions)
{
	const _ = resolvePackageCore(moduleName, options);
	const { pkgRoot } = _;

	// 建立 package.json 的完整路徑 / Build full path to package.json
	const pkgJsonLocation: string = resolve(pkgRoot, 'package.json');

	return {
		/** 模組名稱 / Module name */
		..._,
		/** 解析後的 package.json 物件 / Parsed package.json object */
		pkg: require(pkgJsonLocation) as any as P,
		/** package.json 檔案的絕對路徑 / Absolute path to package.json file */
		pkgJsonLocation,
		/**
		 * 相對於套件根目錄解析路徑
		 * Resolve path relative to package root
		 *
		 * @param path - 相對路徑 / Relative path
		 * @param paths - 額外的路徑區段 / Additional path segments
		 * @returns 絕對路徑 / Absolute path
		 */
		resolveLocation(path: string, ...paths: string[])
		{
			return resolve(pkgRoot, path, ...paths)
		},
	}
}

export default resolvePackage

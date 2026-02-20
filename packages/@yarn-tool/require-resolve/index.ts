import {
	getPathsByType,
	IPathItem,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
} from '@yarn-tool/get-paths-by-type';

/**
 * 預設的模組名稱對應表
 * Default module name mapping
 *
 * 某些模組的入口點與模組名稱不同，此對應表用於轉換。
 * Some modules have entry points different from their names, this mapping handles the conversion.
 */
const defaultMap: Record<string, string> = {
	tsdx: 'tsdx/dist/index',
}

export {
	IPathItem,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
}

/**
 * 核心解析選項介面
 * Core resolution options interface
 */
export interface IOptionsCore
{
	/** 模組解析的搜尋路徑 / Search paths for module resolution */
	paths?: (string | IPathItem)[];
}

/**
 * require.resolve 擴充選項介面
 * Extended options interface for require.resolve
 */
export interface IOptions extends IOptionsCore
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
 * require.resolve 的核心實作，支援額外搜尋路徑
 * Core implementation of require.resolve with extra search paths support
 *
 * 此函數擴充了原生 require.resolve，允許在全域 npm/yarn 路徑和當前目錄中搜尋模組。
 * This function extends native require.resolve, allowing module search in global npm/yarn paths and current directory.
 *
 * @param name - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 解析後的模組路徑 / Resolved module path
 */
export function requireResolveCore(name: string, options?: IOptions)
{
	options ??= {};

	// 取得目標路徑，優先使用自訂對應表 / Get target path, prefer custom mapping
	const target: string = options.map?.[name] ?? defaultMap[name] ?? name;

	let paths: IOptionsCore["paths"] = options.paths;

	// 處理全域路徑包含選項 / Handle global paths inclusion option
	if (options.includeGlobal)
	{
		paths = paths ?? [];

		if (Array.isArray(options.includeGlobal))
		{
			(options.includeGlobal)
				.forEach(value =>
				{
					switch (value)
					{
						case SymbolGlobalYarn:
						case SymbolGlobalNpm:
						case SymbolCurrentDirectory:
						case SymbolGlobal:
						case SymbolModuleMain:
							_unshiftArray(paths, value);
							break;
					}
				})
		}
		else
		{
			_unshiftArray(paths, SymbolGlobal)
		}
	}

	// 處理當前目錄包含選項 / Handle current directory inclusion option
	if (options.includeCurrentDirectory)
	{
		_unshiftArray(paths, SymbolCurrentDirectory)
	}

	return (options.require ?? require).resolve(target, {
		...options,
		paths: handleOptionsPaths(paths, options.cwd),
	})
}

/**
 * 模組未找到錯誤類型
 * Module not found error type
 */
export type IErrorModuleNotFound<E> = E & {
	/** 錯誤代碼 / Error code */
	code: string | 'MODULE_NOT_FOUND';
	/** require 堆疊 / Require stack */
	requireStack: string[];
};

/**
 * 處理選項中的路徑陣列，將符號轉換為實際路徑
 * Process paths array in options, converting symbols to actual paths
 *
 * @param paths - 路徑陣列，可包含符號或實際路徑 / Path array, can contain symbols or actual paths
 * @param cwd - 工作目錄 / Working directory
 * @returns 轉換後的實際路徑陣列 / Converted actual path array
 */
export function handleOptionsPaths(paths: IOptionsCore["paths"], cwd?: string): string[]
{
	if (paths?.length)
	{
		paths = paths.reduce((paths, value) =>
		{
			switch (value)
			{
				case SymbolGlobal:
				case SymbolCurrentDirectory:
				case SymbolGlobalNpm:
				case SymbolGlobalYarn:
				case SymbolModuleMain:
					// 將符號轉換為實際路徑 / Convert symbol to actual paths
					paths.push(...getPathsByType(value, cwd))
					break;
				default:
					// 處理字串路徑 / Handle string path
					if (value ?? false)
					{
						paths.push(value)
					}
			}

			return paths
		}, [] as string[]);
	}

	if (!paths?.length)
	{
		paths = void 0
	}

	return paths as string[]
}

/**
 * 檢查錯誤是否為模組未找到錯誤
 * Check if error is a module not found error
 *
 * @typeParam T - 錯誤類型 / Error type
 * @param error - 要檢查的錯誤 / Error to check
 * @returns 是否為 MODULE_NOT_FOUND 錯誤 / Whether it's a MODULE_NOT_FOUND error
 */
export function isErrorModuleNotFound<T extends Error>(error: T): error is IErrorModuleNotFound<T>
{
	return (error as IErrorModuleNotFound<T>).code === 'MODULE_NOT_FOUND'
}

/**
 * 解析並載入模組
 * Resolve and load module
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 載入的模組 / Loaded module
 */
export function requireExtra<T extends any>(name: string, options?: IOptions): T
{
	return require(requireResolveCore(name, options))
}

/**
 * 解析並動態導入模組
 * Resolve and dynamically import module
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 模組的 Promise / Promise of the module
 */
export function importExtra<T extends any>(name: string, options?: IOptions): Promise<T>
{
	return import(requireResolveCore(name, options))
}

/**
 * 解析模組並返回結果或錯誤
 * Resolve module and return result or error
 *
 * 此函數不會拋出 MODULE_NOT_FOUND 錯誤，而是將錯誤包含在返回物件中。
 * This function doesn't throw MODULE_NOT_FOUND error, instead includes it in the return object.
 *
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 包含結果和錯誤的物件 / Object containing result and error
 */
export function requireResolveExtra(name: string, options?: IOptions)
{
	let error: IErrorModuleNotFound<Error>;
	let result: string;

	try
	{
		result = requireResolveCore(name, options)

		return {
			result,
			error,
		}
	}
	catch (e)
	{
		error = e;

		// MODULE_NOT_FOUND 錯誤不拋出，而是返回 / Don't throw MODULE_NOT_FOUND, return it instead
		if (isErrorModuleNotFound(error))
		{
			return {
				result,
				error,
			}
		}

		throw error;
	}
}

/**
 * 將元素插入陣列開頭（若不存在）
 * Unshift item to array if not already at beginning
 *
 * @typeParam T - 陣列元素類型 / Array element type
 * @param array - 目標陣列 / Target array
 * @param item - 要插入的元素 / Item to insert
 * @returns 修改後的陣列 / Modified array
 */
export function _unshiftArray<T extends any>(array: T[], item: T)
{
	(array[0] !== item) && array.unshift(item);

	return array;
}

export default requireResolveExtra
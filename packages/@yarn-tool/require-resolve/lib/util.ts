import {
	getPathsByType,
	IPathItem,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
} from '@yarn-tool/get-paths-by-type';
import type { IOptionsRequireResolveCore } from './types';

export {
	IPathItem,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
}

/**
 * 預設的模組名稱對應表
 * Default module name mapping
 *
 * 某些模組的入口點與模組名稱不同，此對應表用於轉換。
 * Some modules have entry points different from their names, this mapping handles the conversion.
 */
export const defaultMap: Record<string, string> = {
	tsdx: 'tsdx/dist/index',
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
export function unshiftArray<T>(array: T[], item: T): T[]
{
	if (array[0] !== item)
	{
		array.unshift(item);
	}

	return array;
}

/**
 * 處理選項中的路徑陣列，將符號轉換為實際路徑
 * Process paths array in options, converting symbols to actual paths
 *
 * @param paths - 路徑陣列，可包含符號或實際路徑 / Path array, can contain symbols or actual paths
 * @param cwd - 工作目錄 / Working directory
 * @returns 轉換後的實際路徑陣列 / Converted actual path array
 */
export function handleOptionsPaths(paths: IOptionsRequireResolveCore["paths"], cwd?: string): string[] | undefined
{
	if (paths?.length)
	{
		const result = paths.reduce((acc, value) =>
		{
			switch (value)
			{
				case SymbolGlobal:
				case SymbolCurrentDirectory:
				case SymbolGlobalNpm:
				case SymbolGlobalYarn:
				case SymbolModuleMain:
					// 將符號轉換為實際路徑 / Convert symbol to actual paths
					acc.push(...getPathsByType(value, cwd));
					break;
				default:
					// 處理字串路徑 / Handle string path
					if (value ?? false)
					{
						acc.push(value as string);
					}
			}

			return acc;
		}, [] as string[]);

		return result.length ? result : undefined;
	}

	return undefined;
}

/**
 * 取得目標模組名稱
 * Get target module name
 *
 * 優先使用自訂對應表，其次使用預設對應表，最後使用原始名稱。
 * Prefers custom mapping, then default mapping, finally uses original name.
 *
 * @param name - 原始模組名稱 / Original module name
 * @param map - 自訂對應表 / Custom mapping table
 * @returns 目標模組名稱 / Target module name
 */
export function getTargetName(name: string, map?: Record<string, string>): string
{
	return map?.[name] ?? defaultMap[name] ?? name;
}

/**
 * Symbol 類型陣列，用於驗證 includeGlobal 陣列中的元素
 * Array of Symbol types for validation in includeGlobal array
 */
export const validSymbols: readonly IPathItem[] = [
	SymbolGlobalYarn,
	SymbolGlobalNpm,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolModuleMain,
] as const;

/**
 * 檢查值是否為有效的 Symbol 路徑類型
 * Check if value is a valid Symbol path type
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為有效的 Symbol / Whether it's a valid Symbol
 */
export function isValidPathSymbol(value: unknown): value is IPathItem
{
	return validSymbols.includes(value as IPathItem);
}
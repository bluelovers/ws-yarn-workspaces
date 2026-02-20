import { IPathItem, SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain } from '@yarn-tool/get-paths-by-type';
import type { IOptionsRequireResolveCore } from './types';
export { IPathItem, SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, };
/**
 * 預設的模組名稱對應表
 * Default module name mapping
 *
 * 某些模組的入口點與模組名稱不同，此對應表用於轉換。
 * Some modules have entry points different from their names, this mapping handles the conversion.
 */
export declare const defaultMap: Record<string, string>;
/**
 * 將元素插入陣列開頭（若不存在）
 * Unshift item to array if not already at beginning
 *
 * @typeParam T - 陣列元素類型 / Array element type
 * @param array - 目標陣列 / Target array
 * @param item - 要插入的元素 / Item to insert
 * @returns 修改後的陣列 / Modified array
 */
export declare function unshiftArray<T>(array: T[], item: T): T[];
/**
 * 處理選項中的路徑陣列，將符號轉換為實際路徑
 * Process paths array in options, converting symbols to actual paths
 *
 * @param paths - 路徑陣列，可包含符號或實際路徑 / Path array, can contain symbols or actual paths
 * @param cwd - 工作目錄 / Working directory
 * @returns 轉換後的實際路徑陣列 / Converted actual path array
 */
export declare function handleOptionsPaths(paths: IOptionsRequireResolveCore["paths"], cwd?: string): string[] | undefined;
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
export declare function getTargetName(name: string, map?: Record<string, string>): string;
/**
 * Symbol 類型陣列，用於驗證 includeGlobal 陣列中的元素
 * Array of Symbol types for validation in includeGlobal array
 */
export declare const validSymbols: readonly IPathItem[];
/**
 * 檢查值是否為有效的 Symbol 路徑類型
 * Check if value is a valid Symbol path type
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為有效的 Symbol / Whether it's a valid Symbol
 */
export declare function isValidPathSymbol(value: unknown): value is IPathItem;

import type { IOptionsRequireResolve, IOptionsRequireResolveCore, IResolveResult } from './types';
import { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, handleOptionsPaths, type IPathItem } from './util';
export { handleOptionsPaths };
import { type IErrorModuleNotFound } from './error';
export { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, };
/**
 * 建構解析路徑陣列
 * Build resolution paths array
 *
 * 根據選項配置建構用於模組解析的路徑陣列。
 * Constructs the paths array for module resolution based on options.
 *
 * @param options - 解析選項 / Resolution options
 * @returns 路徑陣列 / Paths array
 */
export declare function buildResolvePaths(options: IOptionsRequireResolve): (string | IPathItem)[];
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
 *
 * @example
 * ```typescript
 * // 基本用法 / Basic usage
 * const path = requireResolveCore('jest');
 *
 * // 使用全域路徑 / With global paths
 * const path = requireResolveCore('typescript', {
 *   includeGlobal: true,
 * });
 *
 * // 使用自訂對應 / With custom mapping
 * const path = requireResolveCore('my-module', {
 *   map: { 'my-module': 'my-module/dist/index' },
 * });
 * ```
 */
export declare function requireResolveCore(name: string, options?: IOptionsRequireResolve): string;
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
 *
 * @example
 * ```typescript
 * const { result, error } = requireResolveExtra('some-module');
 *
 * if (error) {
 *   console.log('Module not found:', error.message);
 * } else {
 *   console.log('Module path:', result);
 * }
 * ```
 */
export declare function requireResolveExtra(name: string, options?: IOptionsRequireResolve): IResolveResult;
export type { IOptionsRequireResolve, IOptionsRequireResolveCore, IResolveResult, IPathItem, IErrorModuleNotFound, };

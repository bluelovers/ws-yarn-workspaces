import { importExtra } from './loader-import.cjs';
import { IOptionsRequireResolve } from './types';
export { importExtra };
/**
 * 嘗試非同步載入模組，失敗時返回 null
 * Try to asynchronously load module, return null on failure
*
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 模組的 Promise 或 null / Promise of the module or null
 *
 * @example
 * ```typescript
 * const module = await tryImportExtra('optional-module');
 * ```
 */
export declare function tryImportExtra<T = unknown>(name: string, options?: IOptionsRequireResolve): Promise<T | null>;

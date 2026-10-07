// @ts-ignore
import { importExtra } from './loader-import.cjs';
import { IOptionsRequireResolve } from './types';

export { importExtra }

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
export async function tryImportExtra<T = unknown>(name: string, options?: IOptionsRequireResolve): Promise<T | null>
{
	try
	{
		return await importExtra<T>(name, options);
	}
	catch
	{
		/**
		 * 與 tryRequireExtra 相同：載入失敗回傳 null 而不拋出，
		 * await 會把同步與非同步的失敗一併捕捉。
		 * Same as tryRequireExtra: a failed load returns null instead of
		 * throwing, and await catches both sync and async failures.
		 */
		return null;
	}
}

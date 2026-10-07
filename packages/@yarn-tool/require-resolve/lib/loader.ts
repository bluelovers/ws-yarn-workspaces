import type { IOptionsRequireResolve } from './types';
import { requireResolveCore } from './core';


/**
 * 解析並載入模組
 * Resolve and load module
 *
 * 此函數結合模組路徑解析和 require 載入，提供一站式模組載入功能。
 * This function combines module path resolution and require loading,
 * providing a one-stop module loading solution.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 載入的模組 / Loaded module
 *
 * @example
 * ```typescript
 * // 載入 jest 模組 / Load jest module
 * const jest = requireExtra<typeof import('jest')>('jest');
 *
 * // 使用全域路徑載入 / Load with global paths
 * const ts = requireExtra('typescript', { includeGlobal: true });
 * ```
 */
export function requireExtra<T = unknown>(name: string, options?: IOptionsRequireResolve): T
{
	return require(requireResolveCore(name, options));
}

/**
 * 嘗試載入模組，失敗時返回 null
 * Try to load module, return null on failure
 *
 * 此函數嘗試載入模組，若模組不存在或其他錯誤發生時返回 null 而非拋出錯誤。
 * This function attempts to load a module, returning null instead of throwing
 * when the module doesn't exist or other errors occur.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 載入的模組或 null / Loaded module or null
 *
 * @example
 * ```typescript
 * const module = tryRequireExtra('optional-module');
 * if (module) {
 *   // 模組載入成功 / Module loaded successfully
 * } else {
 *   // 模組不存在 / Module doesn't exist
 * }
 * ```
 */
export function tryRequireExtra<T = unknown>(name: string, options?: IOptionsRequireResolve): T | null
{
	try
	{
		return requireExtra<T>(name, options);
	}
	catch
	{
		/**
		 * 任何載入失敗（模組不存在、入口點錯誤等）一律回傳 null，
		 * 讓呼叫端以 if 判斷即可，不必自行包 try/catch。
		 * Any load failure (missing module, broken entry, …) becomes null so
		 * callers can just test the value instead of wrapping try/catch.
		 */
		return null;
	}
}

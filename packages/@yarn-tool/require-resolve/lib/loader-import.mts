import { pathToFileURL } from "url";
import { requireResolveCore } from "./core.js";
import { IOptionsRequireResolve } from "./types.js";

/**
 * 解析並動態導入模組
 * Resolve and dynamically import module
 *
 * 此函數使用 ES Module 動態導入語法載入模組，適用於非同步載入場景。
 * This function uses ES Module dynamic import syntax to load modules,
 * suitable for asynchronous loading scenarios.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 模組的 Promise / Promise of the module
 *
 * @example
 * ```typescript
 * // 非同步載入模組 / Asynchronously load module
 * const jest = await importExtra<typeof import('jest')>('jest');
 *
 * // 使用全域路徑載入 / Load with global paths
 * const ts = await importExtra('typescript', { includeGlobal: true });
 * ```
 */
export function importExtra<T = unknown>(name: string, options?: IOptionsRequireResolve): Promise<T>
{
	return import(pathToFileURL(requireResolveCore(name, options)).href);
}

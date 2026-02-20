import type { IErrorModuleNotFound } from './types';

/**
 * 檢查錯誤是否為模組未找到錯誤
 * Check if error is a module not found error
 *
 * 此函數用於判斷捕獲的錯誤是否為 MODULE_NOT_FOUND 類型，
 * 以便進行相應的錯誤處理邏輯。
 * This function determines if a caught error is of MODULE_NOT_FOUND type,
 * enabling appropriate error handling logic.
 *
 * @typeParam T - 錯誤類型 / Error type
 * @param error - 要檢查的錯誤 / Error to check
 * @returns 是否為 MODULE_NOT_FOUND 錯誤 / Whether it's a MODULE_NOT_FOUND error
 *
 * @example
 * ```typescript
 * try {
 *   require.resolve('non-existent-module');
 * } catch (error) {
 *   if (isErrorModuleNotFound(error)) {
 *     console.log('Module not found, using fallback');
 *   } else {
 *     throw error;
 *   }
 * }
 * ```
 */
export function isErrorModuleNotFound<T extends Error>(error: T): error is IErrorModuleNotFound<T>
{
	return (error as IErrorModuleNotFound<T>).code === 'MODULE_NOT_FOUND';
}

/**
 * 建立模組未找到錯誤物件
 * Create a module not found error object
 *
 * @param moduleName - 模組名稱 / Module name
 * @param basePath - 基礎搜尋路徑 / Base search path
 * @returns 模組未找到錯誤物件 / Module not found error object
 */
export function createModuleNotFoundError(moduleName: string, basePath?: string): IErrorModuleNotFound
{
	const error = new Error(`Cannot find module '${moduleName}'`) as IErrorModuleNotFound;
	error.code = 'MODULE_NOT_FOUND';
	error.requireStack = basePath ? [basePath] : [];
	return error;
}

export type {
	IErrorModuleNotFound,
}
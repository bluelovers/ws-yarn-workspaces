/**
 * Node.js 模組路徑工具函數
 * Node.js module path utility functions
 *
 * @author user
 * @created 2020/6/5
 */

import { join } from 'upath2';

/**
 * 取得 node_modules 目錄路徑
 * Get the node_modules directory path
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑，若未提供則使用預設值 'node_modules' / Custom node_modules directory path, defaults to 'node_modules' if not provided
 * @returns 完整的 node_modules 目錄路徑 / Complete node_modules directory path
 */
export function getModulesDir(cwd: string, dir?: string)
{
	/**
	 * 若未提供 dir 參數，則使用預設的 'node_modules'
	 * If dir parameter is not provided, use the default 'node_modules'
	 *
	 * 透過 upath2 的 join 取得路徑，會一併正規化為正斜線 '/',
	 * 與本套件其他回傳的路徑格式保持一致。
	 * Joining through upath2 normalizes the path to forward slashes '/',
	 * keeping it consistent with the paths returned elsewhere in this package.
	 */
	return join(cwd, dir ?? 'node_modules')
}

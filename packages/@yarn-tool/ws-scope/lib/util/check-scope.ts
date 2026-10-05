/**
 * @fileoverview Scope Path Validation Utility - 範圍路徑驗證工具
 * 
 * Provides validation functions to ensure workspace scope paths are valid
 * and safe (i.e., within the workspace root directory).
 * 提供驗證函式，確保工作區範圍路徑有效且安全（即位於工作區根目錄之內）。
 * 
 * @module @yarn-tool/ws-scope/util/check-scope
 */

import { basename, join, normalize, resolve, sep } from 'upath2';
import { pathInsideDirectory } from 'path-in-dir';

/**
 * Asserts that a scope path is valid and within the workspace root
 * 
 * @param {string} scope - The scope path to validate / 要驗證的範圍路徑
 * @param {string} __root - The workspace root directory / 工作區根目錄
 * @throws {Error} Throws if scope is empty or invalid / 若 scope 為空或無效則拋出錯誤
 * @throws {Error} Throws if resolved path is outside workspace root / 若解析後的路徑位於工作區根目錄之外則拋出錯誤
 * 
 * @description
 * Validates that:
 * 1. The scope path is not empty
 * 2. The resolved path is inside the workspace root directory
 * 
 * This prevents directory traversal attacks and ensures all workspace
 * paths are contained within the project.
 * 
 * @example
 * ```typescript
 * assertScopePath('packages/*', '/workspace/root'); // OK
 * assertScopePath('../outside', '/workspace/root'); // Throws Error
 * ```
 */
export function assertScopePath(scope: string, __root: string): asserts scope is string
{
	/**
	 * 先擋下空字串/undefined：resolve 對空字串會回傳根目錄本身，
	 * 若不先攔截，後續的路徑包含檢查會誤判為合法
	 * Reject empty string/undefined first: resolve() maps an empty string to the
	 * root itself, which would then wrongly pass the containment check below
	 */
	if (!scope?.length)
	{
		throw new Error(`Invalid scope: ${scope}`)
	}

	const __dir = resolve(__root, scope);

	/**
	 * 以解析後的絕對路徑判斷是否仍在根目錄內，可同時擋下 ../ 路徑穿越與絕對路徑逃逸
	 * Judge containment on the resolved absolute path so both ../ traversal
	 * and absolute-path escapes are blocked
	 */
	if (!pathInsideDirectory(__dir, __root))
	{
		throw new Error(`Invalid path: ${__dir}`)
	}
}


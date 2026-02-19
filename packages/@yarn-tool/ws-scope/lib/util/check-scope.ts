/**
 * @fileoverview Scope Path Validation Utility - 2.0
 * 
 * Provides validation functions to ensure workspace scope paths are valid
 * and safe (i.e., within the workspace root directory).
 * 
 * @module @yarn-tool/ws-scope/util/check-scope
 */

import { basename, join, normalize, resolve, sep } from 'upath2';
import { pathInsideDirectory } from 'path-in-dir';

/**
 * Asserts that a scope path is valid and within the workspace root
 * 
 * @param {string} scope - The scope path to validate / 2.0
 * @param {string} __root - The workspace root directory / 2.0
 * @throws {Error} Throws if scope is empty or invalid / 2.0
 * @throws {Error} Throws if resolved path is outside workspace root / 2.0
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
	if (!scope?.length)
	{
		throw new Error(`Invalid scope: ${scope}`)
	}

	const __dir = resolve(__root, scope);

	if (!pathInsideDirectory(__dir, __root))
	{
		throw new Error(`Invalid path: ${__dir}`)
	}
}


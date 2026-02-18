/**
 * Package Module Cache Path Finder Module
 *
 * This module provides functionality to find package's node_modules and its cache path,
 * suitable for finding cache location within a project.
 *
 * @module cache-path/lib/finder/findPkgModuleCachePath
 */

import { join } from "path";
import { findRoot } from '@yarn-tool/find-root';

/**
 * Find package root directory
 *
 * Uses @yarn-tool/find-root to find the project's root directory.
 *
 * @param {string} [cwd] - Starting directory for search
 * @returns {string} Package root directory path
 */
export function findPkgPath(cwd?: string): string
{
	return findRoot({
		cwd,
	}).root
}

/**
 * Core function to get node_modules path
 *
 * @param {string} root - Package root directory
 * @returns {string} node_modules directory path
 */
export function findPkgModulePathCore(root: string): string
{
	return join(root, 'node_modules');
}

/**
 * Core function to get package cache path
 *
 * @param {string} root - Package root directory
 * @returns {string} Cache directory path under node_modules
 */
export function findPkgModuleCachePathCore(root: string): string
{
	return join(findPkgModulePathCore(root), '.cache');
}

/**
 * Try to get pkg/node_modules path
 *
 * Finds the node_modules directory of the project where the current directory is located.
 *
 * @param {string} [cwd] - Starting directory for search
 * @returns {string} node_modules directory path
 *
 * @example
 * const modulesPath = findPkgModulePath();
 * console.log(modulesPath); // '/path/to/project/node_modules'
 */
export function findPkgModulePath(cwd?: string): string
{
	return findPkgModulePathCore(findPkgPath(cwd));
}

/**
 * Find package's node_modules/.cache directory path
 *
 * Finds the .cache directory under node_modules of the project where the current directory is located.
 *
 * @param {string} [cwd] - Starting directory for search / Starting directory for search
 * @returns {string} Cache directory path / Cache directory path
 *
 * @example
 * const cachePath = findPkgModuleCachePath();
 * console.log(cachePath); // '/path/to/project/node_modules/.cache'
 */
export function findPkgModuleCachePath(cwd?: string): string
{
	return findPkgModuleCachePathCore(findPkgPath(cwd));
}

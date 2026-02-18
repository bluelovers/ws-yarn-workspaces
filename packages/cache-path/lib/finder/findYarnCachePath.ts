/**
 * Yarn Fast Cache Path Finder Module
 *
 * This module provides functionality to find Yarn cache path,
 * by executing yarn config current command or checking environment variables.
 *
 * @module cache-path/lib/finder/findYarnCachePath
 */

import { join, normalize } from "upath2";
import { pathExistsSync } from 'fs-extra';
import { sync as crossSpawnExtra } from 'cross-spawn-extra';

/**
 * Try to get Yarn cache path
 *
 * This function first tries to execute `yarn config current --json` command to get Yarn's tempFolder,
 * if that fails, it checks the YARN_CACHE_FOLDER environment variable.
 *
 * @param {string} [cwd] - Working directory when executing command
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - Environment variables
 * @returns {string|undefined} Yarn cache directory path, or undefined if not found
 *
 * @example
 * const yarnCache = findYarnCachePath();
 * console.log(yarnCache); // e.g.: '/Users/user/Library/Caches/Yarn'
 */
export function findYarnCachePath(cwd?: string, processEnv = process.env): string
{
	try
	{
		// Execute yarn config current --json command
		let cp = crossSpawnExtra('yarn', [
			'config',
			'current',
			'--json',
		], {
			stripAnsi: true,    // Remove ANSI escape codes
			env: processEnv,    // Pass environment variables
			cwd,                // Set working directory
		});

		// Parse JSON output to get configuration data
		let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);

		// If tempFolder exists in configuration, return it
		if (data.tempFolder)
		{
			return normalize(data.tempFolder)
		}
	}
	catch (e)
	{
		// Ignore errors when yarn command fails
	}

	// If YARN_CACHE_FOLDER environment variable exists and path exists, return it
	if (processEnv.YARN_CACHE_FOLDER && pathExistsSync(processEnv.YARN_CACHE_FOLDER))
	{
		return normalize(processEnv.YARN_CACHE_FOLDER)
	}
}

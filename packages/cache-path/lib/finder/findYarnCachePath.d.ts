/**
 * Yarn Fast Cache Path Finder Module
 *
 * This module provides functionality to find Yarn cache path,
 * by executing yarn config current command or checking environment variables.
 *
 * @module cache-path/lib/finder/findYarnCachePath
 */
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
export declare function findYarnCachePath(cwd?: string, processEnv?: NodeJS.ProcessEnv): string;

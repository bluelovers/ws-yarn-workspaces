/**
 * OS Temp Path Finder Module
 *
 * This module provides functionality to get the operating system's temporary directory,
 * using Node.js's built-in os.tmpdir() function.
 *
 * @module cache-path/lib/finder/findOSTempPath
 */
/**
 * Get OS temporary directory
 *
 * Returns the operating system's default temporary directory path.
 *
 * Common paths for different operating systems:
 * - macOS: '/var/folders/...'
 * - Linux: '/tmp'
 * - Windows: 'C:\Users\USER\AppData\Local\Temp'
 *
 * @param {string} [cwd] - This parameter is not used, kept for interface consistency
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - This parameter is not used, kept for interface consistency
 * @returns {string} OS temporary directory path
 *
 * @example
 * const tempPath = findOSTempPath();
 * console.log(tempPath); // '/tmp' (Linux) or '/var/folders/...' (macOS)
 */
export declare function findOSTempPath(cwd?: string, processEnv?: NodeJS.ProcessEnv): string;

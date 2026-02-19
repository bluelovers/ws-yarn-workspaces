"use strict";
/**
 * Yarn Fast Cache Path Finder Module
 *
 * This module provides functionality to find Yarn cache path,
 * by executing yarn config current command or checking environment variables.
 *
 * @module cache-path/lib/finder/findYarnCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYarnCachePath = findYarnCachePath;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = require("cross-spawn-extra");
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
function findYarnCachePath(cwd, processEnv = process.env) {
    try {
        // Execute yarn config current --json command
        let cp = (0, cross_spawn_extra_1.sync)('yarn', [
            'config',
            'current',
            '--json',
        ], {
            stripAnsi: true, // Remove ANSI escape codes
            env: processEnv, // Pass environment variables
            cwd, // Set working directory
        });
        // Parse JSON output to get configuration data
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        // If tempFolder exists in configuration, return it
        if (data.tempFolder) {
            return (0, upath2_1.normalize)(data.tempFolder);
        }
    }
    catch (e) {
        // Ignore errors when yarn command fails
    }
    // If YARN_CACHE_FOLDER environment variable exists and path exists, return it
    if (processEnv.YARN_CACHE_FOLDER && (0, fs_extra_1.pathExistsSync)(processEnv.YARN_CACHE_FOLDER)) {
        return (0, upath2_1.normalize)(processEnv.YARN_CACHE_FOLDER);
    }
}
//# sourceMappingURL=findYarnCachePath.js.map
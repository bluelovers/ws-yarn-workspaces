"use strict";
/**
 * npm 快取路徑尋找模組
 * npm Cache Path Finder Module
 *
 * 此模組提供尋找 npm 全域快取路徑的功能，
 * This module provides functionality to find npm global cache path,
 * 透過執行 npm config get cache 命令取得。
 * by executing npm config get cache command.
 *
 * @module cache-path/lib/finder/findNpmCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNpmCachePath = findNpmCachePath;
const cross_spawn_extra_1 = require("cross-spawn-extra");
/**
 * 嘗試取得 npm 全域快取路徑
 * Try to get npm global cache path
 *
 * 此函數會執行 `npm config get cache` 命令來取得 npm 的快取目錄路徑。
 * This function executes `npm config get cache` command to get npm's cache directory path.
 *
 * @param {string} [cwd] - 執行命令時的工作目錄 / Working directory when executing command
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 環境變數 / Environment variables
 * @returns {string} npm 快取目錄路徑 / npm cache directory path
 *
 * @example
 * const npmCache = findNpmCachePath();
 * console.log(npmCache); // 例如: '/Users/user/.npm' / e.g.: '/Users/user/.npm'
 */
function findNpmCachePath(cwd, processEnv = process.env) {
    var _a, _b, _c;
    // 執行 npm config get cache 命令
    // Execute npm config get cache command
    let cache = (_c = (_b = (_a = (0, cross_spawn_extra_1.sync)('npm', [
        'config', 'get', 'cache',
    ], {
        // 移除 ANSI 跳脫碼 / Remove ANSI escape codes
        stripAnsi: true,
        // 傳入環境變數 / Pass environment variables
        env: processEnv,
        // 設定工作目錄 / Set working directory
        cwd,
    })) === null || _a === void 0 ? void 0 : _a.stdout) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
    return cache;
}
//# sourceMappingURL=findNpmCachePath.js.map
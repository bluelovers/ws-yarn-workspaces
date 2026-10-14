"use strict";
/**
 * npm 快取路徑尋找模組
 * npm Cache Path Finder Module
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
function findNpmCachePath(cwd, processEnv = process.env, options) {
    var _a, _b, _c;
    /**
     * 直接執行 npm 指令取得快取路徑，而非解析設定檔，
     * 因為 npm 的快取路徑可能被系統層級設定或環境變數覆寫，只有執行期可得
     * Run the npm command instead of parsing a config file,
     * because the cache path may be overridden by system-level config or env vars and is only resolvable at runtime
     *
     * 以安全鏈取值：npm 未安裝或指令失敗時回傳 undefined，
     * 交給上層 fnOrder 換下一個來源，而非直接拋錯
     * Safe chaining: when npm is missing or the command fails this yields undefined,
     * letting the upper fnOrder move on to the next source instead of throwing
     */
    let cache = (_c = (_b = (_a = (0, cross_spawn_extra_1.sync)('npm', [
        'config', 'get', 'cache',
    ], {
        /** 移除 ANSI 跳脫碼 / Remove ANSI escape codes */
        stripAnsi: true,
        /** 傳入環境變數 / Pass environment variables */
        env: processEnv,
        /** 設定工作目錄 / Set working directory */
        cwd,
    })) === null || _a === void 0 ? void 0 : _a.stdout) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
    return cache;
}
//# sourceMappingURL=findNpmCachePath.js.map
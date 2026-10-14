"use strict";
/**
 * Yarn 快取路徑尋找模組
 *
 * @module cache-path/lib/finder/findYarnCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYarnCachePath = findYarnCachePath;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = require("cross-spawn-extra");
/**
 * 嘗試取得 Yarn 快取路徑
 * Try to get Yarn cache path
 *
 * 此函數會先執行 `yarn config current --json` 取得 Yarn 的 tempFolder，
 * This function first tries to execute `yarn config current --json` to get Yarn's tempFolder,
 * 失敗時才改查 YARN_CACHE_FOLDER 環境變數。
 * and falls back to the YARN_CACHE_FOLDER environment variable only when that fails.
 *
 * @param {string} [cwd] - 執行指令時的工作目錄 / Working directory when executing command
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 環境變數 / Environment variables
 * @returns {string|undefined} Yarn 快取目錄路徑，找不到時回傳 undefined / Yarn cache directory path, or undefined if not found
 *
 * @example
 * const yarnCache = findYarnCachePath();
 * console.log(yarnCache); // 例如: '/Users/user/Library/Caches/Yarn' / e.g.: '/Users/user/Library/Caches/Yarn'
 */
function findYarnCachePath(cwd, processEnv = process.env, options) {
    /**
     * 指令查詢包在 try/catch 內：
     * Yarn 未安裝、版本不同或非 Yarn 專案都會失敗，
     * 此時必須靜默降級到環境變數分支
     * The command lookup is wrapped in try/catch:
     * Yarn may be missing, a different version, or the project may not use Yarn;
     * in those cases it must fall through silently to the env var branch
     */
    try {
        /**
         * 執行 yarn config current --json 指令
         * Execute the yarn config current --json command
         */
        let cp = (0, cross_spawn_extra_1.sync)('yarn', [
            'config',
            'current',
            '--json',
        ], {
            /** 移除 ANSI 跳脫碼 / Remove ANSI escape codes */
            stripAnsi: true,
            /** 傳入環境變數 / Pass environment variables */
            env: processEnv,
            /** 設定工作目錄 / Set working directory */
            cwd,
        });
        /**
         * 輸出是兩層 JSON（外層為 yarn 的 { data: "..." }），需解兩次
         * The output is doubly JSON-encoded (outer layer is yarn's { data: "..." }), so it is parsed twice
         */
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        /**
         * tempFolder 只在 Yarn 已設定過快取目錄時存在；
         * 缺少時不可自行推測，交由環境變數分支處理
         * tempFolder only exists once Yarn has a configured cache folder;
         * when absent it must not be guessed — the env var branch handles it
         */
        if (data.tempFolder) {
            return (0, upath2_1.normalize)(data.tempFolder);
        }
    }
    catch (e) {
        /**
         * yarn 指令失敗時刻意忽略，讓後續環境變數檢查接手
         * Yarn command failures are deliberately ignored so the following env var check can take over
         */
    }
    /**
     * YARN_CACHE_FOLDER 需同時存在於環境與磁碟上才算數，
     * 避免回傳一個不存在的路徑讓上層誤判可用
     * YARN_CACHE_FOLDER counts only when it exists both in the environment and on disk,
     * so a non-existent path is never returned and mistaken for a valid source
     */
    if (processEnv['YARN_CACHE_FOLDER'] && (0, fs_extra_1.pathExistsSync)(processEnv['YARN_CACHE_FOLDER'])) {
        return (0, upath2_1.normalize)(processEnv['YARN_CACHE_FOLDER']);
    }
}
//# sourceMappingURL=findYarnCachePath.js.map
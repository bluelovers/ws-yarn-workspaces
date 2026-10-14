"use strict";
/**
 * 環境變數快取路徑尋找模組
 * Environment Variable Cache Path Finder Module
 *
 * @module cache-path/lib/finder/findEnvCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.envCacheKeys = void 0;
exports.findEnvCachePath = findEnvCachePath;
const upath2_1 = require("upath2");
/**
 * 快取路徑環境變數的檢查順序（專用在前、通用在後）
 */
exports.envCacheKeys = [
    'CACHE_DIR_DEV',
    'TEMP_DEV',
    'CACHE_DIR',
];
/**
 * 嘗試從環境變數取得快取路徑
 *
 * 依 envCacheKeys 順序檢查，回傳第一個有設定的環境變數值；
 * 三者皆未設定時回傳 undefined，交給上層 fnOrder 換下一個來源。
 *
 * 這裡刻意不檢查路徑是否已存在：環境變數是呼叫端的明確意圖，
 * 與其默默改用其他來源，不如交給 _check 依 create 決定建立或明確報錯。
 *
 * @param {string} [cwd] - 此參數未使用，僅為介面一致性保留
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 環境變數
 * @param {IOptions} [options] - 此參數未使用，僅為介面一致性保留
 * @returns {string|undefined} 快取目錄路徑，三者皆未設定時為 undefined
 *
 * @example
 * const envCache = findEnvCachePath();
 * console.log(envCache); // 例如: '/path/from/CACHE_DIR_DEV' / e.g.: '/path/from/CACHE_DIR_DEV'
 */
function findEnvCachePath(cwd, processEnv = process.env, options) {
    var _a;
    for (const key of exports.envCacheKeys) {
        /**
         * trim() 後為空字串者視為未設定，
         * 避免 CACHE_DIR_DEV="" 這種空白設定搶走後面較通用的來源
         */
        const value = (_a = processEnv[key]) === null || _a === void 0 ? void 0 : _a.trim();
        if (value) {
            /**
             * 統一 normalize，讓各平台路徑寫法一致，也與其餘 finder 的回傳慣例相同
             */
            return (0, upath2_1.normalize)(value);
        }
    }
}
//# sourceMappingURL=findEnvCachePath.js.map
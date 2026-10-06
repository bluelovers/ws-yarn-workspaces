"use strict";
/**
 * 快取根目錄取得模組
 * Cache Root Directory Getter Module
 *
 * 此模組提供取得快取根目錄的同步和非同步函數，
 * This module provides synchronous and asynchronous functions to get cache root directory,
 * 會根據配置的順序嘗試多個可能的快取位置。
 * trying multiple possible cache locations based on configured order.
 *
 * @module cache-path/lib/getCacheRoot
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheRoot = getCacheRoot;
exports.getCacheRootAsync = getCacheRootAsync;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const is_writeable_path_1 = require("@lazy-node/is-writeable-path");
const util_1 = require("./util");
/**
 * 取得快取根目錄（同步版本）
 * Get cache root directory (synchronous version)
 *
 * 此函數會根據配置的 fnOrder 順序，依序嘗試各種快取位置，
 * This function tries various cache locations in order based on configured fnOrder,
 * 返回第一個可寫入的目錄路徑。
 * returning the first writable directory path.
 *
 * @param {IOptions | string} [_options] - 選項配置或 cwd 路徑 / Options configuration or cwd path
 * @returns {string} 快取根目錄的絕對路徑 / Absolute path to cache root directory
 * @throws {Error} 當找不到可用的快取目錄時 / When no available cache directory is found
 *
 * @example
 * const cacheRoot = getCacheRoot();
 * console.log(cacheRoot); // 例如: '/Users/user/.cache' / e.g.: '/Users/user/.cache'
 */
function getCacheRoot(_options) {
    /**
     * 處理選項參數（字串會被視為 cwd）
     * Process the options argument (a string is treated as cwd)
     */
    let options = (0, util_1.handleOptions)(_options);
    let { processEnv, cwd } = options;
    let dir;
    /**
     * 以 .some() 逐個嘗試：回傳 true 即停止，
     * 因此「第一個可寫入的來源」就是最終結果
     * Try each source with .some(): returning true stops the loop,
     * so "the first writable source" becomes the final result
     */
    options.fnOrder.some(function (fn) {
        /**
         * 呼叫位置函數取得候選目錄
         * Call location function to get candidate directory
         */
        // @ts-ignore
        dir = fn(cwd, processEnv);
        /**
         * 若目錄路徑有效（來源可能回傳 undefined）
         * If the directory path is valid (a source may return undefined)
         */
        if (dir === null || dir === void 0 ? void 0 : dir.length) {
            /**
             * 需要建立目錄時先嘗試建立；失敗被刻意忽略，
             * 因為可寫入性檢查會在下一步淘汰這個來源
             * When the directory may be created, try to create it first; failures are deliberately ignored,
             * because the writability check will discard this source on the next step
             */
            if ((0, util_1._createAble)(options, fn)) {
                try {
                    (0, fs_extra_1.ensureDirSync)(dir);
                }
                catch (err) { }
            }
            /**
             * 檢查目錄是否可寫入，可寫入才視為命中
             * Check whether the directory is writable; only then does it count as a match
             */
            return (0, is_writeable_path_1.isWritableDirectorySync)(dir);
        }
    });
    /**
     * 驗證最終結果：所有來源都失敗時會在此拋出明確錯誤
     * Validate the final result: throws a clear error when every source failed
     */
    (0, util_1._check)(dir, options);
    /**
     * 統一轉為絕對路徑後回傳
     * Return after normalizing to an absolute path
     */
    return (0, upath2_1.resolve)(dir);
}
/**
 * 取得快取根目錄（非同步版本）
 * Get cache root directory (asynchronous version)
 *
 * 此函數是非同步版本的 getCacheRoot，返回 Bluebird Promise。
 * This function is the asynchronous version of getCacheRoot, returning a Bluebird Promise.
 * 適用於需要非同步檔案操作的場景。
 * Suitable for scenarios requiring asynchronous file operations.
 *
 * @param {IOptions | string} [options] - 選項配置或 cwd 路徑 / Options configuration or cwd path
 * @returns {Bluebird<string>} 快取根目錄絕對路徑的 Promise / Promise of absolute path to cache root directory
 *
 * @example
 * const cacheRoot = await getCacheRootAsync();
 * console.log(cacheRoot); // 例如: '/Users/user/.cache' / e.g.: '/Users/user/.cache'
 */
function getCacheRootAsync(options) {
    return bluebird_1.default.resolve((0, util_1.handleOptions)(options))
        .then(async function (options) {
        let { processEnv, cwd } = options;
        let dir;
        /**
         * 依序嘗試各個快取位置函數，取得第一個可寫入者即中斷
         * Try each cache location function in order, stopping at the first writable one
         */
        for (let fn of options.fnOrder) {
            /**
             * 非同步呼叫位置函數取得候選目錄
             * Asynchronously call location function to get candidate directory
             */
            // @ts-ignore
            dir = await fn(cwd, processEnv);
            /**
             * 若目錄路徑有效（來源可能回傳 undefined）
             * If the directory path is valid (a source may return undefined)
             */
            if (dir === null || dir === void 0 ? void 0 : dir.length) {
                /**
                 * 需要建立目錄時非同步建立；失敗被刻意忽略，
                 * 因為可寫入性檢查會在下一步淘汰這個來源
                 * When the directory may be created, create it asynchronously; failures are deliberately ignored,
                 * because the writability check discards this source on the next step
                 */
                if ((0, util_1._createAble)(options, fn)) {
                    try {
                        await (0, fs_extra_1.ensureDir)(dir);
                    }
                    catch (err) { }
                }
                /**
                 * 檢查目錄是否可寫入，可寫入即中止搜尋；
                 * 不可寫入則繼續下一個來源
                 * Check writability and stop the search when writable;
                 * otherwise continue with the next source
                 */
                if (await (0, is_writeable_path_1.isWritableDirectoryAsync)(dir)) {
                    break;
                }
            }
        }
        /**
         * 驗證最終結果：所有來源都失敗時會在此拋出明確錯誤
         * Validate the final result: throws a clear error when every source failed
         */
        (0, util_1._check)(dir, options);
        /**
         * 統一轉為絕對路徑後回傳
         * Return after normalizing to an absolute path
         */
        return (0, upath2_1.resolve)(dir);
    });
}
//# sourceMappingURL=getCacheRoot.js.map
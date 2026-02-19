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
    // 處理選項參數
    // Process options parameter
    let options = (0, util_1.handleOptions)(_options);
    let { processEnv, cwd } = options;
    let dir;
    // 依序嘗試各個快取位置函數
    // Try each cache location function in order
    options.fnOrder.some(function (fn) {
        // @ts-ignore
        // 呼叫位置函數取得候選目錄
        // Call location function to get candidate directory
        dir = fn(cwd, processEnv);
        // 若目錄路徑有效
        // If directory path is valid
        if (dir === null || dir === void 0 ? void 0 : dir.length) {
            // 若需要建立目錄，嘗試建立
            // If need to create directory, try to create
            if ((0, util_1._createAble)(options, fn)) {
                try {
                    (0, fs_extra_1.ensureDirSync)(dir);
                }
                catch (err) { }
            }
            // 檢查目錄是否可寫入
            // Check if directory is writable
            return (0, is_writeable_path_1.isWritableDirectorySync)(dir);
        }
    });
    // 驗證最終結果
    // Validate final result
    (0, util_1._check)(dir, options);
    // 返回絕對路徑
    // Return absolute path
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
        // 依序嘗試各個快取位置函數
        // Try each cache location function in order
        for (let fn of options.fnOrder) {
            // @ts-ignore
            // 非同步呼叫位置函數取得候選目錄
            // Asynchronously call location function to get candidate directory
            dir = await fn(cwd, processEnv);
            // 若目錄路徑有效
            // If directory path is valid
            if (dir === null || dir === void 0 ? void 0 : dir.length) {
                // 若需要建立目錄，非同步嘗試建立
                // If need to create directory, asynchronously try to create
                if ((0, util_1._createAble)(options, fn)) {
                    try {
                        await (0, fs_extra_1.ensureDir)(dir);
                    }
                    catch (err) { }
                }
                // 檢查目錄是否可寫入，若可寫入則停止搜尋
                // Check if directory is writable, stop searching if writable
                if (await (0, is_writeable_path_1.isWritableDirectoryAsync)(dir)) {
                    break;
                }
            }
        }
        // 驗證最終結果
        // Validate final result
        (0, util_1._check)(dir, options);
        // 返回絕對路徑
        // Return absolute path
        return (0, upath2_1.resolve)(dir);
    });
}
//# sourceMappingURL=getCacheRoot.js.map
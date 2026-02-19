"use strict";
/**
 * 快取路徑取得模組
 * Cache Path Getter Module
 *
 * 此模組提供取得快取目錄路徑的同步和非同步函數，
 * This module provides synchronous and asynchronous functions to get cache directory paths,
 * 支援自訂名稱、雜湊和隨機目錄功能。
 * supporting custom names, hashing, and random directory features.
 *
 * @module cache-path/lib/getCachePath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBase = void 0;
exports.getCachePath = getCachePath;
exports.getCachePathAsync = getCachePathAsync;
const tslib_1 = require("tslib");
const getCacheRoot_1 = require("./getCacheRoot");
const normalizeName_1 = require("./normalizeName");
const upath2_1 = tslib_1.__importStar(require("upath2"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const tmp_1 = require("tmp");
/**
 * 快取根目錄下的預設基礎目錄名稱
 * Default base directory name at cache root
 */
exports.defaultBase = '.cache';
function getCachePath(_options, opt) {
    let options;
    // 處理字串參數形式的呼叫
    // Handle string parameter form of calling
    if (typeof _options === 'string') {
        options = {
            ...opt,
            name: _options,
        };
    }
    // 若無選項則使用空物件
    // Use empty object if no options
    options !== null && options !== void 0 ? options : (options = {});
    // 取得快取根目錄
    // Get cache root directory
    let root = (0, getCacheRoot_1.getCacheRoot)(options);
    // 取得基礎目錄名稱，預設為 '.cache'
    // Get base directory name, default is '.cache'
    let { base = exports.defaultBase } = options;
    let { name } = options;
    // 組合暫存目錄路徑
    // Compose temp directory path
    let tmpdir = (0, upath2_1.join)(root, base);
    //ensureDirSync(tmpdir);
    let dir;
    // 若有提供名稱，建立具名目錄
    // If name is provided, create named directory
    if (name === null || name === void 0 ? void 0 : name.length) {
        // 正規化名稱（可選擇雜湊）
        // Normalize name (optionally hash)
        name = (0, normalizeName_1.normalizeName)(name, options.hash);
        dir = (0, upath2_1.join)(tmpdir, name);
    }
    // 若無名稱且不要求隨機目錄，返回暫存目錄
    // If no name and random not required, return temp directory
    else if (!options.randomIfNoName) {
        dir = tmpdir;
    }
    // 若要求隨機目錄，使用 tmp 套件建立
    // If random directory is required, use tmp package to create
    else {
        name = void 0;
        dir = (0, tmp_1.dirSync)({
            ...options,
            tmpdir,
            //keep: true,
            name,
        }).name;
    }
    // 若要求建立目錄，確保目錄存在
    // If create is requested, ensure directory exists
    if (options.create) {
        (0, fs_extra_1.ensureDirSync)(dir);
    }
    // 若要求返回 thunk 函數
    // If thunk function is requested
    if (options.thunk) {
        // @ts-ignore
        // 建立 thunk 函數，可組合路徑
        // Create thunk function for path composition
        let fn = (...args) => upath2_1.default.join(dir, ...args);
        // @ts-ignore
        // 將目錄路徑附加到函數上
        // Attach directory path to function
        fn.dir = dir;
        return fn;
    }
    return dir;
}
function getCachePathAsync(options, opt) {
    return bluebird_1.default.resolve()
        .then(async function () {
        // 處理字串參數形式的呼叫
        // Handle string parameter form of calling
        if (typeof options === 'string') {
            options = {
                ...opt,
                name: options,
            };
        }
        // 若無選項則使用空物件
        // Use empty object if no options
        options !== null && options !== void 0 ? options : (options = {});
        // 非同步取得快取根目錄
        // Asynchronously get cache root directory
        let root = await (0, getCacheRoot_1.getCacheRootAsync)(options);
        // 取得基礎目錄名稱，預設為 '.cache'
        // Get base directory name, default is '.cache'
        let { base = exports.defaultBase } = options;
        let { name } = options;
        // 組合暫存目錄路徑
        // Compose temp directory path
        let tmpdir = (0, upath2_1.join)(root, base);
        let dir;
        // 若有提供名稱，建立具名目錄
        // If name is provided, create named directory
        if (name === null || name === void 0 ? void 0 : name.length) {
            // 正規化名稱（可選擇雜湊）
            // Normalize name (optionally hash)
            name = (0, normalizeName_1.normalizeName)(name, options.hash);
            dir = (0, upath2_1.join)(tmpdir, name);
        }
        // 若無名稱且不要求隨機目錄，返回暫存目錄
        // If no name and random not required, return temp directory
        else if (!options.randomIfNoName) {
            dir = tmpdir;
        }
        // 若要求隨機目錄，使用 tmp 套件非同步建立
        // If random directory is required, use tmp package to create asynchronously
        else {
            name = void 0;
            dir = await new bluebird_1.default((resolve, reject) => {
                (0, tmp_1.dir)({
                    ...options,
                    tmpdir,
                    //keep: true,
                    name,
                }, (err, ret) => {
                    // 處理錯誤
                    // Handle error
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(ret);
                    }
                });
            }).then(ret => {
                return ret;
            });
        }
        // 若要求建立目錄，非同步確保目錄存在
        // If create is requested, asynchronously ensure directory exists
        if (options.create) {
            await (0, fs_extra_1.ensureDir)(dir);
        }
        // 若要求返回 thunk 函數
        // If thunk function is requested
        if (options.thunk) {
            // @ts-ignore
            // 建立 thunk 函數，可組合路徑
            // Create thunk function for path composition
            let fn = (...args) => upath2_1.default.join(dir, ...args);
            // @ts-ignore
            // 將目錄路徑附加到函數上
            // Attach directory path to function
            fn.dir = dir;
            return fn;
        }
        return dir;
    });
}
//# sourceMappingURL=getCachePath.js.map
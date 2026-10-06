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
    /**
     * 同步版本支援 `getCachePath('name')` 的字串簡寫，
     * 字串須轉成 options 才能與其餘選項合併
     * The sync version supports the `getCachePath('name')` string shorthand;
     * the string must become options so it can merge with the rest
     */
    if (typeof _options === 'string') {
        options = {
            ...opt,
            name: _options,
        };
    }
    /**
     * 參數完全省略時退回空物件，讓後面的解構一律有值
     * When the argument is omitted entirely, fall back to an empty object so later destructuring always has a value
     */
    options !== null && options !== void 0 ? options : (options = {});
    /**
     * 取得快取根目錄（內部會依 fnOrder 嘗試各種來源）
     * Get the cache root directory (internally tries each source via fnOrder)
     */
    let root = (0, getCacheRoot_1.getCacheRoot)(options);
    let { base = exports.defaultBase } = options;
    let { name } = options;
    /**
     * 組合暫存目錄路徑：root/base，稍後再接上 name
     * Compose the temp directory path: root/base, with name appended later
     */
    let tmpdir = (0, upath2_1.join)(root, base);
    //ensureDirSync(tmpdir);
    let dir;
    /**
     * 有名稱時走具名子目錄：同一個快取根目錄可被多個套件共用，
     * 名稱（或其雜湊）就是彼此的區隔
     * With a name, use a named subdirectory: multiple packages may share one cache root,
     * and the name (or its hash) is what keeps them apart
     */
    if (name === null || name === void 0 ? void 0 : name.length) {
        /**
         * 正規化名稱（可選擇雜湊），避免無效字元破壞路徑
         * Normalize the name (optionally hashed) so invalid characters cannot break the path
         */
        name = (0, normalizeName_1.normalizeName)(name, options.hash);
        dir = (0, upath2_1.join)(tmpdir, name);
    }
    /**
     * 未指定名稱時直接回傳共用的 root/base；
     * 這正是 `find-cache-dir` 式的「專案快取目錄」行為
     * Without a name, return the shared root/base;
     * this is exactly the `find-cache-dir`-style "project cache directory" behavior
     */
    else if (!options.randomIfNoName) {
        dir = tmpdir;
    }
    /**
     * 需要彼此隔離的暫存目錄時交給 tmp 建立，
     * name 在此清空，讓 tmp 自行產生隨機名稱
     * When isolated temp directories are needed, tmp creates them;
     * name is cleared here so tmp generates its own random name
     */
    else {
        name = void 0;
        dir = (0, tmp_1.dirSync)({
            ...options,
            tmpdir,
            //keep: true,
            name,
        }).name;
    }
    /**
     * 要求 create 時立即建立，讓呼叫端拿到路徑即可寫入
     * When create is requested, build it now so callers can write as soon as they get the path
     */
    if (options.create) {
        (0, fs_extra_1.ensureDirSync)(dir);
    }
    /**
     * thunk 模式回傳函數而非字串，
     * 呼叫端可在事後自行組合子路徑而不必再查一次根目錄
     * In thunk mode a function is returned instead of a string,
     * so callers can compose subpaths later without re-resolving the root
     */
    if (options.thunk) {
        /**
         * 建立 thunk 函數，可組合路徑
         * Create thunk function for path composition
         */
        // @ts-ignore
        let fn = (...args) => upath2_1.default.join(dir, ...args);
        /**
         * 將目錄路徑附加到函數上
         * Attach directory path to function
         */
        // @ts-ignore
        fn.dir = dir;
        return fn;
    }
    return dir;
}
function getCachePathAsync(options, opt) {
    return bluebird_1.default.resolve()
        .then(async function () {
        /**
         * 與同步版本相同，支援字串簡寫形式
         * Same as the sync version: supports the string shorthand form
         */
        if (typeof options === 'string') {
            options = {
                ...opt,
                name: options,
            };
        }
        /**
         * 參數完全省略時退回空物件，讓後面的解構一律有值
         * When the argument is omitted entirely, fall back to an empty object so later destructuring always has a value
         */
        options !== null && options !== void 0 ? options : (options = {});
        /**
         * 非同步取得快取根目錄（來源函式可能需要執行指令）
         * Asynchronously get the cache root (source finders may need to run commands)
         */
        let root = await (0, getCacheRoot_1.getCacheRootAsync)(options);
        let { base = exports.defaultBase } = options;
        let { name } = options;
        /**
         * 組合暫存目錄路徑：root/base
         * Compose the temp directory path: root/base
         */
        let tmpdir = (0, upath2_1.join)(root, base);
        let dir;
        /**
         * 有名稱時走具名子目錄，與同步版本行為一致
         * With a name, use a named subdirectory — behavior matches the sync version
         */
        if (name === null || name === void 0 ? void 0 : name.length) {
            /**
             * 正規化名稱（可選擇雜湊）
             * Normalize the name (optionally hashed)
             */
            name = (0, normalizeName_1.normalizeName)(name, options.hash);
            dir = (0, upath2_1.join)(tmpdir, name);
        }
        /**
         * 未指定名稱時回傳共用的 root/base
         * Without a name, return the shared root/base
         */
        else if (!options.randomIfNoName) {
            dir = tmpdir;
        }
        /**
         * 隨機目錄改用 tmp 的非同步 API，
         * 避免同步阻塞事件迴圈（這是與同步版本的主要差異）
         * Random directories use tmp's async API instead,
         * so the event loop is not blocked — the main difference from the sync version
         */
        else {
            name = void 0;
            dir = await new bluebird_1.default((resolve, reject) => {
                (0, tmp_1.dir)({
                    ...options,
                    tmpdir,
                    //keep: true,
                    name,
                }, (err, ret) => {
                    /**
                     * tmp 以 callback 回報錯誤，這裡轉成 Promise 的拒絕，
                     * 讓呼叫端能以 try/catch 或 .catch() 統一處理
                     * tmp reports errors via callback; convert to a Promise rejection
                     * so callers can handle them uniformly with try/catch or .catch()
                     */
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
        /**
         * 要求 create 時非同步建立目錄
         * When create is requested, create the directory asynchronously
         */
        if (options.create) {
            await (0, fs_extra_1.ensureDir)(dir);
        }
        /**
         * thunk 模式回傳函數而非字串，行為與同步版本一致
         * Thunk mode returns a function instead of a string; behavior matches the sync version
         */
        if (options.thunk) {
            /**
             * 建立 thunk 函數，可組合路徑
             * Create thunk function for path composition
             */
            // @ts-ignore
            let fn = (...args) => upath2_1.default.join(dir, ...args);
            /**
             * 將目錄路徑附加到函數上
             * Attach directory path to function
             */
            // @ts-ignore
            fn.dir = dir;
            return fn;
        }
        return dir;
    });
}
//# sourceMappingURL=getCachePath.js.map
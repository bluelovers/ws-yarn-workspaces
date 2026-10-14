"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCache = initCache;
exports.getCache = getCache;
const tslib_1 = require("tslib");
const lru_cache_fs2_1 = tslib_1.__importDefault(require("lru-cache-fs2"));
const cache_path_1 = require("cache-path");
const finder_1 = require("cache-path/lib/finder");
/**
 * 模組層級的快取單例 (Module-level Cache Singleton)；
 * 以 `??=` 延後初始化，確保只有第一次 getCache() 才會建立快取並產生磁碟 IO。
 *
 * Module-level cache singleton, initialised lazily with `??=` so the cache
 * (and its disk IO) is only created on the first getCache() call.
 */
let cache;
/**
 * 建立檔案後盾的 LRU 快取 (File-backed LRU Cache) 實例。
 *
 * Creates the file-backed LRU cache instance.
 *
 * @param options 查詢選項，僅取用其中的 cacheAgentOptions / Query options; only cacheAgentOptions is used
 * @returns 新的快取實例 / A fresh cache instance
 */
function initCache(options) {
    let id = '@yarn-tool/pkg-version-query';
    /**
     * 快取目錄依序偏好 yarn 快取、npm 快取、系統暫存目錄，最後才退回 node_modules；
     * 這樣可與套件管理器共用既有快取位置，也避免在唯讀的 node_modules 下寫檔。
     *
     * The cache dir prefers the yarn cache, then npm cache, then OS temp, and only
     * falls back to node_modules; this reuses package-manager cache locations and
     * avoids writing into a potentially read-only node_modules.
     */
    let cwd = (0, cache_path_1.getCachePath)(id, {
        fnOrder: finder_1.defaultOrderGlobal,
    });
    let { cacheAgentOptions } = (options !== null && options !== void 0 ? options : (options = {}));
    /**
     * 使用展開運算子合併：呼叫端的設定優先，但 cacheName / autoCreate / cwd
     * 由本函式決定，避免使用者誤覆寫成指向別的快取檔。
     *
     * Spread-merge keeps caller settings first while cacheName / autoCreate / cwd stay
     * under this function's control, so callers cannot accidentally point at another cache file.
     */
    cacheAgentOptions = {
        //		max: 1000,
        //		maxAge: 5 * 60 * 1000,
        ...cacheAgentOptions,
        cacheName: (0, cache_path_1.normalizeName)(id, true),
        autoCreate: true,
        cwd,
    };
    /**
     * 下限保護：max 太小（或未設定）會使快取幾乎無效、每次查詢都打 registry，
     * 因此強制提升到 1000。
     *
     * Floor guard: a tiny or unset max would make the cache useless and hammer the
     * registry on every query, so it is raised to 1000.
     */
    if (!cacheAgentOptions.max || cacheAgentOptions.max <= 100) {
        cacheAgentOptions.max = 1000;
    }
    /**
     * 下限保護：maxAge 太短（或未設定）會讓版本資料幾乎立刻過期，
     * 因此強制至少保留 10 分鐘。
     *
     * Floor guard: a too-short or unset maxAge would expire version data almost
     * immediately, so it is kept at 10 minutes at minimum.
     */
    if (!cacheAgentOptions.maxAge || cacheAgentOptions.maxAge <= 60 * 1000) {
        cacheAgentOptions.maxAge = 10 * 60 * 1000;
    }
    const cache = new lru_cache_fs2_1.default(cacheAgentOptions);
    return cache;
}
/**
 * 取得快取實例：優先使用呼叫端自帶的 cacheAgent，
 * 否則以 `??=` 惰性建立並重複使用同一個單例，
 * 讓多處查詢共享同一份磁碟快取而不必各自初始化。
 *
 * Returns the cache instance: a caller-supplied cacheAgent wins, otherwise a
 * module-level singleton is created lazily via `??=` so scattered queries share
 * one disk-backed cache instead of each initialising their own.
 *
 * @param options 查詢選項，可攜帶 cacheAgent / Query options; may carry a custom cacheAgent
 * @returns 快取實例 / The cache instance
 */
function getCache(options) {
    var _a;
    return (_a = options === null || options === void 0 ? void 0 : options.cacheAgent) !== null && _a !== void 0 ? _a : (cache !== null && cache !== void 0 ? cache : (cache = initCache(options)));
}
//# sourceMappingURL=cacheAgent.js.map
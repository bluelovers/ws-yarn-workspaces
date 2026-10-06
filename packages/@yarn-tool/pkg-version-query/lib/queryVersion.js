"use strict";
/**
 * Query package versions with cache support.
 * 查詢套件版本並支援快取機制。
 *
 * @module queryVersion
 *
 * 主要功能：
 * - 從 npm registry 查詢套件版本
 * - 支援 LRU 快取，減少重複查詢
 * - 處理版本範圍語法 (如 ^, ~, npm: 協議)
 * - 錯誤處理與快取錯誤結果
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionWithCache = queryVersionWithCache;
exports.queryVersion = queryVersion;
const tslib_1 = require("tslib");
const package_json_1 = require("package-json");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cacheAgent_1 = require("./cacheAgent");
const createCacheKey_1 = require("./createCacheKey");
const core_1 = require("./core");
const queryVersionCacheRaw_1 = require("./queryVersionCacheRaw");
const handleAmpersandAndSpaces_1 = require("@lazy-node/semver-ampersand/lib/handleAmpersandAndSpaces");
const const_1 = require("@lazy-node/semver-ampersand/lib/const");
/**
 * Query package version with LRU cache.
 * 使用 LRU 快取查詢套件版本。
 *
 * @param name - Package name / 套件名稱
 * @param targetVersion - Target version or range (default: 'latest') / 目標版本或範圍
 * @param options - Query options / 查詢選項
 * @returns Promise resolving to version string / 回傳版本字串的 Promise
 *
 * @example
 * ```ts
 * const version = await queryVersionWithCache('lodash');
 * // => '4.17.21'
 *
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * // => '4.9.5'
 * ```
 */
function queryVersionWithCache(name, targetVersion = 'latest', options) {
    return bluebird_1.default.resolve((0, queryVersionCacheRaw_1.queryVersionCacheRaw)(name, targetVersion, options))
        .then(data => {
        var _a;
        /**
         * 快取存有先前的失敗紀錄時直接重拋：
         * 同一組 name/version 短時間內重試通常仍會失敗，
         * 再打一次 registry 只是白白拖慢流程。
         *
         * A cached failure is rethrown immediately: retrying the same name/version
         * right away would almost certainly fail again, so another registry call
         * would only slow things down.
         */
        if (data === null || data === void 0 ? void 0 : data.error) {
            return Promise.reject(data.error);
        }
        /**
         * 快取命中成功結果時直接回傳，略過網路請求。
         *
         * A cached success is returned as-is, skipping the network request.
         */
        else if (data === null || data === void 0 ? void 0 : data.result) {
            return data.result;
        }
        /**
         * 未命中（或快取列只有 version 欄位）時才真的發起查詢。
         *
         * Only a real query happens on a miss (or when the entry only carries `version`).
         */
        return queryVersion(name, (_a = data === null || data === void 0 ? void 0 : data.version) !== null && _a !== void 0 ? _a : targetVersion, true, options)
            .catch(e => {
            /**
             * 查詢失敗時的後備 (Fallback)：若快取中已有成功結果則改採快取值，
             * 只有完全沒有可用結果時才把錯誤拋回給呼叫端。
             *
             * Fallback on failure: prefer an already-cached success when one exists,
             * and only rethrow to the caller when no usable result is available.
             */
            if (data === null || data === void 0 ? void 0 : data.result) {
                return data.result;
            }
            return Promise.reject(e);
        });
    });
}
/**
 * 查詢版本的核心流程：registry 查詢 → 失敗時正規化版本重試 → 結果回寫快取。
 *
 * Core query flow: registry lookup → normalise the version and retry on failure →
 * write the outcome back to the cache.
 *
 * @param name 套件名稱 / Package name
 * @param targetVersion 目標版本或範圍，預設 latest / Target version or range, defaults to latest
 * @param save 是否將結果寫回快取；正規化後的遞迴重試傳 false / Whether to write the outcome back to the cache; pass false for the normalised retry
 * @param options 查詢與快取選項 / Query and cache options
 * @returns 解析出的版本字串 / The resolved version string
 */
function queryVersion(name, targetVersion = 'latest', save = true, options) {
    /**
     * ??= 補齊預設版本；快取鍵以補齊後的版本建立，
     * 讓「省略 targetVersion」與「顯式傳入 'latest'」共用同一筆快取。
     *
     * ??= fills in the default; the cache key is built from the normalised version so
     * "omit targetVersion" and an explicit 'latest' share the same cache entry.
     */
    let version = targetVersion !== null && targetVersion !== void 0 ? targetVersion : (targetVersion = 'latest');
    let key = (0, createCacheKey_1._createCacheKey)(name, targetVersion);
    return (0, core_1._queryVersion)(name, {
        version,
    })
        .then((result) => {
        return result.version;
    })
        .catch(package_json_1.VersionNotFoundError, async (e) => {
        /**
         * bool 表示「版本是否已被正規化」；
         * 只有真的改寫過才值得用新版本重試一次。
         *
         * `bool` tracks whether the version was actually normalised;
         * only a rewritten version is worth one retry.
         */
        let bool = true;
        /**
         * npm: 別名協定 (Alias Protocol) 的字串 registry 無法直接解析，
         * 剝掉前綴後以剩餘規格重試（例如 `npm:foo@1.0.0` → `foo@1.0.0`）。
         *
         * The npm: alias protocol is not parseable by the registry as-is,
         * so the prefix is stripped and the remainder retried.
         */
        if (version.startsWith('npm:')) {
            version = version.replace(/^npm:/, '');
            bool = false;
        }
        /**
         * 版本範圍中的 `&` 與空白（常見於套件管理器產生的範圍）需先正規化，
         * 否則 registry 端的 semver 解析會失敗。
         *
         * `&` and whitespace inside a range (common in package-manager output)
         * must be normalised first, otherwise semver parsing fails upstream.
         */
        if (const_1.reAmpersandAndSpaces.test(version)) {
            version = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(version);
            bool = false;
        }
        /**
         * 兩種正規化都沒套用時，重試只會得到相同的錯誤；
         * 直接重拋原錯誤，避免以相同輸入無限遞迴。
         *
         * When neither normalisation applied, a retry would hit the same error;
         * rethrow immediately to avoid infinite recursion on identical input.
         */
        if (bool) {
            return Promise.reject(e);
        }
        /**
         * 以正規化後的版本重試；save=false 是為了避免遞迴呼叫重複寫入快取，
         * 外層的 tap / tapCatch 仍會以原始 key 記錄最終結果。
         *
         * Retry with the normalised version; save=false prevents the recursive call
         * from double-writing the cache — the outer tap / tapCatch still records
         * the final outcome under the original key.
         */
        return queryVersion(name, version, false, options);
    })
        .tapCatch(package_json_1.VersionNotFoundError, package_json_1.PackageNotFoundError, (error) => {
        /**
         * 負面快取 (Negative Cache)：把「版本/套件不存在」也記下來，
         * 避免每次呼叫都重複打 registry 查詢一個確定失敗的目標。
         *
         * Negative cache: remember "version/package not found" so repeated calls
         * do not re-query a target that is known to fail.
         */
        save && (0, cacheAgent_1.getCache)(options).set(key, {
            key,
            name,
            version,
            error,
        });
    })
        .tap(result => {
        /**
         * 成功結果寫回快取，供後續查詢直接命中。
         *
         * Write the successful result back so later lookups hit the cache.
         */
        save && (0, cacheAgent_1.getCache)(options).set(key, {
            key,
            name,
            version,
            result,
        });
    });
}
exports.default = queryVersionWithCache;
//# sourceMappingURL=queryVersion.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRemoteVersions = queryRemoteVersions;
const tslib_1 = require("tslib");
const types_1 = require("../types");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const options_1 = require("../options");
const store_1 = require("../store");
const util_1 = require("../util");
const semver_1 = tslib_1.__importDefault(require("semver"));
const remote_1 = require("../remote");
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
/**
 * 批次查詢遠端版本（帶快取與多重回退） (Batch remote version query with cache and fallbacks)
 *
 * 流程：正規化選項 → 解析版本策略 → 逐筆查快取 → 未命中的交給 ncu 查詢
 * → 針對 `~` 範圍、特殊關鍵字等情況多重回退 → 全部寫回版本快取。
 * Flow: normalise options → resolve strategy → check the cache entry by entry →
 * let ncu query the misses → multiple fallbacks for `~` ranges and strategy
 * keywords → write everything back to the version cache.
 *
 * 邊界情況：
 * - 已在快取中的項目直接跳過，因此同一 process 內重複呼叫不會重複請求
 * - `versionTarget` 為 minor 時會把舊版本改寫成 `x.0.0`，使「同次版本內最新」
 *   的語意成立，改寫後的值也會一併寫入快取
 * Edge cases:
 * - already cached entries are skipped, so repeated calls inside one process do
 *   not re-request the registry
 * - with a `minor` target the old version is rewritten to `x.0.0` so "latest within
 *   this minor" makes sense; the rewritten value is cached too
 *
 * @param packageMap - 套件對應表，或只要套件名稱的陣列 / Package map, or a plain list of names
 * @param options - ncu 選項 / ncu options
 * @returns 每個套件的快取值（含更新前後版本） / Cache values (old and new version) per package
 */
function queryRemoteVersions(packageMap, options = {}) {
    return bluebird_1.default.resolve()
        .then(async function () {
        options = (0, options_1.npmCheckUpdatesOptions)(options);
        //console.dir(options);
        /**
         * 此函式只回傳結果，表格輸出交給呼叫端決定，因此強制靜默
         * This function only returns data; the caller decides about output, so
         * silence the underlying tool
         */
        options.loglevel = 'silent';
        /**
         * 沒有指定策略時一律以 latest 為準，確保結果可預測
         * Fall back to latest when no strategy is given, keeping results predictable
         */
        let versionTarget = options.versionTarget = (0, remote_1.getVersionTarget)(options) || types_1.EnumVersionValue.latest;
        /**
         * 只給套件名稱時，把每個套件都視為「目標策略本身」，讓後續流程可以共用
         * When only names are given, treat each package as targeting the strategy
         * itself so the rest of the flow can be shared
         */
        if (Array.isArray(packageMap)) {
            packageMap = packageMap.reduce(function (a, b) {
                a[b] = versionTarget;
                return a;
            }, {});
        }
        let packageMapArray = (0, remote_1.packageMapToKeyObject)(packageMap, versionTarget);
        /**
         * 過濾出「還需要查詢」的項目：
         * - 已在快取中的直接排除（主要去重點）
         * - minor 策略搭配特殊關鍵字（如 `^`、`*`）時，先取得 latest 再把舊版本
         *   改寫成 `x.0.0` 並寫入快取，此筆資料同時被視為已完成查詢
         * Filter out entries that still need a query:
         * - anything already cached is dropped (the main dedupe point)
         * - with the minor strategy and a keyword such as `^` / `*`, resolve latest
         *   first, rewrite the old version to `x.0.0` and cache it; such an entry
         *   counts as already queried
         */
        let packageMapArrayFilted = await bluebird_1.default.resolve(packageMapArray)
            .filter(async (d) => {
            let bool = !(0, store_1.hasQueryedVersionCache)(d);
            if (bool && (0, util_1.isBadVersion)(d.version_old)) {
                if (versionTarget === types_1.EnumVersionValue.minor) {
                    let version_new = await (0, remote_1.queryPackageManagersNpm)(d.name);
                    d.version_old = version_new.split('.')[0] + '.0.0';
                    (0, store_1.setVersionCacheMap)({
                        ...d,
                        version_new,
                    });
                    bool = false;
                }
            }
            return bool;
        });
        let packageMap2 = (0, util_1.keyObjectToPackageMap)(packageMapArrayFilted);
        return bluebird_1.default
            .resolve((0, versionmanager_1.queryVersions)(packageMap2, options))
            .tap(ret => {
            /**
             * 逐一補齊 ncu 查不到的版本，並把結果寫入快取
             * Fill in the versions ncu could not resolve, then persist the results
             */
            return bluebird_1.default.resolve(Object.entries(packageMap2))
                .each(async ([name, version_old]) => {
                let version_new = ret[name];
                /**
                 * `~` 約束：除非允許跳出範圍（noSafe），否則改查「仍符合目前範圍」
                 * 的最高版本；`.pop()` 取排序後的最後一筆即為最高版本。
                 * `~` ranges: unless the range may be left (noSafe), query the highest
                 * version still satisfying the current range instead; `.pop()` takes the
                 * last (highest) of the sorted results.
                 */
                if (version_old.includes('~')) {
                    if (!options.noSafe || version_new == null) {
                        version_new = await (0, remote_1.fetchVersion)(name, {
                            filter(version) {
                                return semver_1.default.satisfies(version, version_old);
                            },
                        }, options)
                            .then(ret => ret.pop());
                    }
                }
                /**
                 * 回退一：版本是策略關鍵字（無法直接比較），改用策略解析
                 * Fallback 1: the version is a strategy keyword (not comparable), so
                 * resolve it with the strategy
                 */
                if (version_new == null && (0, util_1.isBadVersion)(version_old)) {
                    version_new = await (0, remote_1.queryPackageManagersNpm)(name, null, versionTarget);
                }
                /**
                 * 回退二：仍查不到時，以目前版本為基準向套件管理器查詢
                 * Fallback 2: still nothing, ask the package manager using the current
                 * version as the baseline
                 */
                if (version_new == null) {
                    version_new = await (0, remote_1.queryPackageManagersNpm)(name, version_old, versionTarget);
                }
                (0, store_1.setVersionCacheMap)({
                    name,
                    versionTarget,
                    version_old,
                    version_new,
                });
            });
        })
            .then(() => {
            /**
             * 依原始鍵序回傳快取值，順序與輸入一致便於呼叫端對照
             * Return cache values in the original key order; matching the input order
             * makes it easy for callers to line results up
             */
            return packageMapArray
                .map(data => store_1.versionCacheMap.get((0, store_1.strVersionCache)(data)));
        });
    });
}
//# sourceMappingURL=queryRemoteVersions.js.map
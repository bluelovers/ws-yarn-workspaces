"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionTarget = exports.queryRemoteVersions = void 0;
exports.requestVersion = requestVersion;
exports.fetchVersion = fetchVersion;
exports.queryPackageManagersNpm = queryPackageManagersNpm;
exports.packageMapToKeyObject = packageMapToKeyObject;
exports.isUpgradeable = isUpgradeable;
exports.updateSemver = updateSemver;
const tslib_1 = require("tslib");
/**
 * 遠端套件版本查詢 (Remote package version queries)
 * 說明：這裡把 npm registry 的中繼資料查詢、`npm-check-updates` 的套件管理器
 * 呼叫，以及 semver 升級判斷包成一組可重用的函式；查詢結果會寫入
 * {@link remoteCacheMap} / 版本快取，避免重複請求。
 * Why: it wraps registry metadata queries, `npm-check-updates` package-manager
 * calls and semver upgrade decisions into reusable functions; results are stored
 * in {@link remoteCacheMap} / the version cache to avoid repeat requests.
 *
 * @module remote
 */
const types_1 = require("./types");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const store_1 = require("./store");
const package_json_1 = tslib_1.__importDefault(require("package-json"));
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
const npm_1 = tslib_1.__importDefault(require("npm-check-updates/lib/package-managers/npm"));
const getVersionTarget_1 = require("./remote/getVersionTarget");
Object.defineProperty(exports, "getVersionTarget", { enumerable: true, get: function () { return getVersionTarget_1.getVersionTarget; } });
/**
 * 重新匯出批次查詢入口 (Re-export the batch query entry point)
 * 放在這裡是為了讓呼叫端只要 import `lib/remote` 就能取得完整的查詢能力。
 * Re-exported here so a single import of `lib/remote` covers the whole query surface.
 */
var queryRemoteVersions_1 = require("./remote/queryRemoteVersions");
Object.defineProperty(exports, "queryRemoteVersions", { enumerable: true, get: function () { return queryRemoteVersions_1.queryRemoteVersions; } });
/**
 * 取得套件的完整中繼資料（帶快取）
 * 先查 {@link remoteCacheMap}，命中就直接回傳；未命中才呼叫 `package-json`，
 * 並在 `.tap()` 中寫回快取（即使呼叫端不處理結果也會先快取起來）。
 * Reads {@link remoteCacheMap} first and only falls back to `package-json` on a
 * miss; the result is written back inside `.tap()` so it is cached even if the
 * caller ignores the value.
 *
 * @param packageName - 套件名稱 / Package name
 */
function requestVersion(packageName) {
    return bluebird_1.default
        .resolve(store_1.remoteCacheMap.get(packageName))
        .then(function (result) {
        if (result == null) {
            return (0, package_json_1.default)(packageName, { allVersions: true });
        }
        return result;
    })
        .tap(function (result) {
        return store_1.remoteCacheMap.set(packageName, result);
    });
}
/**
 * 讀取指定欄位的版本資訊
 * 依 `field` 決定回傳內容：`dist-tags.x` 回傳該 dist-tag、`versions` 回傳版本陣列、
 * 其他欄位（如 `time`）原樣回傳；最後套用 `options.filter` 過濾。
 * Reads a metadata field: `dist-tags.x` yields that tag, `versions` yields the
 * version list, any other field (e.g. `time`) is returned as-is; `options.filter`
 * is applied last.
 *
 * 邊界情況：`field` 為空字串時不會進入任何分支，回傳 `undefined`；
 * 此時若又提供 `filter` 會在 `.filter()` 處擲出錯誤，因此 `field` 應保持非空。
 * Edge case: an empty `field` matches no branch and yields `undefined`; combining
 * it with `filter` would throw inside `.filter()`, so keep `field` non-empty.
 *
 * @param packageName - 套件名稱 / Package name
 * @param options - 欄位與過濾選項 / Field and filter options
 * @param ncuOptions - ncu 選項（保留給未來的 registry 設定使用） / ncu options, kept for future registry settings
 */
function fetchVersion(packageName, options = {}, ncuOptions) {
    let { field = 'versions' } = options;
    return requestVersion(packageName)
        //.resolve(packageJson(packageName, { allVersions: true }))
        .then(function (result) {
        if (field.startsWith('dist-tags.')) {
            const split = field.split('.');
            if (result[split[0]]) {
                return result[split[0]][split[1]];
            }
        }
        else if (field === 'versions') {
            return Object.keys(result[field]);
        }
        else if (field) {
            return result[field];
        }
    })
        .then(result => {
        if (options.filter) {
            return result.filter(options.filter);
        }
        //console.dir(result);
        return result;
    });
}
/**
 * 以 `npm-check-updates` 的套件管理器查詢最新版本
 * 選項處理說明：
 * - `version` 為 null 時補成 `'0'`，因為 ncu 的方法要求必填版本
 * - 當目標是 major / minor 卻沒有可比較的舊版本時，改用 `latest`
 *   （沒有舊版本就無法判斷「同主版本內的最高版本」）
 * - 回傳 null（例如 registry 查無 dist-tag）時，改從 `package-json` 的
 *   `dist-tags` 直接取值作為後備
 * Option handling:
 * - a null `version` is coerced to `'0'` because ncu's methods require a version
 * - with a major/minor target but no comparable old version, `latest` is used
 *   (without an old version there is no way to pick the highest within that major)
 * - when it returns null (e.g. no dist-tag on the registry), the value is
 *   recovered from `package-json`'s `dist-tags` as a fallback
 *
 * @param name - 套件名稱 / Package name
 * @param version - 目前版本，可為 null / Current version, may be null
 * @param versionTarget - 版本解析策略 / Version resolution strategy
 */
function queryPackageManagersNpm(name, version = '0', versionTarget = types_1.EnumVersionValue.latest) {
    let method = types_1.EnumPackageManagersNpmMethod[versionTarget];
    /**
     * 沒有舊版本可比較時：一律以 '0' 當作起點查詢
     * When there is no old version to compare against: always query from '0'
     */
    if (version == null) {
        version = '0';
        /**
         * major / minor 策略需要舊版本才有意義，此處退回 latest 以免回傳不合理的結果
         * major / minor strategies need an old version to be meaningful, so fall back
         * to latest instead of returning a nonsensical result
         */
        switch (versionTarget) {
            case types_1.EnumVersionValue.latest:
            case types_1.EnumVersionValue.greatest:
            case types_1.EnumVersionValue.newest:
                break;
            case types_1.EnumVersionValue.major:
            case types_1.EnumVersionValue.minor:
                method = types_1.EnumPackageManagersNpmMethod.latest;
                break;
        }
    }
    return bluebird_1.default
        .resolve(npm_1.default[method](name, version, {}))
        .then(async (value) => {
        /**
         * 後備：套件管理器查無結果時，改用 package-json 的 dist-tags 直接解析
         * Fallback: when the package manager yields nothing, resolve straight from
         * package-json's dist-tags instead
         */
        if (value == null) {
            let r = await requestVersion(name);
            /**
             * 舊版本剛好也是 dist-tag 名稱（例如 latest）時才能這樣取值
             * Only valid when the old version doubles as a dist-tag name (e.g. latest)
             */
            if (version in r['dist-tags']) {
                return r['dist-tags'][version];
            }
        }
        return value;
    });
}
/**
 * 把「套件名稱 → 版本」轉成快取鍵陣列
 * 這是快取流程的入口：先建立鍵，才能用 {@link hasQueryedVersionCache} 判斷
 * 哪些套件還需要查詢。
 * Turns a name→version map into cache keys, which is the entry of the cache flow:
 * only with keys can {@link hasQueryedVersionCache} tell which packages still
 * need a query.
 *
 * @param packageMap - 套件對應表 / The package map
 * @param versionTarget - 版本解析策略，會寫進每一個鍵 / Version strategy stored in every key
 */
function packageMapToKeyObject(packageMap, versionTarget) {
    return Object
        .entries(packageMap)
        /**
         * 每個套件都轉成結構相同的快取鍵，忽略其餘欄位以保持鍵的穩定
         * Each package becomes a structurally identical cache key; other fields are
         * ignored so the key stays stable
         */
        .map(([name, version_old]) => {
        return (0, store_1.objVersionCache)({
            name, version_old, versionTarget,
        });
    });
}
/**
 * 判斷是否可以升級 (Delegate of ncu's `isUpgradeable`)
 * 直接轉呼叫 `npm-check-updates` 的實作，確保判斷規則與底層工具完全一致。
 * Delegates to `npm-check-updates` so the decision logic stays identical to the
 * underlying tool.
 *
 * @param current - 目前版本 / Current version
 * @param latest - 查到的最新版本 / Newly resolved latest version
 */
function isUpgradeable(current, latest) {
    return (0, versionmanager_1.isUpgradeable)(current, latest);
}
/**
 * 依版本範圍規則產生升級後的宣告 (Produce the upgraded declaration)
 * 例如 `^1.2.0` 升級到 `2.0.0` 時，是否保留 `^` 由 semver 規則與 `options` 決定，
 * 此處同樣轉呼叫 ncu 的實作以避免行為分歧。
 * Whether a prefix such as `^` survives an upgrade (e.g. `^1.2.0` → `2.0.0`) is
 * decided by semver rules and `options`; again this delegates to ncu to avoid any
 * behavioural drift.
 *
 * @param current - 目前版本宣告 / Current version declaration
 * @param latest - 最新版本 / Latest version
 * @param options - 影響範圍寫法的選項 / Options affecting how the range is written
 */
function updateSemver(current, latest, options = {}) {
    return (0, versionmanager_1.upgradeDependencyDeclaration)(current, latest, options);
}
//# sourceMappingURL=remote.js.map
"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterResolutions = filterResolutions;
exports.removeResolutions = removeResolutions;
exports.removeResolutionsCore = removeResolutionsCore;
exports.filterDuplicateYarnLock = filterDuplicateYarnLock;
exports.exportYarnLock = exportYarnLock;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importDefault(require("semver"));
const util_1 = require("./util");
/**
 * 依 package.json 的 `resolutions` 過濾 yarn.lock 條目。
 * 沒有 `resolutions` 時回傳 `null`，讓呼叫端能區分「未設定 resolutions」
 * 與「有設定但過濾後沒有結果」兩種情況。
 *
 * Filters yarn.lock entries by the `resolutions` of package.json.
 * Returns `null` when `resolutions` is absent so callers can tell
 * "no resolutions configured" from "configured but nothing matched".
 *
 * @param pkg 來源 package.json，只需要 `resolutions` 欄位 / source package.json, only `resolutions` is needed
 * @param yarnlock 已解析的 yarn.lock 資料 / parsed yarn.lock data
 */
function filterResolutions(pkg, yarnlock) {
    if (pkg.resolutions) {
        /**
         * 有 `resolutions` 才過濾：以 stripDepsName 拆出名稱後比對 resolutions 的鍵，
         * 因為 yarn.lock 鍵值是 `名稱@版本`，不能直接拿整串鍵比對。
         *
         * Only filter when `resolutions` exists: the key is split by stripDepsName before
         * matching against resolutions keys, because a yarn.lock key is `name@version`
         * and cannot be compared as a whole string.
         */
        return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
            let name = (0, util_1.stripDepsName)(key)[0];
            return pkg.resolutions[name] != null;
        });
    }
    return null;
}
/**
 * 移除 `resolutions` 所指定的 yarn.lock 條目，回傳新舊資料與是否有變動。
 * 先用 filterResolutions 取得命中清單再交由 removeResolutionsCore 刪除，
 * 重用同一套比對邏輯，避免兩處實作出現行為差異。
 *
 * Removes yarn.lock entries targeted by `resolutions` and reports old/new data plus
 * whether anything changed. The match list comes from filterResolutions and deletion
 * is delegated to removeResolutionsCore, reusing one comparison logic so the two
 * implementations cannot drift apart.
 *
 * @example ```
 let pkg = readPackageJson('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/package.json');

 let y = readYarnLockfile('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/yarn.lock')

 console.dir(removeResolutions(pkg, y), {
    depth: null,
});
 ```
 */
function removeResolutions(pkg, yarnlock_old) {
    let result = filterResolutions(pkg, yarnlock_old);
    return removeResolutionsCore(result, yarnlock_old);
}
/**
 * `removeResolutions` 的核心：以 reduce 複製原資料後逐筆刪除命中的鍵。
 * 用展開運算子建立新物件是為了保留 `yarnlock_old` 不被原地修改，
 * 讓呼叫端能同時拿到刪除前後兩份資料做比較。
 *
 * Core of `removeResolutions`: copies the original data via reduce then deletes each
 * matched key. The spread builds a new object so `yarnlock_old` is never mutated and
 * the caller keeps both before/after snapshots for comparison.
 *
 * @param result filterResolutions 的過濾結果 / the filterResolutions match result
 * @param yarnlock_old 刪除前的 yarn.lock 資料 / yarn.lock data before deletion
 */
function removeResolutionsCore(result, yarnlock_old) {
    // @ts-ignore
    let yarnlock_new = result.names
        // @ts-ignore
        .reduce(function (a, b) {
        /**
         * 逐筆刪除命中的鍵並回傳累積物件，
         * reduce 在此承擔「複製後修剪 (copy then trim)」的過程。
         *
         * Deletes each matched key and returns the accumulator; here the reduce
         * serves as the "copy then trim" step.
         */
        delete a[b];
        return a;
    }, {
        ...yarnlock_old,
    });
    /**
     * 只要有命中的鍵就視為有變動；
     * 與逐欄比對整份 lockfile 相比成本更低，且呼叫端本來就只在乎「是否需要回寫」。
     *
     * Any matched key counts as a change; cheaper than comparing the whole lockfile
     * field by field, and callers only care about "needs rewrite or not".
     */
    let yarnlock_changed = !!result.names.length;
    return {
        /**
         * 執行前的 yarn.lock
         */
        yarnlock_old,
        /**
         * 執行後的 yarn.lock
         */
        yarnlock_new,
        /**
         * yarn.lock 是否有變動
         */
        yarnlock_changed,
        /**
         * 命中的過濾明細，供呼叫端記錄移除了哪些條目
         */
        result,
    };
}
/**
 * 找出同一模組安裝多個版本的重複 (Duplicate) 條目。
 * 先以 exportYarnLock 彙整出每個模組的 `installed` 版本列表，
 * 再只保留長度大於 1 的模組，避免直接對整份 lockfile 做雙重比對。
 *
 * Finds duplicated entries where one module has multiple installed versions.
 * exportYarnLock first aggregates the `installed` version list per module, then only
 * lists with more than one version are kept instead of double-scanning the lockfile.
 *
 * @param yarnlock 已解析的 yarn.lock 資料 / parsed yarn.lock data
 */
function filterDuplicateYarnLock(yarnlock) {
    let fy = exportYarnLock(yarnlock);
    let ks = Object.keys(fy.installed)
        .filter(function (value) {
        return fy.installed[value].length > 1;
    });
    /**
     * 再以同一份 exportYarnLock 結果過濾，
     * 讓回傳的 deps / installed / max 只包含重複安裝的模組，資料結構保持一致。
     *
     * Filtering again against the same exportYarnLock result keeps deps / installed /
     * max consistent while scoping them to duplicated modules only.
     */
    return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
        let n = (0, util_1.stripDepsName)(key)[0];
        return ks.includes(n);
    });
}
/**
 * 將 yarn.lock 資料依模組名稱彙整，回傳四份視圖：
 * `names`（過濾後的鍵值列表）、`deps`（名稱 → 版本 → 資料）、
 * `installed`（每模組實際安裝的版本列表）、`max`（每模組的最大版本）。
 * 這是過濾、去重等分析功能的共同基礎，集中在此可確保所有呼叫端以同一套邏輯解析鍵值。
 *
 * Aggregates yarn.lock data by module name and returns four views:
 * `names` (filtered keys), `deps` (name → version → row),
 * `installed` (versions actually installed per module) and `max` (highest version per module).
 * Shared foundation of filtering/dedupe analysis so every caller parses keys the same way.
 *
 * @param yarnlock 已解析的 yarn.lock 資料 / parsed yarn.lock data
 * @param filter 可選的鍵值過濾器，於彙整前先行縮小範圍 / optional key filter applied before aggregation
 */
function exportYarnLock(yarnlock, filter) {
    let ks = Object.keys(yarnlock);
    /**
     * 先過濾再 reduce：在進入逐筆彙整前縮小處理範圍，
     * 未傳入 filter 時保留全部鍵，維持「不過濾 = 全量」的語意。
     *
     * Filtering happens before the reduce to shrink the work per entry; without a
     * filter all keys are kept so "no filter" keeps the "everything" semantics.
     */
    if (filter) {
        ks = ks
            .filter((value, index, array) => {
            return filter(value, index, array, yarnlock);
        });
    }
    return ks
        .reduce(function (a, k) {
        /**
         * 鍵值形如 `名稱@版本`（含 scoped 模組），必須先拆開才能當分組鍵使用。
         *
         * A key looks like `name@version` (scoped included), so it must be split
         * before it can be used as a grouping key.
         */
        let n = (0, util_1.stripDepsName)(k);
        let name = n[0];
        let key = n[1];
        let data = yarnlock[k];
        /**
         * 惰性初始化 deps 的兩層結構（名稱 → 版本 → 資料）；
         * 同名稱不同範圍的鍵會匯入同一個子物件，形成完整的版本索引。
         *
         * Lazily initialises the two-level deps structure (name → version → row);
         * keys sharing a name but differing ranges land in the same sub-object,
         * forming a complete version index.
         */
        // @ts-ignore
        (a.deps[name] = a.deps[name] || {})[key] = data;
        /**
         * installed 同樣惰性初始化；重複的版本不重複 push，
         * 讓清單可直接代表「實際安裝了幾個不同版本」。
         *
         * `installed` is lazily initialised too; duplicate versions are not pushed
         * twice so the list directly answers "how many distinct versions are installed".
         */
        a.installed[name] = a.installed[n[0]] || [];
        if (!a.installed[name].includes(data.version)) {
            a.installed[name].push(data.version);
            /**
             * 只在遇到「新版本」時才更新 max：
             * 版本相同時最大值不可能改變，跳過可避免多餘的 semver 比較。
             *
             * `max` is only updated when a new version appears: an identical version
             * cannot change the maximum, so the semver comparison is skipped.
             */
            if (a.max[name] != null) {
                /**
                 * 已有最大版本時改用 semver 比較，
                 * 因為 yarn.lock 的版本字串不能用字串排序決定大小。
                 *
                 * Compared with semver when a maximum already exists, because
                 * version strings must not be ordered lexicographically.
                 */
                if (semver_1.default.lt(a.max[name].value.version, data.version)) {
                    a.max[name] = {
                        key: k,
                        value: data,
                    };
                }
            }
            else {
                /**
                 * 第一個出現的版本直接成為暫時的最大版本。
                 *
                 * The first version seen becomes the provisional maximum.
                 */
                a.max[name] = {
                    key: k,
                    value: data,
                };
            }
        }
        return a;
    }, {
        names: ks,
        deps: {},
        installed: {},
        max: {},
    });
}
//# sourceMappingURL=core.js.map
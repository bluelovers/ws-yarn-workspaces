/**
 * Created by user on 2020/6/11.
 */
import { ITSArrayListMaybeReadonly } from 'ts-type';
import { IRemoveResolutions, IFilterResolutions, IYarnLockfileParseObject } from './types';
import { IDependencies } from '@ts-type/package-dts/package-json';
import { IYarnLockDataRecord } from '@yarn-tool/yarnlock-types';
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
export declare function filterResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
    resolutions?: IDependencies<T>;
}, yarnlock: IYarnLockDataRecord): IFilterResolutions<T>;
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
export declare function removeResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
    resolutions?: IDependencies<T>;
}, yarnlock_old: IYarnLockfileParseObject<T>): IRemoveResolutions<T>;
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
export declare function removeResolutionsCore<T extends ITSArrayListMaybeReadonly<string>>(result: IFilterResolutions<T>, yarnlock_old: IYarnLockfileParseObject<T>): IRemoveResolutions<T>;
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
export declare function filterDuplicateYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockDataRecord): IFilterResolutions<ITSArrayListMaybeReadonly<string>>;
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
export declare function exportYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockDataRecord, filter?: (key: keyof IYarnLockfileParseObject<T>, index: number, array_keys: (keyof IYarnLockfileParseObject<T>)[], yarnlock: IYarnLockDataRecord) => boolean): IFilterResolutions<T>;

/**
 * Core npm-check-updates wrapper function.
 * npm-check-updates 的核心封裝函數。
 *
 * 此模組提供主要功能：
 * - 檢查 package.json 中依賴套件的可用更新
 * - 比較當前版本與最新版本
 * - 支援 semver 版本範圍處理
 * - 整合版本快取機制
 *
 * @module update/npmCheckUpdates
 */
import { IOptionsNpmCheckUpdates } from '../types';
import Bluebird from 'bluebird';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
/**
 * 檢查並更新 package.json 中的依賴版本 (Check and update dependencies in package.json)
 *
 * 此函式是 `@yarn-tool/ncu` 的核心入口：
 * 1. 以 {@link npmCheckUpdatesOptions} 正規化選項後呼叫 ncu 取得 `list_updated`
 * 2. 逐一比對四種依賴區段，只在「版本真的不同且可安全升級」時寫入
 * 3. 對 ncu 查不到結果的範圍（如 `^1.2.0`）改以 `queryVersionWithCache` 查詢，
 *    再用 `mergeSimpleSemVer` 合併，保留原本的範圍前綴
 * 4. 最後把快取落盤、輸出更新表格並回傳完整選項物件（含結果欄位）
 *
 * This is the core entry of `@yarn-tool/ncu`:
 * 1. normalise options via {@link npmCheckUpdatesOptions}, then call ncu for `list_updated`
 * 2. walk the four dependency sections and write only when the version really
 *    changed and is safe to upgrade
 * 3. for ranges ncu cannot resolve (e.g. `^1.2.0`), query via
 *    `queryVersionWithCache` and merge with `mergeSimpleSemVer` so the original
 *    range prefix survives
 * 4. finally dump the cache, print the update table and return the full options
 *    object including the result fields
 *
 * 邊界情況：semver 合併過程抛出的錯誤會被靜默忽略（見 `catch`），因為單一
 * 套件無法解析不應中斷整批更新。
 * Edge case: errors thrown while merging semver are swallowed (see `catch`),
 * because one unparseable package must not abort the whole batch.
 *
 * @param cache - 版本快取（含 cwd，用於快取落盤） / Version cache (its `cwd` is used for the cache dump)
 * @param ncuOptions - 至少需提供 `json_old` 或 `packageData` 之一 / Requires at least one of `json_old` or `packageData`
 * @returns 帶有 `json_changed`、`list_updated`、`current` 等結果欄位的選項 / Options carrying `json_changed`, `list_updated`, `current`
 */
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>): Bluebird<IOptionsNpmCheckUpdates>;

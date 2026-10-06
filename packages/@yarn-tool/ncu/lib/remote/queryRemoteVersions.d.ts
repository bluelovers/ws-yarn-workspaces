import { IPackageMap, IOptionsNpmCheckUpdates } from '../types';
import Bluebird from 'bluebird';
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
export declare function queryRemoteVersions(packageMap: IPackageMap | string[], options?: Partial<IOptionsNpmCheckUpdates>): Bluebird<import("../types").IVersionCacheMapValue[]>;

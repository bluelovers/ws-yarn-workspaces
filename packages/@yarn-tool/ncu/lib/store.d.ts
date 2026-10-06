/**
 * Created by user on 2020/6/12.
 */
/**
 * 版本查詢快取儲存 (Version cache store)
 * 說明：本模組以「模組層級」的 Map 保存查詢結果，讓同一個 process 內的多次呼叫
 * 共享同一份資料，避免重複打 npm registry；也因此資料不會跨 process 存活。
 * Why: the maps live at module scope so every call inside one process shares the
 * same data and no redundant registry request is issued; the data intentionally
 * does not survive across processes.
 *
 * @module store
 */
import { IVersionCacheMapValue, IRomotePackageJsonReturnType, IVersionCacheMapKey } from './types';
/**
 * 已解析版本的快取表 (Resolved version cache)
 * 鍵為 {@link strVersionCache} 產生的字串，值同時保存舊版本與新版本，
 * 以便後續流程只讀取快取就能還原「更新前 → 更新後」的對照。
 * The key is the string built by {@link strVersionCache}; the value keeps both the
 * old and the new version so later steps can rebuild the before/after mapping
 * from the cache alone.
 */
export declare const versionCacheMap: Map<string, IVersionCacheMapValue>;
/**
 * 遠端套件中繼資料 (metadata) 快取
 * 以套件名稱為鍵保存 `package-json` 的完整回應，避免同一套件被重複查詢。
 * Keyed by package name, it stores the full `package-json` response so the same
 * package is never fetched twice inside one process.
 */
export declare const remoteCacheMap: Map<string, IRomotePackageJsonReturnType>;
/**
 * 取得可作為快取鍵 (cache key) 的最小欄位組
 * 只保留 name / versionTarget / version_old：刻意忽略 version_new 等額外欄位，
 * 讓「查詢前」與「查詢後」的資料能對應到同一個鍵。
 * Keeps only name / versionTarget / version_old on purpose: extra fields such as
 * version_new are ignored so pre-query and post-query data map to the same key.
 */
export declare function objVersionCache({ name, versionTarget, version_old, }: IVersionCacheMapKey): IVersionCacheMapKey;
/**
 * 回傳完整快取值 (full cache value)
 * 與 {@link objVersionCache} 不同，此處刻意保留 version_new，
 * 因為呼叫端需要取得「更新後」的版本號。
 * Unlike {@link objVersionCache}, version_new is kept here because callers need
 * the upgraded version.
 */
export declare function objVersionCacheValue({ name, versionTarget, version_old, version_new, }: IVersionCacheMapValue): IVersionCacheMapValue;
/**
 * 將快取鍵序列化為字串
 * 使用固定的 JSON 欄位順序，確保相同條件永遠產生相同鍵（鍵序不一致會造成快取失效）。
 * Serializes the cache key to a string; the JSON field order is fixed so identical
 * conditions always yield the same key (a different field order would miss the cache).
 */
export declare function strVersionCache(key: IVersionCacheMapKey): string;
/**
 * 判斷該版本是否已查詢過
 * 回傳 false 代表需要向遠端發起查詢，是批次更新時的主要去重 (dedupe) 依據。
 * Returns false when a remote query is still needed; this is the main dedupe
 * guard during batch updates.
 */
export declare function hasQueryedVersionCache(key: IVersionCacheMapKey): boolean;
/**
 * 寫入版本快取
 * 寫入前會重新走一次 {@link objVersionCacheValue}，確保呼叫端傳入的多餘欄位
 * 不會污染快取內容。
 * Re-normalises via {@link objVersionCacheValue} before storing, so extra fields
 * passed by the caller never pollute the cache entry.
 */
export declare function setVersionCacheMap(data: IVersionCacheMapValue): Map<string, IVersionCacheMapValue>;

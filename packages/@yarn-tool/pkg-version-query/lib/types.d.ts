/**
 * Type definitions for @yarn-tool/pkg-version-query.
 * @yarn-tool/pkg-version-query 的類型定義。
 *
 * @packageDocumentation
 *
 * 包含版本查詢結果、快取選項等相關類型定義。
 */
import { VersionNotFoundError, PackageNotFoundError, Options, AbbreviatedMetadata } from 'package-json';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
import Cache, { IOptionsLRUCacheFS } from 'lru-cache-fs2';
/**
 * Core structure for cached version query result.
 * 快取版本查詢結果的核心結構。
 */
export interface ICachedVersionResultCore {
    /** 快取鍵，格式為 `name@version` / Cache key in `name@version` form */
    key: string;
    /** 套件名稱 / Package name */
    name: string;
    /** 被查詢的版本或範圍 / The queried version or range */
    version: string;
    /** 查詢成功時的解析結果 / Resolved version when the query succeeded */
    result?: string;
    /** 查詢失敗時的錯誤物件 / Error captured when the query failed */
    error?: VersionNotFoundError | PackageNotFoundError;
}
/**
 * 快取結果至少要有 result 或 error 其中之一，
 * 以型別逼出「既沒成功也沒失敗」這種無法解釋的快取列。
 *
 * A cached entry must carry either result or error, so the type system rules out
 * entries that are neither a success nor a failure (which would be uninterpretable).
 */
export type ICachedVersionResult = ITSRequireAtLeastOne<ICachedVersionResultCore, 'result' | 'error'>;
/**
 * 查詢選項：交叉 package-json 的選項（registry 相關設定可直接透傳）
 * 與本套件自己的快取 / 錯誤處理欄位。
 *
 * Query options: an intersection of package-json's options (registry settings pass
 * straight through) with this package's own cache and error-handling fields.
 *
 * @template T 底層 package-json 的選項型別 / Underlying package-json options type
 */
export type IOptionsQueryVersion<T extends Options | AbbreviatedMetadata> = T & {
    /** 失敗時回傳 undefined 而非丟出例外 / Return undefined instead of throwing on failure */
    notThrowError?: boolean;
    /** 自訂快取實例，優先於內建單例 / Custom cache instance, takes precedence over the built-in singleton */
    cacheAgent?: Cache<string, ICachedVersionResult>;
    /** 建立內建快取時使用的 LRU 設定 / LRU settings used when building the built-in cache */
    cacheAgentOptions?: IOptionsLRUCacheFS<string, ICachedVersionResult>;
};

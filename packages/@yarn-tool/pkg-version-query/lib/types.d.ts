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
    key: string;
    name: string;
    version: string;
    result?: string;
    error?: VersionNotFoundError | PackageNotFoundError;
}
export type ICachedVersionResult = ITSRequireAtLeastOne<ICachedVersionResultCore, 'result' | 'error'>;
export type IOptionsQueryVersion<T extends Options | AbbreviatedMetadata> = T & {
    notThrowError?: boolean;
    cacheAgent?: Cache<string, ICachedVersionResult>;
    cacheAgentOptions?: IOptionsLRUCacheFS<string, ICachedVersionResult>;
};

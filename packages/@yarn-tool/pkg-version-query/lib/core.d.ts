/**
 * Core version query function using package-json.
 * 使用 package-json 的核心版本查詢函數。
 *
 * @module core
 *
 * 提供底層的 npm registry 查詢功能，封裝 package-json 模組。
 */
import { Options, AbbreviatedVersion, AbbreviatedMetadata, FullMetadataOptions, FullMetadata } from 'package-json';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from './types';
/**
 * Query package information from npm registry.
 * 從 npm registry 查詢套件資訊。
 *
 * @param packageName - Package name to query / 要查詢的套件名稱
 * @param options - Query options / 查詢選項
 * @returns Promise resolving to package metadata / 回傳套件元資料的 Promise
 */
export declare function _queryVersion(packageName: string, options: IOptionsQueryVersion<FullMetadataOptions>): Bluebird<FullMetadata>;
export declare function _queryVersion(packageName: string, options: Omit<Options, 'allVersions' | 'version'> & {
    allVersions?: false;
    version: string;
}): Bluebird<AbbreviatedVersion>;
export declare function _queryVersion(packageName: string, options?: IOptionsQueryVersion<Options>): Bluebird<AbbreviatedMetadata>;

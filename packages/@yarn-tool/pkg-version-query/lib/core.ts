/**
 * Core version query function using package-json.
 * 使用 package-json 的核心版本查詢函數。
 *
 * @module core
 *
 * 提供底層的 npm registry 查詢功能，封裝 package-json 模組。
 */

import _packageJson, {
	Options,
	AbbreviatedVersion,
	AbbreviatedMetadata,
	FullMetadataOptions,
	FullMetadata,
} from 'package-json';
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
export function _queryVersion(packageName: string,
	options: IOptionsQueryVersion<FullMetadataOptions>,
): Bluebird<FullMetadata>;
export function _queryVersion(packageName: string,
	options: Omit<Options, 'allVersions' | 'version'> & {
		allVersions?: false,
		version: string,
	},
): Bluebird<AbbreviatedVersion>
export function _queryVersion(packageName: string,
	options?: IOptionsQueryVersion<Options>,
): Bluebird<AbbreviatedMetadata>
export function _queryVersion(packageName: string, options?: IOptionsQueryVersion<Options>)
{
	/**
	 * 選項允許省略：交給 package-json 使用其預設值，
	 * 避免每個呼叫端都要自行組出空物件。
	 *
	 * Options are optional: an empty object lets package-json apply its own defaults,
	 * so callers do not have to build one themselves.
	 */
	options ??= {};

	return Bluebird.resolve(_packageJson(packageName, options))
		.catch(e =>
		{
			/**
			 * notThrowError 是給「寧可拿不到也不要中斷流程」的批次查詢用的；
			 * 回傳 undefined 而非吞掉後回傳舊值，讓呼叫端能明確區分失敗與命中。
			 *
			 * notThrowError serves batch queries that prefer no result over a crash;
			 * returning undefined (instead of some stale value) lets callers
			 * distinguish failure from a real hit.
			 */
			if (options.notThrowError)
			{
				return
			}

			return Promise.reject(e)
		}) as any
		;
}

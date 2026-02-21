/**
 * Query package versions with cache support.
 * 查詢套件版本並支援快取機制。
 *
 * @module queryVersion
 *
 * 主要功能：
 * - 從 npm registry 查詢套件版本
 * - 支援 LRU 快取，減少重複查詢
 * - 處理版本範圍語法 (如 ^, ~, npm: 協議)
 * - 錯誤處理與快取錯誤結果
 */

import { PackageNotFoundError, VersionNotFoundError, Options } from 'package-json';
import Bluebird from 'bluebird';
import { getCache } from './cacheAgent';
import { _createCacheKey } from './createCacheKey';
import { _queryVersion } from './core';
import { queryVersionCacheRaw } from './queryVersionCacheRaw';
import { IOptionsQueryVersion } from './types';
import { handleAmpersandAndSpaces } from '@lazy-node/semver-ampersand/lib/handleAmpersandAndSpaces';
import { reAmpersandAndSpaces } from '@lazy-node/semver-ampersand/lib/const';

/**
 * Query package version with LRU cache.
 * 使用 LRU 快取查詢套件版本。
 *
 * @param name - Package name / 套件名稱
 * @param targetVersion - Target version or range (default: 'latest') / 目標版本或範圍
 * @param options - Query options / 查詢選項
 * @returns Promise resolving to version string / 回傳版本字串的 Promise
 *
 * @example
 * ```ts
 * const version = await queryVersionWithCache('lodash');
 * // => '4.17.21'
 *
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * // => '4.9.5'
 * ```
 */
export function queryVersionWithCache(name: string, targetVersion: string = 'latest', options?: IOptionsQueryVersion<Options>): Bluebird<string>
{
	return Bluebird.resolve(queryVersionCacheRaw(name, targetVersion, options))
		.then(data =>
		{
			if (data?.error)
			{
				return Promise.reject(data.error)
			}
			else if (data?.result)
			{
				return data.result
			}

			return queryVersion(name, data?.version ?? targetVersion, true,options)
				.catch(e => {
					if (data?.result)
					{
						return data.result
					}

					return Promise.reject(e)
				})
		})
}

export function queryVersion(name: string, targetVersion: string = 'latest', save: boolean = true, options?: IOptionsQueryVersion<Options>): Bluebird<string>
{
	let version = targetVersion ??= 'latest';
	let key = _createCacheKey(name, targetVersion);

	return _queryVersion(name, {
		version,
	})
		.then((result) =>
		{
			return result.version
		})
		.catch(VersionNotFoundError, async (e) =>
		{
			let bool = true;

			if (version.startsWith('npm:'))
			{
				version = version.replace(/^npm:/, '')

				bool = false
			}

			if (reAmpersandAndSpaces.test(version))
			{
				version = handleAmpersandAndSpaces(version)

				bool = false
			}

			if (bool)
			{
				return Promise.reject(e)
			}

			return queryVersion(name, version, false,options)
		})
		.tapCatch(VersionNotFoundError, PackageNotFoundError, (error) =>
		{
			save && getCache(options).set(key, {
				key,
				name,
				version,
				error,
			});
		})
		.tap(result =>
		{
			save && getCache(options).set(key, {
				key,
				name,
				version,
				result,
			});
		})
		;
}

export default queryVersionWithCache

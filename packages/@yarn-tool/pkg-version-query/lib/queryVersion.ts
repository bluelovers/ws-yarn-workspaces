import { PackageNotFoundError, VersionNotFoundError, Options } from 'package-json';
import Bluebird from 'bluebird';
import { getCache } from './cacheAgent';
import { _createCacheKey } from './createCacheKey';
import { _queryVersion } from './core';
import { queryVersionCacheRaw } from './queryVersionCacheRaw';
import { IOptionsQueryVersion } from './types';
import { handleVersionRange } from '@lazy-node/semver-ampersand/lib/handleVersionRange';
import { reHandleVersionRange } from '@lazy-node/semver-ampersand/lib/const';

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

			if (reHandleVersionRange.test(version))
			{
				version = handleVersionRange(version)

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

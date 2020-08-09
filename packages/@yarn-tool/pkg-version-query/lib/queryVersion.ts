import { PackageNotFoundError, VersionNotFoundError } from 'package-json';
import Bluebird from 'bluebird';
import { getCache } from './cacheAgent';
import { handleVersionRange, reHandleVersionRange } from '@lazy-node/semver-ampersand/index';
import { _createCacheKey } from './createCacheKey';
import { _queryVersion } from './core';
import { queryVersionCacheRaw } from './queryVersionCacheRaw';

export function queryVersionWithCache(name: string, targetVersion: string = 'latest'): Bluebird<string>
{
	return Bluebird.resolve(queryVersionCacheRaw(name, targetVersion))
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

			return queryVersion(name, data?.version ?? targetVersion)
		})
}

export function queryVersion(name: string, targetVersion: string = 'latest', save: boolean = true): Bluebird<string>
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

			return queryVersion(name, version, false)
		})
		.tapCatch(VersionNotFoundError, PackageNotFoundError, (error) =>
		{
			save && getCache().set(key, {
				key,
				name,
				version,
				error,
			});
		})
		.tap(result =>
		{
			save && getCache().set(key, {
				key,
				name,
				version,
				result,
			});
		})
		;
}

export default queryVersionWithCache

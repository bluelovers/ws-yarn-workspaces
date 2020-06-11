/**
 * Created by user on 2020/6/12.
 */

import {
	IVersionValue,
	IOptionsNpmCheckUpdates,
	IPackageMap,
	EnumVersionValue,
	EnumPackageManagersNpmMethod,
	IVersionCacheMapKey,
	IOptionsFetchVersion,
} from './types';
import Bluebird from 'bluebird';
import {
	remoteCacheMap,
	hasQueryedVersionCache,
	versionCacheMap,
	setVersionCacheMap,
	strVersionCache,
	objVersionCache,
} from './store';
import packageJson from 'package-json';

import {
	queryVersions as _queryVersions,
	getVersionTarget as _getVersionTarget,
	isUpgradeable as _isUpgradeable,
	upgradeDependencyDeclaration,
} from 'npm-check-updates/lib/versionmanager';

import semver from 'semver';
import { isBadVersion, keyObjectToPackageMap } from './util';
import PackageManagersNpm from 'npm-check-updates/lib/package-managers/npm';
import { npmCheckUpdatesOptions } from './options';

export function requestVersion(packageName: string)
{
	return Bluebird
		.resolve(remoteCacheMap.get(packageName))
		.then(function (result)
		{
			if (result == null)
			{
				return packageJson(packageName, { allVersions: true })
			}

			return result
		})
		.tap(function (result)
		{
			return remoteCacheMap.set(packageName, result);
		})
}

export function fetchVersion(packageName: string, options: IOptionsFetchVersion = {}, ncuOptions?: Partial<IOptionsNpmCheckUpdates>)
{
	let { field = 'versions' } = options;

	return requestVersion(packageName)
		//.resolve(packageJson(packageName, { allVersions: true }))
		.then<IVersionValue[]>(function (result)
		{
			if (field.startsWith('dist-tags.'))
			{
				const split = field.split('.');
				if (result[split[0]])
				{
					return result[split[0]][split[1]];
				}
			}
			else if (field === 'versions')
			{
				return Object.keys(result[field]);
			}
			else if (field)
			{
				return result[field];
			}
		})
		.then(result =>
		{

			if (options.filter)
			{
				return result.filter(options.filter)
			}

			//console.dir(result);

			return result;
		})
		;
}

export function getVersionTarget(options: Partial<IOptionsNpmCheckUpdates> | string | IOptionsNpmCheckUpdates['versionTarget']): IOptionsNpmCheckUpdates['versionTarget']
{
	if (typeof options === 'string')
	{
		// @ts-ignore
		return options
	}
	else if (options.versionTarget)
	{
		return options.versionTarget
	}

	return _getVersionTarget(options)
}

export function queryPackageManagersNpm(name: string,
	version: IVersionValue = '0',
	versionTarget: EnumVersionValue = EnumVersionValue.latest,
): Bluebird<IVersionValue>
{
	let method = EnumPackageManagersNpmMethod[versionTarget];

	if (version == null)
	{
		version = '0';

		switch (versionTarget)
		{
			case EnumVersionValue.latest:
			case EnumVersionValue.greatest:
			case EnumVersionValue.newest:
				break;
			case EnumVersionValue.major:
			case EnumVersionValue.minor:
				method = EnumPackageManagersNpmMethod.latest;
				break;
		}
	}

	return Bluebird
		.resolve<IVersionValue>(PackageManagersNpm[method](name, version, {}))
		.then(async (value) =>
		{
			if (value == null)
			{
				let r = await requestVersion(name);

				if (version in r['dist-tags'])
				{
					return r['dist-tags'][version]
				}
			}

			return value
		})

}

export function packageMapToKeyObject(packageMap: IPackageMap, versionTarget: IVersionCacheMapKey["versionTarget"])
{
	return Object
		.entries(packageMap)
		.map(([name, version_old]) =>
		{
			return objVersionCache({
				name, version_old, versionTarget,
			})
		})
		;
}

export function queryRemoteVersions(packageMap: IPackageMap | string[], options: Partial<IOptionsNpmCheckUpdates> = {})
{
	return Bluebird.resolve()
		.then(async function ()
		{
			options = npmCheckUpdatesOptions(options);

			//console.dir(options);

			options.loglevel = 'silent';

			let versionTarget = options.versionTarget = getVersionTarget(options) || EnumVersionValue.latest;

			if (Array.isArray(packageMap))
			{
				packageMap = packageMap.reduce(function (a, b)
				{
					a[b] = versionTarget;

					return a
				}, {} as IPackageMap);
			}

			let packageMapArray = packageMapToKeyObject(packageMap, versionTarget);

			let packageMapArrayFilted = await Bluebird.resolve(packageMapArray)
				.filter(async (d) =>
				{
					let bool = !hasQueryedVersionCache(d);

					if (bool && isBadVersion(d.version_old))
					{
						if (versionTarget === EnumVersionValue.minor)
						{
							let version_new = await queryPackageManagersNpm(d.name);

							d.version_old = version_new.split('.')[0] + '.0.0';

							setVersionCacheMap({
								...d,
								version_new,
							});

							bool = false;
						}
					}

					return bool
				})
			;

			let packageMap2 = keyObjectToPackageMap(packageMapArrayFilted);

			return Bluebird
				.resolve<IPackageMap>(_queryVersions(packageMap2, options))
				.tap(ret =>
				{
					return Bluebird.resolve(Object.entries(packageMap2))
						.each(async ([name, version_old]) =>
						{
							let version_new = ret[name];

							if (version_old.includes('~'))
							{
								if (!options.noSafe || version_new == null)
								{
									version_new = await fetchVersion(name, {
										filter(version)
										{
											return semver.satisfies(version, version_old)
										},
									}, options)
										.then(ret => ret.pop())
								}
							}

							if (version_new == null && isBadVersion(version_old))
							{
								version_new = await queryPackageManagersNpm(name, null, versionTarget);
							}

							if (version_new == null)
							{
								version_new = await queryPackageManagersNpm(name, version_old, versionTarget);
							}

							setVersionCacheMap({
								name,
								versionTarget,
								version_old,
								version_new,
							});
						})
						;
				})
				.then(() =>
				{
					return packageMapArray
						.map(data => versionCacheMap.get(strVersionCache(data)))
				})
				;
		})
		;
}

export function isUpgradeable(current: IVersionValue, latest: IVersionValue): boolean
{
	return _isUpgradeable(current, latest)
}

export function updateSemver(current: IVersionValue,
	latest: IVersionValue,
	options: Partial<IOptionsNpmCheckUpdates> = {},
): IVersionValue
{
	return upgradeDependencyDeclaration(current, latest, options);
}


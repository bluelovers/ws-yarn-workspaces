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
import { remoteCacheMap, objVersionCache } from './store';
import packageJson from 'package-json';

import {
	isUpgradeable as _isUpgradeable,
	upgradeDependencyDeclaration,
} from 'npm-check-updates/lib/versionmanager';
import PackageManagersNpm from 'npm-check-updates/lib/package-managers/npm';
import { getVersionTarget } from './remote/getVersionTarget';

export { queryRemoteVersions } from './remote/queryRemoteVersions';

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

export { getVersionTarget }

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


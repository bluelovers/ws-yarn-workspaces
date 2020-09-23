import { IPackageMap, IOptionsNpmCheckUpdates, EnumVersionValue } from '../types';
import Bluebird from 'bluebird';
import { npmCheckUpdatesOptions } from '../options';
import { hasQueryedVersionCache, setVersionCacheMap, versionCacheMap, strVersionCache } from '../store';
import { isBadVersion, keyObjectToPackageMap } from '../util';
import semver from 'semver';
import { getVersionTarget, packageMapToKeyObject, queryPackageManagersNpm, fetchVersion } from '../remote';
import {
	queryVersions as _queryVersions,
	isUpgradeable as _isUpgradeable,
	upgradeDependencyDeclaration,
} from 'npm-check-updates/lib/versionmanager';

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

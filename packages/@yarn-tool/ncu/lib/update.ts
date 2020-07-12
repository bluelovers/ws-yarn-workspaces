/**
 * Created by user on 2020/6/12.
 */
import { run as _npmCheckUpdates } from 'npm-check-updates';
import {
	IPackageMap,
	IOptionsNpmCheckUpdates,
	IVersionCacheMapValue,
	IDependency,
	EnumVersionValue2,
	EnumVersionValue,
} from './types';
import {
	IYarnLockfileParseObject,
	parse as parseYarnLock,
	filterResolutions,
	IWrapDedupeCache,
} from '@yarn-tool/yarnlock';
import Bluebird from 'bluebird';
import { keyObjectToPackageMap, allowUpdateVersion } from './util';
import semver from 'semver';
import { queryRemoteVersions } from './remote';
import { npmCheckUpdatesOptions } from './options';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/package-json';
import { toDependencyTable } from '@yarn-tool/table';
import { ITSRequireAtLeastOne } from 'ts-type';

export function checkResolutionsUpdate(resolutions: IPackageMap,
	yarnlock_old_obj: IYarnLockfileParseObject | string,
	options: Partial<IOptionsNpmCheckUpdates>,
)
{
	return Bluebird.resolve()
		.then(async function ()
		{
			if (typeof yarnlock_old_obj === 'string')
			{
				yarnlock_old_obj = parseYarnLock(yarnlock_old_obj);
			}

			let result = filterResolutions({
				resolutions,
			}, yarnlock_old_obj);

			let deps = await queryRemoteVersions(resolutions, options);

			//console.dir(deps);

			let deps2 = keyObjectToPackageMap(deps, true);

			let deps3 = Object.values(deps)
				.reduce(function (a, b)
				{
					a[b.name] = b;

					return a;
				}, {} as Record<string, IVersionCacheMapValue>)
			;

			let yarnlock_new_obj: IYarnLockfileParseObject = {
				...yarnlock_old_obj,
			};

			let update_list: string[] = [];
			let yarnlock_changed = false;

			Object.entries(result.max)
				.forEach(function ([name, data])
				{
					let _key2 = name + '@' + deps3[name].version_old;

					/**
					 * 檢查 版本範圍是否符合 與 版本是否不相同
					 */
//					console.dir({
//						data,
//						deps: deps2[name],
//					});
					if (data.value.version != null && deps2[name] != null && semver.lt(data.value.version, deps2[name]) && yarnlock_new_obj[_key2] && yarnlock_new_obj[_key2].version != data.value.version)
					{
						Object.keys(result.deps[name])
							.forEach(version =>
							{
								let key = name + '@' + version;

								delete yarnlock_new_obj[key]
							})
						;

						yarnlock_changed = true;

						update_list.push(name);
					}
					else
					{
						if (result.installed[name].length > 1)
						{
							Object.keys(result.deps[name])
								.forEach(version =>
								{

									let key = name + '@' + version;

									yarnlock_new_obj[key] = data.value;
								})
							;

							yarnlock_changed = true;
						}
					}

				})
			;

			return {
				yarnlock_old_obj,
				yarnlock_new_obj,
				update_list,
				yarnlock_changed,
				deps,
				deps2,
				deps3,
			}
		})
		;
}

export async function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>)
{
	//ncuOptions.silent = false;

	//ncuOptions.json = false;
	//ncuOptions.cli = true;

	//ncuOptions.args = [];

	//ncuOptions.loglevel = 'verbose';

	ncuOptions = npmCheckUpdatesOptions(ncuOptions);

	ncuOptions.cwd = cache.cwd;

	ncuOptions.json_new = JSON.parse(ncuOptions.packageData);

	ncuOptions.list_updated = await _npmCheckUpdates(ncuOptions) as Record<string, string>;

	const ks = Object.keys(ncuOptions.list_updated);

	let json_changed = false;

	const current: IDependency = {};
	const list_updated: IDependency = {};

	if (ks.length)
	{
		ks.forEach(name =>
		{
			const version_new = ncuOptions.list_updated[name];

			([
				'dependencies',
				'devDependencies',
				'peerDependencies',
				'optionalDependencies',
			] as IPackageJsonDependenciesField[]).forEach(key =>
			{

				const deps = ncuOptions.json_new[key];

				if (deps)
				{
					const version_old = deps[name];

					if (version_old !== version_new && allowUpdateVersion(version_old))
					{
						list_updated[name] = version_new;
						current[name] = version_old;

						deps[name] = version_new;

						json_changed = true;
					}
				}

			})

		});

	}

	ncuOptions.json_changed = json_changed;
	ncuOptions.list_updated = list_updated;
	ncuOptions.current = current;

	const table = toDependencyTable({
		from: ncuOptions.current,
		to: ncuOptions.list_updated,
	}).toString();

	table && console.log(`\n${table}\n`);

	return ncuOptions;
}

import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import Bluebird from 'bluebird';
import { keyObjectToPackageMap } from '../util';
import semver from 'semver';
import { IYarnLockfileParseObject } from '@yarn-tool/yarnlock/lib/types';
import { parseYarnLockRawV1Root } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { filterResolutions } from '@yarn-tool/yarnlock/lib/core';
import { queryRemoteVersions } from '../remote/queryRemoteVersions';

export function checkResolutionsUpdate(resolutions: IPackageMap,
	yarnlock_old_obj: IYarnLockfileParseObject | string,
	options: Partial<IOptionsNpmCheckUpdates>,
)
{
	return Bluebird.resolve()
		.then(async function ()
		{
			/**
			 * @todo support v2
			 */
			if (typeof yarnlock_old_obj === 'string')
			{
				// @ts-ignore
				yarnlock_old_obj = parseYarnLockRawV1Root(yarnlock_old_obj);
			}

			const result = filterResolutions({
				resolutions,
				// @ts-ignore
			}, yarnlock_old_obj);

			const deps = await queryRemoteVersions(resolutions, options);

			//console.dir(deps);

			const deps2 = keyObjectToPackageMap(deps, true);

			const deps3 = Object.values(deps)
				.reduce(function (a, b)
				{
					a[b.name] = b;

					return a;
				}, {} as Record<string, IVersionCacheMapValue>)
			;

			const yarnlock_new_obj: IYarnLockfileParseObject = {
				// @ts-ignore
				...yarnlock_old_obj,
			};

			const update_list: string[] = [];
			let yarnlock_changed = false;

			Object.entries(result.max)
				.forEach(function ([name, data])
				{
					const _key2 = name + '@' + deps3[name].version_old;

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
								const key = name + '@' + version;

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

									const key = name + '@' + version;

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

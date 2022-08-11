import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import { resolve } from 'bluebird';
import { keyObjectToPackageMap } from '../util';
import { lt } from 'semver';
import { filterResolutions } from '@yarn-tool/yarnlock/lib/core';
import { queryRemoteVersions } from '../remote/queryRemoteVersions';
import {
	EnumDetectYarnLock,
	IYarnLockDataRecord,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockSource,
} from '@yarn-tool/yarnlock-types';
import { _yarnLockParseCore, _yarnLockParseRaw } from '@yarn-tool/yarnlock-parse';
import { yarnLockParsedToRawJSON } from '@yarn-tool/yarnlock-parsed-to-json';
import { ITSExcludeEnumValue } from 'ts-type/lib/helper/record/enum';

export function checkResolutionsUpdate<T extends IYarnLockSource>(resolutions: IPackageMap,
	yarnlock_old_obj: IYarnLockSource | Buffer | string,
	options: Partial<IOptionsNpmCheckUpdates>,
)
{
	return resolve()
		.then(async function ()
		{
			let verType: ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>;

			if (typeof yarnlock_old_obj === 'string' || Buffer.isBuffer(yarnlock_old_obj))
			{
				({ verType, parsed: yarnlock_old_obj } = _yarnLockParseRaw(yarnlock_old_obj));
			}

			const y_old = _yarnLockParseCore({
				verType,
				parsed: yarnlock_old_obj,
			});

			const result = filterResolutions({
				resolutions,
			}, y_old.data);

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

			const data: IYarnLockDataRecord = {
				...y_old.data,
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
					if (data.value.version != null && deps2[name] != null && lt(data.value.version, deps2[name]) && data[_key2] && data[_key2].version != data.value.version)
					{
						Object.keys(result.deps[name])
							.forEach(version =>
							{
								const key = name + '@' + version;

								delete data[key]
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

									data[key] = data.value;
								})
							;

							yarnlock_changed = true;
						}
					}

				})
			;

			const yarnlock_new_obj = yarnLockParsedToRawJSON({
				verType,
				meta: y_old.meta,
				data,
			}) as T

			return {
				verType: verType as ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>,
				yarnlock_old_obj: yarnlock_old_obj as T,
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

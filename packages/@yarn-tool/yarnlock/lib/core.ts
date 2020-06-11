/**
 * Created by user on 2020/6/11.
 */

import { ITSArrayListMaybeReadonly, ITSValueOfArray } from 'ts-type';
import semver from 'semver';
import { IRemoveResolutions, IFilterResolutions, IDependencies, IYarnLockfileParseObject } from './types';
import { stripDepsName } from './util';

export function filterResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
	resolutions?: IDependencies<T>
}, yarnlock: IYarnLockfileParseObject<T>): IFilterResolutions<T>
{
	if (pkg.resolutions)
	{
		return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
			let name = stripDepsName(key)[0];
			return pkg.resolutions[name] != null
		})
	}

	return null;
}

/**
 *
 * @example ```
 let pkg = readPackageJson('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/package.json');

 let y = readYarnLockfile('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/yarn.lock')

 console.dir(removeResolutions(pkg, y), {
	depth: null,
});
 ```
 */
export function removeResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
	resolutions?: IDependencies<T>
}, yarnlock_old: IYarnLockfileParseObject<T>): IRemoveResolutions<T>
{
	let result = filterResolutions(pkg, yarnlock_old);

	return removeResolutionsCore<T>(result, yarnlock_old);
}

export function removeResolutionsCore<T extends ITSArrayListMaybeReadonly<string>>(result: IFilterResolutions<T>,
	yarnlock_old: IYarnLockfileParseObject<T>,
): IRemoveResolutions<T>
{
	// @ts-ignore
	let yarnlock_new: IYarnLockfileParseObject<T> = result.names
		// @ts-ignore
		.reduce(function (a: IYarnLockfileParseObject<T>, b)
		{
			delete a[b];

			return a;
		}, {
			...yarnlock_old,
		});

	let yarnlock_changed = !!result.names.length;

	return {
		/**
		 * 執行前的 yarn.lock
		 */
		yarnlock_old,
		/**
		 * 執行後的 yarn.lock
		 */
		yarnlock_new,
		/**
		 * yarn.lock 是否有變動
		 */
		yarnlock_changed,

		result,
	}
}

export function filterDuplicateYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockfileParseObject<T>)
{
	let fy = exportYarnLock(yarnlock);

	let ks = Object.keys(fy.installed)
		.filter(function (value)
		{
			return fy.installed[value].length > 1
		})
	;

	return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
		let n = stripDepsName<ITSValueOfArray<T>>(key)[0];

		return ks.includes(n)
	});
}

export function exportYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockfileParseObject<T>, filter?: (key: keyof IYarnLockfileParseObject<T>, index: number, array_keys: (keyof IYarnLockfileParseObject<T>)[], yarnlock: IYarnLockfileParseObject<T>) => boolean): IFilterResolutions<T>
{
	let ks = Object.keys(yarnlock);

	if (filter)
	{
		ks = ks
			.filter((value, index, array) => {
				return filter(value, index, array, yarnlock)
			})
	}

	return ks
		.reduce(function (a, k)
		{
			let n = stripDepsName<ITSValueOfArray<T>>(k);

			let name = n[0];
			let key = n[1];

			let data = yarnlock[k];

			// @ts-ignore
			(a.deps[name] = a.deps[name] || {})[key] = data;

			a.installed[name] = a.installed[n[0]] || [];

			if (!a.installed[name].includes(data.version))
			{
				a.installed[name].push(data.version);

				if (a.max[name] != null)
				{
					if (semver.lt(a.max[name].value.version, data.version))
					{
						a.max[name] = {
							key: k,
							value: data,
						};
					}
				}
				else
				{
					a.max[name] = {
						key: k,
						value: data,
					};
				}
			}

			return a;
		}, {
			names: ks,
			deps: {},
			installed: {},
			max: {},
		} as IFilterResolutions<T>)
		;
}

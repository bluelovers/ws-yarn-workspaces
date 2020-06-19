/**
 * Created by user on 2020/6/20.
 */

import { ISortPackageJsonScriptsOptions } from './types';
import handleOptions from './handleOptions';
import { handleKeyOrdersCore } from './handleKeyOrdersCore';
import sortObjectKeys from 'sort-object-keys2';
import { array_unique } from 'array-hyper-unique/core';
import { trimKey } from './util';

/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
export function _core<T extends Record<string, any>>(scripts: T,
	opts: ISortPackageJsonScriptsOptions,
): T
{
	const keys = handleKeyOrdersCore(Object.keys(scripts), opts);

	return sortObjectKeys(scripts, {
		keys,
		sort: opts.sortKeyFn,
	}) as T
}

export function sortPackageJsonScriptsOld<T extends Record<string, any>>(scripts: T,
	opts?: ISortPackageJsonScriptsOptions,
): T
{
	opts = handleOptions(opts)

	return _core(scripts, opts)
}

export function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T,
	opts?: ISortPackageJsonScriptsOptions,
): T
{
	opts = handleOptions(opts);
	const { omitKeyFn, sortKeyFn } = opts;

	scripts = _core(scripts, opts);

	let topMap = Object.keys(scripts)
		.reduce((topMap, full) => {

			let { key, omitted } = omitKeyFn(full)

			topMap[key] = topMap[key] ?? {}

			if (full !== key)
			{
				let i = full.indexOf(key);
				let sub = full.slice(i + key.length)
				let pre = full.slice(0, i)
				let subkey = trimKey(sub)

				topMap[key][subkey] = topMap[key][subkey] || {};
				topMap[key][subkey][pre] = topMap[key][subkey][pre] || {};
				topMap[key][subkey][pre][sub] = full
			}

			return topMap
		}, {} as Record<string, Record<string, Record<string, Record<string, string>>>>)

	let keys = Object.entries(topMap)
		.reduce((a, [key, c]) => {

			a.push(key)

			if (Object.keys(c).length)
			{
				c = sortObjectKeys(c, {
					keys: handleKeyOrdersCore(Object.keys(c), opts),
					sort: sortKeyFn,
				})

				Object.keys(c).forEach(subkey => {

					c[subkey] = sortObjectKeys(c[subkey], {
						keys: handleKeyOrdersCore(Object.keys(c[subkey]), opts),
						sort: sortKeyFn,
					})

					Object.keys(c[subkey]).forEach(pre => {

						c[subkey][pre] = sortObjectKeys(c[subkey][pre], {
							keys: handleKeyOrdersCore(Object.keys(c[subkey][pre]), opts),
							sort: sortKeyFn,
						})

						Object.keys(c[subkey][pre]).forEach(sub => {

							a.push(c[subkey][pre][sub])

						})

					})

				})
			}

			return a
		}, []);

	//keys = array_unique(keys)

	return sortObjectKeys(scripts, {
		keys,
		sort: opts.sortKeyFn,
	}) as T
}

export default sortPackageJsonScripts;

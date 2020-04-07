import sortObjectKeys from 'sort-object-keys2';
import { handleKeyOrdersCore } from './lib/handleKeyOrdersCore';
import handleOptions from './lib/handleOptions';
export type { ISortPackageJsonScriptsOptions } from './lib/types';
import { ISortPackageJsonScriptsOptions } from './lib/types';

/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
export function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T
{
	opts = handleOptions(opts)

	const keys = handleKeyOrdersCore(Object.keys(scripts), opts);

	return sortObjectKeys(scripts, {
		keys,
		sort: opts.sortKeyFn,
	}) as T
}

export default sortPackageJsonScripts

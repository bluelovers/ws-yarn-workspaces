import { IWrapDedupeCache } from '../types';
import { Arguments, Argv } from 'yargs';
import { IWrapDedupeCacheRuntime, IWrapDedupeOptions } from './types';
import { resolve } from 'upath2';
import findRoot from '@yarn-tool/find-root';
import { fsYarnLockSafe as fsYarnLock } from '@yarn-tool/yarnlock-fs/lib/read';

export function handleWrapDedupeOptions<T extends {
	cwd?: string,
	[k: string]: unknown,
}, U extends T | {
	cwd: string,
	[k: string]: unknown,
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>)
{
	let cache: IWrapDedupeCacheRuntime = options.cache as any || {};

	// @ts-ignore
	cache.cwd = cache.cwd || argv.cwd;

	if (!cache.cwd)
	{
		throw new TypeError(`cache.cwd is '${cache.cwd}'`)
	}

	// @ts-ignore
	cache.cwd = resolve(cache.cwd);

	// @ts-ignore
	cache.ret = {};

	cache.yarnlock_msg = undefined;

	// @ts-ignore
	cache.console = cache.console || console;
	// @ts-ignore
	cache.consoleDebug = cache.consoleDebug || options.consoleDebug;

	// @ts-ignore
	cache.rootData = cache.rootData || findRoot({
		...argv,
		cwd: cache.cwd,
	}, true);

	// @ts-ignore
	cache.yarnlock_cache = cache.yarnlock_cache || fsYarnLock(cache.rootData.root);

	// @ts-ignore
	cache.yarnlock_old = cache.yarnlock_cache.yarnlock_old;

	cache.yarnlock_old2 = cache.yarnlock_old;

	// @ts-ignore
	cache.yarnlock_old_exists = cache.yarnlock_cache.yarnlock_exists;

	return {
		options,
		cache,
	}
}

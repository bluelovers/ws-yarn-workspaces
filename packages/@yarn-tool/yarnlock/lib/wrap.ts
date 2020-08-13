/**
 * Created by user on 2020/6/12.
 */
import findRoot from '@yarn-tool/find-root';
import { Console2 } from 'debug-color2';
import { Argv, Arguments } from 'yargs';
import { resolve } from 'upath2';
import { yarnDedupe } from './dedupe';
import { yarnLockDiff } from './diff';
import { writeFileSync, readFileSync } from 'fs-extra';
import { ITSWriteableWith, ITSWriteablePick } from 'ts-type';
import { IWrapDedupeReturnType, IWrapDedupeCache, IInfoFromDedupeCacheReturnType } from './types';
import { fsYarnLock } from '@yarn-tool/yarnlock-fs/lib/read';

interface IWrapDedupeCacheRuntime extends Omit<ITSWriteableWith<IWrapDedupeCache, 'cwd' | 'rootData' | 'yarnlock_old' | 'yarnlock_old_exists' | 'ret' | 'consoleDebug' | 'console'>, 'ret'>
{
	ret: ITSWriteablePick<IWrapDedupeCache["ret"]>
}

export function wrapDedupe<T extends {
	cwd?: string,
	[k: string]: unknown,
}, U extends T | {
	cwd: string,
	[k: string]: unknown,
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: {

	/**
	 * 如果初始化沒有發生錯誤 此步驟必定執行
	 */
	init?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 於 第一次 Dedupe 前的步驟
	 */
	before?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 此步驟為必要選項
	 */
	main(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 於 第二次 Dedupe 後的步驟
	 */
	after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 於 第二次 Dedupe 後的步驟
	 */
	after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 如果結束前沒有發生錯誤 此步驟必定執行
	 */
	end?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void,

	/**
	 * 步驟間共享的緩存資訊並且會影響部分行為
	 */
	cache?: Partial<C>

	consoleDebug: Console2,
}): IWrapDedupeReturnType<T, U, C>
{
	const { consoleDebug } = options;


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
	cache.consoleDebug = cache.consoleDebug || consoleDebug;

	let { init, before, main, after, end } = options;

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

	LABEL1: {

		// @ts-ignore
		cache.ret.init = init ? !!init(yarg, argv, cache) : null;

		if (cache.ret.init)
		{
			break LABEL1;
		}

		// @ts-ignore
		cache.ret.before = before ? !!before(yarg, argv, cache) : null;
		if (cache.ret.before)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLock(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			let ret1 = yarnDedupe(cache.yarnlock_cache.yarnlock_old);

			if (ret1.yarnlock_changed)
			{
				writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);

				let msg = yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}

				cache.yarnlock_changed = true;

				cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;

				consoleDebug?.info(`Deduplication yarn.lock`);
				consoleDebug?.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
			}
		}

		// @ts-ignore
		cache.ret.main = !!main(yarg, argv, cache);
		if (cache.ret.main)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLock(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			let ret1 = yarnDedupe(cache.yarnlock_cache.yarnlock_old);

			if (ret1.yarnlock_changed)
			{
				if (cache.yarnlock_old2 == null)
				{
					cache.yarnlock_old2 = ret1.yarnlock_old;
				}

				writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);

				let msg = yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}

				cache.yarnlock_changed = true;

				cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;

				consoleDebug?.info(`Deduplication yarn.lock`);
				consoleDebug?.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
			}
			else if (cache.yarnlock_changed == null)
			{
				cache.yarnlock_changed = ret1.yarnlock_changed;
			}
		}

		if (cache.yarnlock_changed)
		{
			if (!cache.yarnlock_cache.yarnlock_exists || !cache.yarnlock_old || cache.yarnlock_old == cache.yarnlock_cache.yarnlock_old)
			{
				cache.yarnlock_changed = false;
			}
		}

		// @ts-ignore
		cache.ret.after = after ? !!after(yarg, argv, cache) : null;
		if (cache.ret.after)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLock(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			if (cache.yarnlock_changed)
			{
				let msg = yarnLockDiff(cache.yarnlock_old || cache.yarnlock_old2, cache.yarnlock_cache.yarnlock_old);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}
			}
			else
			{
				let yarnlock_now = readFileSync(cache.yarnlock_cache.yarnlock_file).toString();
				let yarnlock_old2 = cache.yarnlock_old || cache.yarnlock_old2;

				if (yarnlock_old2)
				{
					let msg = yarnLockDiff(yarnlock_old2, yarnlock_now);

					if (msg)
					{
						cache.yarnlock_msg = msg;

						cache.yarnlock_changed = true;
					}
				}
			}
		}
	}

	// @ts-ignore
	cache.ret.end = end ? !!end(yarg, argv, cache) : null;

	return {
		cwd: cache.cwd,
		rootData: cache.rootData,
		yarg,
		argv,
		// @ts-ignore
		cache,
	}
}

export function infoFromDedupeCache(cache: IWrapDedupeCache): IInfoFromDedupeCacheReturnType
{
	let { yarnlock_changed, yarnlock_old_exists } = cache;

	let { yarnlock_file, yarnlock_exists } = cache.yarnlock_cache;

	return {
		...cache.rootData,
		yarnlock_file,
		yarnlock_old_exists,
		yarnlock_exists,
		yarnlock_changed,
	};
}


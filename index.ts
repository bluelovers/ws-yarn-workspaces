import { findPkgPath, ObjectFreezeAll, spawn_stdout } from './lib/util';
import fs = require('fs-extra');
import hashSum = require('hash-sum');
import os = require('os');
import path = require('path');
import bluebird = require('bluebird');

/**
 * fn[] of any function return a string
 * stop when get first return
 */
export const defaultOrder = [
	findPkgModulePath,
	findNpmCachePath,
	os.tmpdir,
];

/**
 * a base dir name at cache root
 */
export const defaultBase = '.cache';

export interface IOptions
{
	/**
	 * a base dir name at cache root
	 */
	base?: string,
	/**
	 * name of cache
	 */
	name?: string,

	cwd?: string,

	/**
	 * fn[] of any function return a string
	 * stop when get first return
	 */
	fnOrder?: Array<((cwd?: string) => string) | ((cwd?: string) => any)>,

	/**
	 * auto create dir if not exists
	 */
	create?: boolean,
	/**
	 * return a function
	 */
	thunk?: boolean,

	/**
	 * hash dir name, make sure it is unique
	 */
	hash?: boolean | ((input: string) => string),

	/**
	 * only work with fnOrder is set
	 *
	 * if true will not use defaultOrder when didn't get value from fnOrder
	 */
	disableDefaultFailback?: boolean,
}

export type ICachePathThunk = ((p1?: string, ...args: string[]) => string);

export function getCachePath(options?: IOptions & {
	thunk: true,
}): ICachePathThunk
// @ts-ignore
export function getCachePath(name: string, options?: IOptions & {
	thunk: true,
}): ICachePathThunk
export function getCachePath(name: string, options?: IOptions): string
export function getCachePath(options?: IOptions): string
export function getCachePath(options?: IOptions, opt?)
{
	if (typeof options === 'string')
	{
		options = {
			...opt,
			name: options,
		}
	}
	options = options || {};

	let root = getCacheRoot(options);
	let base = options.base || defaultBase;
	let name = options.name;

	let dir: string;

	if (name)
	{
		name = normalizeName(name, options.hash);

		dir = path.join(root, base, name);
	}
	else
	{
		dir = path.join(root, base);
	}

	if (options.create)
	{
		fs.ensureDirSync(dir);
	}

	if (options.thunk)
	{
		// @ts-ignore
		let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

		// @ts-ignore
		fn.dir = dir;

		return fn;
	}

	return dir;
}

export function getCachePathAsync(options?: IOptions & {
	thunk: true,
}): bluebird<ICachePathThunk>
// @ts-ignore
export function getCachePathAsync(name: string, options?: IOptions & {
	thunk: true,
}): bluebird<ICachePathThunk>
export function getCachePathAsync(name: string, options?: IOptions): bluebird<string>
export function getCachePathAsync(options?: IOptions): bluebird<string>
export function getCachePathAsync(options?: IOptions, opt?)
{
	return bluebird.resolve()
		.then(async function ()
		{
			if (typeof options === 'string')
			{
				options = {
					...opt,
					name: options,
				}
			}
			options = options || {};

			let root = await getCacheRootAsync(options);
			let base = options.base || defaultBase;
			let name = options.name;

			let dir: string;

			if (name)
			{
				name = normalizeName(name, options.hash);

				dir = path.join(root, base, name);
			}
			else
			{
				dir = path.join(root, base);
			}

			if (options.create)
			{
				await fs.ensureDir(dir);
			}

			if (options.thunk)
			{
				// @ts-ignore
				let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

				// @ts-ignore
				fn.dir = dir;

				return fn;
			}

			return dir;
		})
	;
}

/**
 * normalize cache name
 */
export function normalizeName(name: string, hash?: IOptions["hash"]): string
{
	if (hash)
	{
		if (typeof hash === 'function')
		{
			return hash(name)
		}

		return hashSum(name);
	}

	return name
		.trim()
		.replace(/[^\w]/g, '_')
		.replace(/_+/g, '_')
		;
}

export function getCacheRoot(name: string): string
export function getCacheRoot(options?: IOptions | string): string
export function getCacheRoot(options?: IOptions | string): string
{
	if (typeof options === 'string')
	{
		options = {
			cwd: options,
		}
	}

	options = options || {};

	let cwd = options.cwd || process.cwd();
	let fnOrder = options.fnOrder || defaultOrder;

	if (!options.disableDefaultFailback && options.fnOrder && fnOrder != defaultOrder)
	{
		fnOrder = fnOrder.concat(defaultOrder);
	}

	let dir: string;

	fnOrder.some(function (fn)
	{
		// @ts-ignore
		dir = fn(cwd);

		let bool = !!dir;

		if (bool && typeof dir !== 'string')
		{
			throw new TypeError(`expect string but got '${typeof dir}', ${dir}`)
		}

		return bool;
	});

	if (!dir)
	{
		throw new Error(`can't found cache path`)
	}
	else if (typeof dir != 'string' || !fs.existsSync(dir))
	{
		throw new Error(`path not exists '${dir}'`)
	}

	return path.resolve(dir)
}

export function getCacheRootAsync(name: string): bluebird<string>
export function getCacheRootAsync(options?: IOptions | string): bluebird<string>
export function getCacheRootAsync(options?: IOptions | string): bluebird<string>
{
	return bluebird.resolve()
		.then(async function ()
		{
			if (typeof options === 'string')
			{
				options = {
					cwd: options,
				}
			}

			options = options || {};

			let cwd = options.cwd || process.cwd();
			let fnOrder = options.fnOrder || defaultOrder;

			if (!options.disableDefaultFailback && options.fnOrder && fnOrder != defaultOrder)
			{
				fnOrder = fnOrder.concat(defaultOrder);
			}

			let dir: string;

			for (let fn of fnOrder)
			{
				dir = await fn(cwd);

				if (dir)
				{
					if (typeof dir !== 'string')
					{
						throw new TypeError(`expect string but got '${typeof dir}', ${dir}`)
					}

					break;
				}
			}

			if (!dir)
			{
				throw new Error(`can't found cache path`)
			}
			else if (!fs.existsSync(dir))
			{
				throw new Error(`path not exists '${dir}'`)
			}

			return path.resolve(dir)
		})
	;
}

/**
 * get os temp dir
 */
export function getOSTempPath(cwd?: string): string
{
	return os.tmpdir();
}

/**
 * try get a pkg/node_modules
 */
export function findPkgModulePath(cwd?: string): string
{
	let dir = findPkgPath(cwd);
	return path.join(dir, 'node_modules');
}

/**
 * try get npm global cache path
 */
export function findNpmCachePath(cwd?: string): string
{
	let cache = spawn_stdout('npm', [
		'config', 'get', 'cache',
	]);

	if (!cache || !cache.length)
	{
		cache = spawn_stdout('yarn', [
			'config', 'get', 'cache',
		]);
	}

	if (!cache)
	{
		return null;
	}

	if (!fs.existsSync(cache))
	{
		throw new Error(`path not exists '${cache}'`)
	}

	return cache;
}

export default getCachePath

// @ts-ignore
exports = ObjectFreezeAll(exports);


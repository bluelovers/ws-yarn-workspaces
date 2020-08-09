import { IOptions, ICachePathThunk } from './types';
import { getCacheRoot, getCacheRootAsync } from './getCacheRoot';
import { normalizeName } from './normalizeName';
import path, { join } from "upath2";
import { ensureDirSync, ensureDir } from 'fs-extra';
import Bluebird from 'bluebird';
import { dirSync, dir as dirCB } from 'tmp';

/**
 * a base dir name at cache root
 */
export const defaultBase = '.cache';

export function getCachePath(options: IOptions & {
	thunk: true,
}): ICachePathThunk
// @ts-ignore
export function getCachePath(name: string, options: IOptions & {
	thunk: true,
}): ICachePathThunk
export function getCachePath(name: string, options?: IOptions): string
export function getCachePath(options?: IOptions): string
export function getCachePath(_options: IOptions, opt?)
{
	let options: IOptions;

	if (typeof _options === 'string')
	{
		options = {
			...opt,
			name: _options,
		}
	}

	options ??= {};

	let root = getCacheRoot(options);

	let { base = defaultBase } = options;
	let { name } = options;

	let tmpdir = join(root, base);

	//ensureDirSync(tmpdir);

	let dir: string;

	if (name?.length)
	{
		name = normalizeName(name, options.hash);

		dir = join(tmpdir, name)
	}
	else if (!options.randomIfNoName)
	{
		dir = tmpdir;
	}
	else
	{
		name = void 0;

		dir = dirSync({
			...options,
			tmpdir,
			//keep: true,
			name,
		}).name;
	}

	if (options.create)
	{
		ensureDirSync(dir);
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

export function getCachePathAsync(options: IOptions & {
	thunk: true,
}): Bluebird<ICachePathThunk>
// @ts-ignore
export function getCachePathAsync(name: string, options: IOptions & {
	thunk: true,
}): Bluebird<ICachePathThunk>
export function getCachePathAsync(name: string, options?: IOptions): Bluebird<string>
export function getCachePathAsync(options?: IOptions): Bluebird<string>
export function getCachePathAsync(options: IOptions, opt?)
{
	return Bluebird.resolve()
		.then(async function ()
		{
			if (typeof options === 'string')
			{
				options = {
					...opt,
					name: options,
				}
			}

			options ??= {};

			let root = await getCacheRootAsync(options);

			let { base = defaultBase } = options;
			let { name } = options;

			let tmpdir = join(root, base);

			let dir: string;

			if (name?.length)
			{
				name = normalizeName(name, options.hash);

				dir = join(tmpdir, name)
			}
			else if (!options.randomIfNoName)
			{
				dir = tmpdir;
			}
			else
			{
				name = void 0;

				dir = await new Bluebird((resolve, reject) =>
				{
					dirCB({
						...options,
						tmpdir,
						//keep: true,
						name,
					}, (err, ret) =>
					{

						if (err)
						{
							reject(err)
						}
						else
						{
							resolve(ret)
						}
					})
				}).then(ret =>
				{
					return ret as string
				})
			}

			if (options.create)
			{
				await ensureDir(dir);
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



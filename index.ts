import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';
import CrossSpawn = require('cross-spawn');
import fs = require('fs-extra');
import stripAnsi = require('strip-ansi');
import pkgDir = require('pkg-dir');
import path = require('path');
import os = require('os');
import hashSum = require('hash-sum');

const defaultOrder = [
	findPkgModulePath,
	findNpmCachePath,
	os.tmpdir,
];

const defaultBase = '.cache';

export interface IOptions
{
	base?: string,
	name?: string,

	cwd?: string,
	fnOrder?: Array<(cwd?: string) => string>,

	create?: boolean,
	thunk?: boolean,

	hash?: boolean | ((input: string) => string),
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

	let dir: string;

	fnOrder.some(function (fn)
	{
		dir = fn(cwd);

		return !!dir;
	});

	if (!dir)
	{
		throw new Error(`can't found cache path`)
	}
	else if (!fs.existsSync(dir))
	{
		throw new Error(`path not exists '${dir}'`)
	}

	return path.resolve(dir)
}

export function getOSTempPath(cwd?: string): string
{
	return os.tmpdir();
}

export function findPkgModulePath(cwd?: string): string
{
	let dir = findPkgPath(cwd);
	return path.join(dir, 'node_modules');
}

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

export function findPkgPath(cwd?: string): string
{
	let dir = cwd || process.cwd();
	return pkgDir.sync(dir);
}

export function spawn_stdout(bin: string, argv: string[] = [], options?: SpawnSyncOptionsWithBufferEncoding): string
{
	let stdout = CrossSpawn.sync(bin, argv, options).stdout;

	return stripAnsi(stdout.toString().replace(/^\s+|\s+$/, ''))
}

export default getCachePath

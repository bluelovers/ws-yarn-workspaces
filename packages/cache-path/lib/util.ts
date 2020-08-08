import { SpawnSyncOptionsWithBufferEncoding } from "child_process";
import CrossSpawn = require('cross-spawn');
import pkgDir = require('pkg-dir');
import stripAnsi from 'strip-ansi';

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

export function ObjectFreezeAll<T>(obj: T)
{
	let ret = Object.freeze(obj);

	Object.keys(ret)
		.forEach(function (key)
		{
			let type = typeof ret[key];

			if (type === 'object' || type === 'function')
			{
				Object.freeze(ret[key])
			}
		})
	;

	return ret;
}

export default exports as typeof import('./util');

// @ts-ignore
exports = ObjectFreezeAll(exports);

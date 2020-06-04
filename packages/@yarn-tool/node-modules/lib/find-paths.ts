/**
 * Created by user on 2020/6/5.
 */

import pkgDir from 'pkg-dir';
import { dirname, resolve } from 'upath2';
import fg from '@bluelovers/fast-glob';
import { getModulesDir } from './util';

export function findModulesPackagePathsCore(cwd: string, dir?: string)
{
	let root = getModulesDir(cwd, dir);

	let modules = fg.sync<string>([
			'@*/*/package.json',
			'*/package.json',
		], {
			cwd: root,
		})
		.map(name =>
		{
			let dir = resolve(root, name)

			return {
				name: dirname(name),
				location: dirname(dir),
			}
		})
	;

	return {
		cwd,
		modules,
	}
}

export function findModulesPackagePaths(cwd?: string, dir?: string)
{
	cwd = resolve(pkgDir.sync(cwd ?? process.cwd()));

	return findModulesPackagePathsCore(cwd, dir)
}

export default findModulesPackagePaths

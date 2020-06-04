/**
 * Created by user on 2020/6/5.
 */

import pkgDir from 'pkg-dir';
import { join, dirname, resolve } from 'upath2';
import fg from '@bluelovers/fast-glob';

export function findModulesPackagePathsCore(cwd: string, dir?: string)
{
	let root = join(cwd, dir ?? 'node_modules');

	let modules = fg.sync<string>([
			'@*/*/package.json',
			'*/package.json',
		], {
			cwd: root,
		})
		.map(name =>
		{
			return {
				name: dirname(name),
				location: resolve(root, name),
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

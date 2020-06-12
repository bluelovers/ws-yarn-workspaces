/**
 * Created by user on 2020/6/13.
 */

import { readPackageJson } from '@ts-type/package-dts';
import { join } from 'upath2';
import { checkPkgJson } from './core';

export function checkPkgDir(pkgDir: string = process.cwd())
{
	const pkg = readPackageJson(join(pkgDir, 'package.json'));

	const result = checkPkgJson(pkg, pkgDir)

	return {
		name: pkg.name,
		pkg,
		pkgDir,
		result,
		valid: result.every(r => r.hasShebang),
	}
}

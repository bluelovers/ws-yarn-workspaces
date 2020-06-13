/**
 * Created by user on 2020/6/5.
 */

import IPackageJson from '@ts-type/package-dts';
import { resolve, join } from "upath2";
import { readFileSync } from "fs-extra";
import { IReadPackage, IReadedPackages } from './types';

export function readPackages<T = IPackageJson>(ls: string[], cwd?: string)
{
	cwd = cwd || process.cwd();

	return ls.reduce(function (a, p)
	{
		let pp = resolve(cwd, p);
		let f = join(pp, 'package.json');

		let pkg = JSON.parse(readFileSync(f).toString());

		a[pkg.name] = {
			name: pkg.name,
			path: p,
			fullpath: pp,
			config: pkg,
		};

		return a;
	}, {} as IReadedPackages<T>);
}

export default readPackages

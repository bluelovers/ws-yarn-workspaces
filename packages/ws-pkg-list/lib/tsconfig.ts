/**
 * Created by user on 2020/6/5.
 */

import { readPackages } from './readpkg';
import { array_unique } from 'array-hyper-unique';
import { join } from "upath2";
import workspacesPackagesList from './listpkg';

export function tsConfigPaths(cwd?: string): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string[]): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: ReturnType<typeof workspacesPackagesList>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string | string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
{
	let cwd: string;

	if (typeof ls == 'string')
	{
		cwd = ls;

		ls = workspacesPackagesList(cwd);
	}

	if (typeof ls[0] == 'string')
	{
		ls = readPackages(ls as string[], cwd)
	}

	return Object.values(ls).reduce(function (a, v)
	{
		if (v.path !== '.' && v.path !== '')
		{
			a[v.name + '/*'] = array_unique([
				join(v.path, '*'),
				join(v.fullpath, '*'),
			]);
		}
		return a;
	}, {} as {
		[k: string]: string[],
	});
}

export default tsConfigPaths

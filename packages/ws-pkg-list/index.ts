/**
 * Created by user on 2018/6/5/005.
 */

import { parseStaticPackagesPaths, getConfig } from 'workspaces-config';
import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { join, dirname, relative, resolve } from 'path';
import fg from '@bluelovers/fast-glob';
import { readFileSync } from 'fs';
import { array_unique } from 'array-hyper-unique';

export function workspacesPackagesList(absolute?: boolean): string[]
export function workspacesPackagesList(cwd?: string, absolute?: boolean): string[]
export function workspacesPackagesList(cwd?, absolute?: boolean): string[]
{
	if (typeof cwd === 'boolean')
	{
		// @ts-ignore
		[cwd, absolute] = [null, cwd];
	}

	cwd = cwd || process.cwd();

	let not_absolute = absolute === false;

	let root = findWorkspaceRoot(cwd);

	let ps = getConfig(root).packages.map(function (v)
	{
		return join(v, 'package.json')
	});

	return fg.sync(ps, {
		cwd: root,
		absolute: true,
	}).map(function (v: string)
	{
		let p = dirname(v);

		if (not_absolute)
		{
			p = relative(cwd, p);

			if (p == '')
			{
				p = '.';
			}
		}

		return p;
	});
}

export type IReadPackage<T = unknown> =
{
	name: string;
	path: string;
	fullpath: string;
	config: {
		name: string;
		version: string;
		[k: string]: unknown;
	} & T;
}

export function readPackages<T = unknown>(ls: string[], cwd?: string)
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
	}, {} as {
		[k: string]: IReadPackage<T>,
	});
}

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

export default workspacesPackagesList;

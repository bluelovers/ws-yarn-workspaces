/**
 * Created by user on 2018/5/14/014.
 */

import findPkg from 'find-pkg-ws';
import { readJSONSync } from 'fs-extra';
import { join, posix } from 'path';

export type WorkspacesConfig = {
	packages?: WorkspacesConfigArray,
	nohoist?: Array<string>,
};

export type WorkspacesConfigArray = Array<string>;

export function getConfig(cwd?: string)
{
	let file = findPkg(cwd);

	if (!file)
	{
		throw new RangeError();
	}

	let pkg = readJSONSync(file);

	return parseWorkspaces(pkg.workspaces);
}

export function parseWorkspaces(workspaces: WorkspacesConfig | WorkspacesConfigArray)
{
	let ws = Array.isArray(workspaces) ? {
		packages: workspaces,
	}: workspaces;

	return ws as WorkspacesConfig;
}

export function parseStaticPackagesPaths(workspaces: WorkspacesConfig | WorkspacesConfigArray)
{
	workspaces = parseWorkspaces(workspaces);

	return (workspaces.packages || [])
		.reduce(function (a, row)
		{
			let b: string[] = [];

			let ls = row.split(/[\\\/]/);

			ls
				.every(function (v)
				{
					let bool = /^@?[\w\-]+$/.test(v);

					if (bool)
					{
						b.push(v);
					}

					return bool;
				})
			;

			if (b.length)
			{
				if (b.length != ls.length)
				{
					a.prefixRoot.push(b[0]);
					a.prefix.push(posix.join(...b));

					let p = posix.join(...b.slice(1));

					a.prefixSub.push(p === '.' ? '' : p);
				}
				else
				{
					a.static.push(posix.join(...b));
				}
			}

			a.all.push(row);

			return a;
		}, {
			static: [] as string[],
			prefixRoot: [] as string[],
			prefix: [] as string[],
			prefixSub: [] as string[],

			all: [] as string[],
		})
	;
}

export { findPkg }

export default getConfig



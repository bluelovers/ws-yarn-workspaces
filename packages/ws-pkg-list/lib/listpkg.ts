/**
 * Created by user on 2020/6/5.
 */

import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { getConfig } from 'workspaces-config';
import { join, dirname, relative } from "upath2";
import fg from '@bluelovers/fast-glob';

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

export default workspacesPackagesList;

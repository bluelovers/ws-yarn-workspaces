import { relative, normalize as pathNormalize } from 'upath2';
import { extractWorkspaces, isMatchWorkspaces, readPackageJSON, findWorkspaceRoot as findYarnWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { readPackageJson } from '@ts-type/package-dts';

import { sync as pkgDir } from 'pkg-dir';

export function findRoot(options: {
	cwd: string,
	skipCheckWorkspace?: boolean | string,
	throwError?: boolean,
}, _throwError?: boolean)
{
	if (!options.cwd)
	{
		throw new TypeError(`options.cwd is '${options.cwd}'`)
	}

	let ws: string;

	if (!options.skipCheckWorkspace)
	{
		ws = findYarnWorkspaceRoot(options.cwd);
	}

	let pkg = pkgDir(options.cwd);

	let { throwError = _throwError } = options;

	if (pkg == null && throwError)
	{
		let err = new TypeError(`can't found package root from target directory '${options.cwd}'`);
		throw err;
	}

	let hasWorkspace = ws && ws != null;
	let isWorkspace = hasWorkspace && pathEqual(ws, pkg);
	let root = hasWorkspace ? ws : pkg;

	return {
		pkg,
		ws,
		hasWorkspace,
		isWorkspace,
		root,
	}
}

export { pathNormalize }

export function pathEqual(a: string, b: string)
{
	return pathNormalize(a) === pathNormalize(b)
}

export function listMatchedPatternByPath(ws: string, pkg: string)
{
	const manifest = readPackageJSON(ws);

	if (!manifest || !manifest.workspaces)
	{
		throw new Error(`not a package.json of yarn workspaces`)
	}

	const workspaces = extractWorkspaces(manifest);

	const relativePath = relative(ws, pkg);

	if (relativePath == '')
	{
		throw new RangeError(`pkg should not same as ws`)
	}

	const { ignores, list } = workspaces.reduce((a, b) => {

		if (b.startsWith('!'))
		{
			a.ignores.push(b);
		}
		else
		{
			a.list.push(b);
		}

		return a;
	}, {
		ignores: [] as string[],
		list: [] as string[],
	});

	return list
		.reduce(function (a, b)
		{
			if (isMatchWorkspaces(relativePath, [
				b,
				...ignores,
			]))
			{
				a.push(b)
			}

			return a;
		}, [] as string[])
	;
}

export default findRoot

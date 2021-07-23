import { relative, normalize as pathNormalize } from 'upath2';
import {
	extractWorkspaces,
	isMatchWorkspaces,
	readPackageJSON,
	findWorkspaceRoot as findYarnWorkspaceRoot,
} from 'find-yarn-workspace-root2/core';
import errcode from 'err-code';

import { sync as pkgDir } from 'pkg-dir';

export interface IFindRootReturnType
{
	pkg: string;
	ws: string;
	hasWorkspace: boolean;
	isWorkspace: boolean;
	root: string;
	isRoot: boolean
}

export interface IFindRootOptions
{
	cwd: string;
	skipCheckWorkspace?: boolean | string;
	throwError?: boolean;

	shouldHasWorkspaces?: boolean;
	shouldNotWorkspacesRoot?: boolean;
}

export function findRootLazy(options?: Partial<IFindRootOptions>, _throwError?: boolean)
{
	options ??= {} as any;
	options.cwd ??= process.cwd();

	return findRoot(options as IFindRootOptions, _throwError)
}

export function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType
{
	if (!options.cwd?.length)
	{
		throw new RangeError(`options.cwd is '${options.cwd}'`)
	}

	let ws: string;

	if (!options.skipCheckWorkspace)
	{
		ws = findYarnWorkspaceRoot(options.cwd);
	}
	else if (options.shouldHasWorkspaces)
	{
		throw errcode(new RangeError(`shouldHasWorkspaces and skipCheckWorkspace should not enable at same time`), {
			options,
		})
	}

	let pkg = pkgDir(options.cwd);

	const { throwError = _throwError } = options;

	if (pkg == null && (throwError || options.shouldHasWorkspaces))
	{
		const err = errcode(new RangeError(`can't found package root from target directory '${options.cwd}'`), {
			options,
		});
		throw err;
	}

	if (typeof ws === 'string')
	{
		ws = pathNormalize(ws);
	}

	if (typeof pkg === 'string')
	{
		pkg = pathNormalize(pkg);
	}

	const hasWorkspace = ws?.length > 0;
	const isWorkspace = hasWorkspace && pathEqual(ws, pkg);
	const root = hasWorkspace ? ws : pkg;
	const isRoot = pathEqual(root, pkg);

	const rootData = {
		pkg,
		ws,
		hasWorkspace,
		isWorkspace,
		root,
		isRoot
	};

	if (options.shouldHasWorkspaces)
	{
		assertHasWorkspaces(rootData);
	}

	if (options.shouldNotWorkspacesRoot)
	{
		assertNotWorkspacesRoot(rootData);
	}

	return rootData
}

export function assertHasWorkspaces<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true
}
{
	if (!rootData.pkg?.length || rootData.hasWorkspace !== true)
	{
		throw errcode(new RangeError(`cwd should inside of workspaces root`), {
			rootData,
		})
	}
}

export function assertNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	isWorkspace: false
}
{
	if (rootData.hasWorkspace === true)
	{
		if (rootData.isWorkspace === true)
		{
			throw errcode(new RangeError(`cwd should not as workspaces root`), {
				rootData,
			})
		}
	}
}

export function assertHasAndNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
	hasWorkspace: true,
	isWorkspace: false,
}
{
	assertHasWorkspaces(rootData)
	assertNotWorkspacesRoot(rootData)
}

export { pathNormalize }

export function pathEqual(a: string, b: string)
{
	if (!a?.length || !b?.length) return null
	return pathNormalize(a) === pathNormalize(b)
}

export function listMatchedPatternByPath(ws: string, pkg: string)
{
	const manifest = readPackageJSON(ws);

	if (!manifest || !manifest.workspaces)
	{
		throw new RangeError(`not a package.json of yarn workspaces`)
	}

	const workspaces = extractWorkspaces(manifest);

	const relativePath = relative(ws, pkg);

	if (relativePath == '')
	{
		throw new RangeError(`pkg should not same as ws`)
	}

	const { ignores, list } = workspaces.reduce((a, b) =>
	{

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

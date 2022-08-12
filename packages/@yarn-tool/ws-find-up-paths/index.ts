import {
	findUpPathsRuntime,
	findUpPathsRuntimeAsync,
	handleOptions as _handleOptions,
	IOptionsFindUpPaths,
	IRuntimeFindUpPaths,
} from 'find-up-paths';
import { findRoot, IFindRootReturnType } from '@yarn-tool/find-root';
import { pathParentsGeneratorRuntime } from 'path-parents';

export interface IOptionsFindUpPathsWorkspaces extends IOptionsFindUpPaths
{
	ignoreCurrentPackage?: boolean,
	startFromCurrentPackage?: boolean,
}

export interface IRuntimeFindUpPathsWorkspaces<OPTS extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces> extends IRuntimeFindUpPaths<OPTS>
{
	rootData: IFindRootReturnType
}

export function handleOptions<T extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces>(cwd?: string | T,
	opts?: T,
): IRuntimeFindUpPathsWorkspaces<IOptionsFindUpPathsWorkspaces & T>
{
	const runtime = _handleOptions(cwd, opts) as IRuntimeFindUpPathsWorkspaces<T>;

	runtime.rootData = findRoot({
		cwd: runtime.cwd,
	});

	runtime.stopPath.push(runtime.rootData.root);

	if (runtime.opts.ignoreCurrentPackage && !runtime.rootData.isWorkspace)
	{
		runtime.cwd = runtime.rootData.pkg;
		runtime.opts.includeCurrentDirectory = false;
	}
	else if (runtime.opts.startFromCurrentPackage)
	{
		runtime.cwd = runtime.rootData.pkg;
	}

	return runtime;
}

export function pathParentsWorkspaces(cwd?: string | IOptionsFindUpPathsWorkspaces,
	opts?: IOptionsFindUpPathsWorkspaces,
)
{
	const runtime = handleOptions(cwd, opts);
	return [...pathParentsGeneratorRuntime(runtime)]
}

export function findUpPathsWorkspaces(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces)
{
	const runtime = handleOptions(opts);

	return findUpPathsRuntime(pattern, runtime)
}

export function findUpPathsWorkspacesAsync(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces)
{
	const runtime = handleOptions(opts);

	return findUpPathsRuntimeAsync(pattern, runtime)
}

export default findUpPathsWorkspaces

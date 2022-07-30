import {
	handleOptions,
	pathParentsGenerator,
	IOptions as IOptionsPathParents
} from 'path-parents';
import { findRoot } from '@yarn-tool/find-root';
import { resolve } from 'upath2';
import { pathIsSame } from 'path-is-same';

export interface IOptions extends IOptionsPathParents
{
	ignoreCurrentDirectory?: boolean;
}

export function* pathUpToWorkspacesGenerator(cwd?: string, options?: IOptions)
{
	cwd = resolve(cwd ?? process.cwd())

	let {
		root,
		isWorkspace,
		hasWorkspace,
	} = findRoot({
		cwd,
	});

	if (!options?.ignoreCurrentDirectory)
	{
		yield cwd
	}

	if (root.length && !pathIsSame(cwd, root))
	{
		for (let current of pathParentsGenerator(cwd, options))
		{
			if (current?.length)
			{
				yield current

				if (pathIsSame(current, root))
				{
					break;
				}
			}
		}
	}
}

export function pathUpToWorkspaces(cwd?: string, options?: IOptions)
{
	return [...pathUpToWorkspacesGenerator(cwd, options)]
}

export default pathUpToWorkspaces

import { handleOptions, pathParentsGenerator } from 'path-parents';
import { findRoot } from '@yarn-tool/find-root';
import { resolve } from 'upath2';
import pathIsSame from 'path-is-same';

export function* pathUpToWorkspacesGenerator(cwd?: string, options?: {
	ignoreCurrentDirectory?: boolean
})
{
	cwd = resolve(cwd ?? process.cwd())

	if (!options?.ignoreCurrentDirectory)
	{
		yield cwd
	}

	let {
		root,
		isWorkspace,
		hasWorkspace,
	} = findRoot({
		cwd,
	});

	if (hasWorkspace && !isWorkspace)
	{
		for (let current of pathParentsGenerator(cwd))
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

export function pathUpToWorkspaces(cwd?: string)
{
	return [...pathUpToWorkspacesGenerator(cwd)]
}

export default pathUpToWorkspaces

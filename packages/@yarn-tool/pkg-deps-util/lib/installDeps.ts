import { IOptionsCheckInstallTarget } from './types';
import { IOptionsInstallDepsFromWorkspaces, installDepsFromWorkspaces } from './installDepsFromWorkspaces';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root/index';

export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces
{

}

export async function filterInstallDeps(packageNames: string[], options: IOptionsInstallDeps = {})
{
	const cwd = options.cwd ??= process.cwd();

	if (!options.skipCheckWorkspace)
	{
		const rootData = findRoot({
			...options,
			cwd,
		})

		if (rootData.hasWorkspace && !rootData.isWorkspace)
		{
			let data = installDepsFromWorkspaces(packageNames, options);

			packageNames = data.others

			return {
				cwd,
				packageNames,
				pkg: data.pkg,
				rootData,
			};
		}
	}

	return {
		cwd,
		packageNames,
	}
}

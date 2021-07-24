import { IOptionsCheckInstallTarget, IOptionsInstallDepsFromWorkspaces } from './types';
import { installDepsFromWorkspaces } from './installDepsFromWorkspaces';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts';

export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces
{

}

export function filterInstallDeps(packageNames: string[], options: IOptionsInstallDeps = {})
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
				pkg: data.pkg as IPackageJson,
				rootData,
				added: data.added,
				exists: data.exists,
				updated: data.updated,
			};
		}
	}

	return {
		cwd,
		packageNames,
	}
}

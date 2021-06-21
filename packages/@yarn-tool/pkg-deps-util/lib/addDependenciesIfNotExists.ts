import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';

export function addDependenciesIfNotExists(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsInstallDepsFromWorkspaces = {},
)
{
	let bool: boolean = null;

	if (options.dev)
	{
		if (!pkg.devDependencies?.[name]?.length)
		{
			pkg.devDependencies ??= {};
			pkg.devDependencies[name] = semver;

			bool = false;
		}
		else if (pkg.devDependencies[name] !== semver)
		{
			bool ??= true;
		}
	}

	if (options.peer)
	{
		if (!pkg.peerDependencies?.[name]?.length)
		{
			pkg.peerDependencies ??= {};
			pkg.peerDependencies[name] = semver;

			bool = false;
		}
		else if (pkg.peerDependencies[name] !== semver)
		{
			bool ??= true;
		}
	}

	if (options.optional)
	{
		if (!pkg.optionalDependencies?.[name]?.length)
		{
			pkg.optionalDependencies ??= {};
			pkg.optionalDependencies[name] = semver;

			bool = false;
		}
		else if (pkg.optionalDependencies[name] !== semver)
		{
			bool ??= true;
		}
	}

	if (bool === null)
	{
		if (!pkg.dependencies?.[name]?.length)
		{
			pkg.dependencies ??= {};
			pkg.dependencies[name] = semver;

			bool = false;
		}
		else if (pkg.dependencies[name] !== semver)
		{
			bool ??= true;
		}
	}

	return {
		pkg,
		bool,
	}
}

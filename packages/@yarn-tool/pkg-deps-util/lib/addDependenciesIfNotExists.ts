import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './types';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';

export function addDependencies(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsInstallDepsFromWorkspaces = {},
	override?: boolean,
)
{
	let bool: boolean = null;

	if (options.dev)
	{
		bool = _add_to_deps_field(pkg,
			'devDependencies',
			name,
			semver,
			override,
			bool,
		);
	}

	if (options.peer)
	{
		bool = _add_to_deps_field(pkg,
			'peerDependencies',
			name,
			semver,
			override,
			bool,
		);
	}

	if (options.optional)
	{
		bool = _add_to_deps_field(pkg,
			'optionalDependencies',
			name,
			semver,
			override,
			bool,
		);
	}

	if (bool === null)
	{
		bool = _add_to_deps_field(pkg,
			'dependencies',
			name,
			semver,
			override,
			bool,
		);
	}

	return {
		pkg,
		bool,
	}
}

export function _add_to_deps_field(pkg: IPackageJson,
	field: IPackageJsonDependenciesField,
	name: string,
	semver: string,
	override: boolean,
	bool: boolean,
)
{
	const record = pkg[field] ?? {};

	if (record[name] !== semver)
	{
		if (!record[name]?.length || override === true)
		{
			pkg[field] ??= {};
			pkg[field][name] = semver;

			bool = false;
		}
		else
		{
			bool ??= true;
		}
	}

	return bool
}

export function addDependenciesIfNotExists(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsInstallDepsFromWorkspaces = {},
)
{
	return addDependencies(pkg, name, semver, options)
}

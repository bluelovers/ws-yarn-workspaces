import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';

export interface IOptionsAddDepsToPackageJson extends Partial<IFindRootOptions>
{
	cwd?: string,
	pkg?: IPackageJson,
	dev?: boolean,
	peer?: boolean,
	optional?: boolean,
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

export function addDependencies(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
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

export function addDependenciesIfNotExists(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
)
{
	return addDependencies(pkg, name, semver, options, false)
}

export function addDependenciesOverwrite(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
)
{
	return addDependencies(pkg, name, semver, options, true)
}

export default addDependencies

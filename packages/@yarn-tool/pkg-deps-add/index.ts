import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';

export const enum EnumResultAddDependencies
{
	changed = 2,
	exists = 1,
}

export interface IOptionsAddDepsToPackageJson extends Partial<IFindRootOptions>
{
	cwd?: string,
	pkg?: IPackageJson,
	dev?: boolean,
	peer?: boolean,
	optional?: boolean,
}

export function _add_to_deps_field_core<T extends IPackageJson>(pkg: T,
	field: IPackageJsonDependenciesField,
	name: string,
	semver: string,
)
{
	pkg[field] ??= {};
	pkg[field][name] = semver;

	return pkg;
}

export function _add_to_deps_field(pkg: IPackageJson,
	field: IPackageJsonDependenciesField,
	name: string,
	semver: string,
	override: boolean,
	bool: EnumResultAddDependencies,
	existsOnly?: boolean,
)
{
	const record = pkg[field] ?? {};
	const current = record[name];

	if (current !== semver)
	{
		const length = current?.length;

		if (existsOnly === true)
		{
			if (length)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}
		else if (existsOnly === false)
		{
			if (!length)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}
		else
		{
			if (!length || override === true)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}

		if (length)
		{
			bool ??= EnumResultAddDependencies.exists;
		}
	}

	return bool
}

export function addDependencies(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
	override?: boolean,
	existsOnly?: boolean,
)
{
	let bool: EnumResultAddDependencies = null;

	if (options.dev)
	{
		bool = _add_to_deps_field(pkg,
			'devDependencies',
			name,
			semver,
			override,
			bool,
			existsOnly,
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
			existsOnly,
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
			existsOnly,
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
			existsOnly,
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

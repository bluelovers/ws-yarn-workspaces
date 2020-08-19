import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root/index';
import errcode from 'err-code';
import { readPackageJson, IPackageJson } from '@ts-type/package-dts/index';
import { packageJsonDependenciesFields } from '@ts-type/package-dts/package-json';
import { join } from 'path';
import npa from '@yarn-tool/npm-package-arg-util/index';
import { IListableRow } from 'ws-pkg-list';
import sortObjectKeys from 'sort-object-keys2/core';

export interface IOptionsInstallDepsFromWorkspaces extends Partial<IFindRootOptions>
{
	cwd?: string,
	pkg?: IPackageJson,
	dev?: boolean,
	peer?: boolean,
	optional?: boolean,
}

export function installDepsFromWorkspaces(packageNames: string[], options: IOptionsInstallDepsFromWorkspaces = {})
{
	const cwd = options.cwd ??= process.cwd();
	options.throwError = true;
	options.skipCheckWorkspace = false;

	const rootData = findRoot({
		...options,
		cwd,
		throwError: true,
		skipCheckWorkspace: false,
	})

	if (rootData.isWorkspace || !rootData.hasWorkspace)
	{
		throw errcode(new RangeError(`cwd should inside of workspaces root`), {
			rootData,
		})
	}

	const pkg = options.pkg ?? readPackageJson(join(rootData.pkg, 'package.json'));

	const record = wsPkgListable(rootData.root)
		.reduce((a, b) =>
		{

			a[b.name] = b;

			return a
		}, {} as Record<string, IListableRow>)
	;

	const added = [] as [name: string, semver: string][];
	const exists = [] as string[];

	const others = packageNames
		.filter(packageName =>
		{

			const result = npa(packageName);
			const { name } = result;
			const row = record[name];

			if (row)
			{
				const semver = `^${row.version}`;
				let bool = true;

				if (options.dev && !pkg.devDependencies?.[name]?.length)
				{
					pkg.devDependencies ??= {};
					pkg.devDependencies[name] = semver;

					bool = false;
				}

				if (options.peer && !pkg.peerDependencies?.[name]?.length)
				{
					pkg.peerDependencies ??= {};
					pkg.peerDependencies[name] = semver;

					bool = false;
				}

				if (options.optional && !pkg.optionalDependencies?.[name]?.length)
				{
					pkg.optionalDependencies ??= {};
					pkg.optionalDependencies[name] = semver;

					bool = false;
				}

				if (bool && !pkg.dependencies?.[name]?.length)
				{
					pkg.dependencies ??= {};
					pkg.dependencies[name] = semver;

					bool = false;
				}

				if (bool === false)
				{
					added.push([name, semver]);
				}
				else
				{
					exists.push(name);
				}

				return false;
			}
			else
			{
				return true
			}
		})
	;

	if (others.length !== packageNames.length)
	{
		let opts = {
			useSource: true,
		};

		sortObjectKeys(pkg.dependencies ?? {}, opts);
		sortObjectKeys(pkg.devDependencies ?? {}, opts);
		sortObjectKeys(pkg.peerDependencies ?? {}, opts);
		sortObjectKeys(pkg.optionalDependencies ?? {}, opts);
	}

	return {
		cwd,
		rootData,
		added,
		exists,
		others,
		pkg,
	}
}

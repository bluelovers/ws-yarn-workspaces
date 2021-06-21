import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { assertHasAndNotWorkspacesRoot, findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson, readPackageJson } from '@ts-type/package-dts';
import { join } from 'path';
import npa from '@yarn-tool/npm-package-arg-util';
import { IListableRow } from 'ws-pkg-list';
import sortObjectKeys from 'sort-object-keys2/core';
import { addDependenciesIfNotExists } from './addDependenciesIfNotExists';

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

	options = {
		...options,
		cwd,
		throwError: true,
		skipCheckWorkspace: false,
		shouldHasWorkspaces: true,
		shouldNotWorkspacesRoot: true,
	};

	const rootData = findRoot(options as Required<IOptionsInstallDepsFromWorkspaces>);

	assertHasAndNotWorkspacesRoot(rootData);

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
				let bool: boolean = addDependenciesIfNotExists(pkg, name, semver, options).bool;

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

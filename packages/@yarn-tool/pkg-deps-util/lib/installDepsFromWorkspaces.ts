import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { assertHasAndNotWorkspacesRoot, findRoot } from '@yarn-tool/find-root';
import { readPackageJson } from '@ts-type/package-dts';
import { join } from 'path';
import npa from '@yarn-tool/npm-package-arg-util';
import { IListableRow } from 'ws-pkg-list';
import { addDependenciesIfNotExists } from './addDependenciesIfNotExists';
import { sortDependencies } from './util/sortDependencies';
import { IOptionsInstallDepsFromWorkspaces } from './types';

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

	const updated = others.length !== packageNames.length;

	if (updated)
	{
		sortDependencies(pkg)
	}

	return {
		cwd,
		rootData,
		added,
		exists,
		others,
		pkg,
		updated,
	}
}

import { IListableRow } from 'ws-pkg-list/lib/types';
import linkToNodeModules, { IOptions } from '@yarn-tool/node-modules-link';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { pathIsSame } from 'path-is-same';
import { getModulesDir } from '@yarn-tool/node-modules/lib/util';
import wsPkgListable from 'ws-pkg-list/lib/listable';

export function _checkOptions(options: Partial<IOptions>, auto?: boolean): asserts options is IOptions
{
	options.shouldHasWorkspaces = true;
	options.skipCheckWorkspace = false;
	options.throwError = true;

	const rootData = findRoot(options as IFindRootOptions);

	if (auto)
	{
		options.cwd = rootData.ws;
	}

	if (!pathIsSame(options.cwd, rootData.ws))
	{
		throw new Error(`cwd not workspace root: ${options.cwd}`)
	}
}

export function rebuildYarnWorkspaceLinksFromPkgListable(listable: IListableRow[], options: Partial<IOptions>)
{
	let { cwd } = options;

	_checkOptions(options);

	const targetNodeModulesPath = getModulesDir(cwd, options.targetNodeModulesName);

	listable.forEach(data =>
	{

		linkToNodeModules({
			cwd,
			name: data.name,
			sourcePackagePath: data.location,
			targetNodeModulesPath,
			overwrite: true,
		});

	});
}

export function rebuildYarnWorkspaceLinks(options?: Partial<IOptions>)
{
	options ??= {} as IOptions;
	options.cwd ??= process.cwd();

	_checkOptions(options, true);

	const listable = wsPkgListable(options.cwd);

	return rebuildYarnWorkspaceLinksFromPkgListable(listable, options)
}

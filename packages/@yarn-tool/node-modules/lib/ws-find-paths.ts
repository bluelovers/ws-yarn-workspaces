/**
 * Created by user on 2020/6/5.
 */
import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import findModulesPackagePaths from './find-paths';
import wsPkgListable from 'ws-pkg-list/lib/listable';
import { IListableRow } from 'ws-pkg-list/lib/types';
import findWorkspaceRoot from 'find-yarn-workspace-root2/core';

export function wsFindPackageHasModulesCore(list: IListableRow[], cwd: string, dir?: string)
{
	return list
		.map(row => {

			let modules = findModulesPackagePaths(row.location, dir).modules

			return {
				...row,
				modules,
			}
		})
		.filter(data => data?.modules?.length)
	;
}

export function wsFindPackageHasModules(cwd?: string, dir?: string)
{
	cwd = findWorkspaceRoot(cwd);

	return wsFindPackageHasModulesCore(wsPkgListable(cwd), cwd, dir)
}

export default wsFindPackageHasModules

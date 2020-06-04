/**
 * Created by user on 2020/6/5.
 */
import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import findModulesPackagePaths from './find-paths';
import wsPkgListable from 'ws-pkg-list/lib/listable';

export function wsFindPackageHasModules(cwd?: string, dir?: string)
{
	return wsPkgListable(cwd)
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

export default wsFindPackageHasModules

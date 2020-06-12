import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import { checkPkgDir } from './pkg';

export function checkWorkspaces(cwd: string = process.cwd())
{
	return workspacesPackagesList(cwd)
		.map(cwd => checkPkgDir(cwd))
	;
}

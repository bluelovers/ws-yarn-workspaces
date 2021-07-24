import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import { checkPkgDir } from './pkg';
import { IPackageJson } from '@ts-type/package-dts';

export function checkWorkspaces(cwd: string = process.cwd())
{
	return workspacesPackagesList(cwd)
		.map(cwd => checkPkgDir(cwd))
	;
}

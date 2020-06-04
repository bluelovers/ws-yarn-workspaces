/**
 * Created by user on 2020/6/5.
 */
import { readPackages } from './readpkg';
import { workspacesPackagesList } from './listpkg';
import { IListableRow, IReadPackage } from './types';
import IPackageJson from '@ts-type/package-dts';

export function wsPkgListableFromReaded<T = IPackageJson>(readed: {
	[k: string]: IReadPackage<T>,
}): IListableRow[]
{
	return Object.values(readed)
		.map((data) => {

			const { name, fullpath: location } = data;
			let { version } = data.config;

			return {
				name,
				version,
				private: !!data.config.private,
				location,
			}
		})
	;
}

export function wsPkgListableFromPaths(paths: string[], cwd?: string): IListableRow[]
{
	cwd = cwd ?? process.cwd();

	return wsPkgListableFromReaded(readPackages(paths, cwd))
}

export function wsPkgListable(cwd?: string)
{
	cwd = cwd ?? process.cwd();
	return wsPkgListableFromPaths(workspacesPackagesList(cwd), cwd)
}

export default wsPkgListable

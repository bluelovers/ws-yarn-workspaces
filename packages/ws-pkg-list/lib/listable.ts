/**
 * Created by user on 2020/6/5.
 */
import { readPackages } from './readpkg';
import { workspacesPackagesList } from './listpkg';
import { IListableRow, IReadPackage, IOptionsPkgListable } from './types';
import IPackageJson from '@ts-type/package-dts';

export function wsPkgListableFromReaded<R extends IListableRow = IListableRow, T = IPackageJson>(readed: {
	[k: string]: IReadPackage<T>,
}, options?: IOptionsPkgListable<R>)
{
	const { handler } = options ?? {};

	return Object.values(readed)
		.map((data) => {

			const { name, fullpath: location } = data;
			let { version } = data.config;

			let row: IListableRow = {
				name,
				version,
				private: !!data.config.private,
				location,
			};

			if (handler)
			{
				row = handler?.(row, data.config as any)

				if (typeof row === 'undefined' || typeof row.name === 'undefined' || typeof row.version === 'undefined' || typeof row.private === 'undefined' || typeof row.location === 'undefined')
				{
					throw new TypeError(`handler return not invalid data`)
				}
			}

			return row
		}) as R[]
	;
}

export function wsPkgListableFromPaths<R extends IListableRow = IListableRow>(paths: string[], cwd?: string, options?: IOptionsPkgListable<R>): IListableRow[]
{
	cwd = cwd ?? process.cwd();

	return wsPkgListableFromReaded(readPackages(paths, cwd), options)
}

export function wsPkgListable<R extends IListableRow = IListableRow>(cwd?: string, options?: IOptionsPkgListable<R>)
{
	cwd = cwd ?? process.cwd();

	return wsPkgListableFromPaths(workspacesPackagesList(cwd), cwd, options)
}

export default wsPkgListable

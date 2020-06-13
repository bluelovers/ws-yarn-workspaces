/**
 * Created by user on 2020/6/13.
 */

import { IListableRowExtra, IOptionsPkgListable, IListableRowWithDeps, IListableRowExtraWithDeps } from './types';
import IPackageJson from '@ts-type/package-dts';
import { normalizeListableRowExtra, listableToRecord } from './util';
import { findRoot } from '@yarn-tool/find-root';
import wsPkgListable from './listable';

export function wsPkgDepsListable<R extends IListableRowExtraWithDeps>(cwd?: string,
	options?: IOptionsPkgListable<R>,
): R[]
{
	cwd = findRoot({
		cwd: cwd ?? process.cwd(),
		throwError: true,
	}).root;

	let _handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
	{
		row.dependencies = pkg.dependencies;
		row.devDependencies = pkg.devDependencies;
		row.optionalDependencies = pkg.optionalDependencies;
		row.peerDependencies = pkg.peerDependencies;

		return row;
	};

	let handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
	{
		return _handler(normalizeListableRowExtra(row, cwd), pkg)
	}

	if (options?.handler)
	{
		let _handler_old = options.handler;
		let _old = handler;

		handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
		{
			return _handler_old(_old(row, pkg), pkg)
		}
	}

	return wsPkgListable<any>(cwd, {
		...options,
		handler,
	}) as any
}

export function wsPkgDepsListableRecord<R extends IListableRowExtraWithDeps>(cwd?: string,
	options?: IOptionsPkgListable<R>,
)
{
	return listableToRecord(wsPkgDepsListable(cwd, options))
}

export default wsPkgDepsListableRecord

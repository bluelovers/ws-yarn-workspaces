import {
	IListableRow,
	IListableRowExtra,
	IOptionsPkgListable,
	normalizeListableRowExtra,
	wsPkgListable,
	wsPkgListableFromPaths,
} from 'ws-pkg-list';
import { IFindRootReturnType } from '@yarn-tool/find-root';

export function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>)
{
	return {
		...normalizeListableRowExtra(argv[0], cwd),
		pkg: argv[1],
	}
}

export type IEntry = ReturnType<typeof _handler>

export function _runEachPackages(list: IEntry[])
{
	return list.slice(0, 1)
		.forEach(row =>
		{

			console.dir(row);

		})
		;
}

export function _initPkgListableByRootData(rootData: Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>)
{
	let cwd = rootData.root;

	if (rootData.hasWorkspace)
	{
		return wsPkgListable(cwd, {
			handler(...argv)
			{
				return _handler(cwd, ...argv)
			},
		})
	}

	return wsPkgListableFromPaths([
		cwd,
	], cwd, {
		handler(...argv)
		{
			return _handler(cwd, ...argv)
		},
	})
}

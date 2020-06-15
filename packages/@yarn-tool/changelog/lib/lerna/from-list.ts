import { IListableRow, wsPkgListableFromPaths } from 'ws-pkg-list';
import { IOptionsWithType, IOptionsUpdateChangelog } from '../types';
import { findRoot } from '@yarn-tool/find-root';
import updateChangelog from './update';
import { defaults } from 'lodash';

export function updateChangelogByCwd(cwd?: string, options?: Partial<IOptionsWithType<IOptionsUpdateChangelog>>)
{
	let rootData = findRoot({
		cwd: cwd ?? process.cwd(),
	})

	if (rootData.hasWorkspace && rootData.isWorkspace)
	{
		throw new Error(`disallow create changelog for workspace root`)
	}

	cwd = rootData.pkg;

	let pkg = wsPkgListableFromPaths([
		rootData.pkg,
	])[0];

	options = {
		...options,
	}

	options = defaults(options ?? {}, {
		rootPath: rootData.root,
	});

	return updateChangelog(pkg, options as any)
		.then(data => {
			return {
				...data,
				cwd,
				rootPath: options.rootPath,
				options,
				pkg,
			}
		})
	;
}

export default updateChangelogByCwd

/**
 * Created by user on 2020/6/11.
 */

import { IOptionsParseVersionsDiff, colorizeDiff } from '@yarn-tool/semver-diff';
import { IDependency } from './types';
import { createDependencyTable } from './core';

export function toDependencyTable(args: {
	from: IDependency,
	to: IDependency,
	options?: IOptionsParseVersionsDiff,
})
{
	const table = createDependencyTable();
	const rows = Object.keys(args.to).map(dep =>
	{
		const from = args.from[dep] || '';
		const to = colorizeDiff(args.from[dep], args.to[dep] || '', args.options as any);
		return [dep, from, '→', to];
	});
	rows.forEach(row => table.push(row as any));
	return table;
}

export default toDependencyTable

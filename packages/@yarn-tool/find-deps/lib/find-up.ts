import { IListableRowExtraWithDeps } from 'ws-pkg-list';
import { packageJsonDependenciesFields } from '@ts-type/package-dts/lib/package-json/types';
import { array_unique_overwrite } from 'array-hyper-unique';
import { findDepsAllDeepRecordCore } from './find';

export function findUpDepsDeepRecordCore<R extends IListableRowExtraWithDeps>(target: string,
	record: Record<string, R>,
	map: Record<string, string[]> = {},
)
{
	if (!record[target] || map[target]?.length)
	{
		return map
	}

	map[target] = map[target] ?? [];

	Object.values(record)
		.reduce((map, row) => {

			let bool = packageJsonDependenciesFields
				.some(field =>
				{
					return row?.[field]?.[target]?.length
				})
			;

			if (bool)
			{
				map[target].push(row.name)

				findUpDepsDeepRecordCore(row.name, record, map)

				map[target].push(...map[row.name])
			}

			return map
		}, map)

	array_unique_overwrite(map[target])

	return map
}

export function findUpDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(targets: string[],
	record: Record<string, R>,
	map: Record<string, string[]> = {},
)
{
	return targets
		.reduce((map, target) => {

			findUpDepsDeepRecordCore(target, record, map)

			return map
		}, map)
}

export function findUpDepsAllDeep<R extends IListableRowExtraWithDeps>(targets: string[],
	record: Record<string, R>
)
{
	let map = findUpDepsAllDeepRecordCore(targets, record)

	let map2 = findDepsAllDeepRecordCore(Object.keys(map), record)

	let list = Object.entries(map)

	list.sort((a, b) => {
		return b[1].length - a[1].length
	})

	list.forEach(a => {

		a[1].sort((a, b) => {
			return (map2[a].length - map2[b].length) || (map[b].length - map[a].length)
		})

	})

	return list
}

export default findUpDepsAllDeep

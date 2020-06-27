import { IListableRowExtra, IListableRowWithDeps, IListableRowExtraWithDeps } from 'ws-pkg-list';
import { packageJsonDependenciesFields } from '@ts-type/package-dts/lib/package-json/types';

export function findDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(names: string[],
	record: Record<string, R>,
	map: Record<string, string[]> = {},
)
{
	return names
		.reduce((map, name) => {
			if (map[name])
			{
				return map
			}

			let list = findDepsDeep(name, record);

			map[name] = map[name] ?? [];

			if (list?.length)
			{
				findDepsAllDeepRecordCore(list, record, map)
			}

			map[name].push(...list);

			return map
		}, map)
	;
}

export function findDepsAllDeep<R extends IListableRowExtraWithDeps>(names: string[], record: Record<string, R>
): [string, string[]][]
{
	let map = findDepsAllDeepRecordCore(names, record)

	let list = Object.entries(map);

	list.sort((a, b) => {
		return (a[1].length - b[1].length)
	})

	list.forEach(a => {

		a[1].sort((a, b) => {
			return (map[a].length - map[b].length)
		})

	})

	return list
}

export function findDepsDeep<R extends IListableRowExtraWithDeps>(name: string,
	record: Record<string, R>,
	list: string[] = [],
)
{
	if (name in record)
	{
		let row = record[name];

		packageJsonDependenciesFields
			.forEach(field =>
			{

				Object.keys(row[field] ?? {})
					.forEach(name2 =>
					{

						if ((name2 in record) && !list.includes(name2) && name2 !== name)
						{
							list.push(name2)

							findDepsDeep(name2, record, list);
						}

					})
				;

			})
		;

	}

	return list
}

export default findDepsAllDeep

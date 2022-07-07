import { wsPkgDepsListable } from 'ws-pkg-list/lib/deps-tree';
import { IListableRow, IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';
import {
	IPackageJsonDependenciesField,
	packageJsonDependenciesFields,
	IDependency,
} from '@ts-type/package-dts/lib/package-json/types';
import { listableToRecord } from 'ws-pkg-list/lib/util';
import { parseRange } from '@lazy-node/semver-simple-parse';
import { replaceSimpleSemVerVersion } from '@lazy-node/semver-simple-parse/lib/replaceSimpleSemVerVersion';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';

export interface IMap<R extends IListableRow>
{
	changed: R[],
	others: R[],
	data: Record<string, string>,
}

export interface ICache<R extends IListableRow = IListableRow>{
	listable?: R[],
	record?: Record<string, R>,
	names?: string[],
	map?: IMap<R>,
}

export type ICacheInput<R extends IListableRow = IListableRow> = ITSRequireAtLeastOne<ICache<R>, 'listable' | 'record'>;

export function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T,
	cache: ICacheInput<R>,
)
{
	const record = cache.record ??= listableToRecord(cache.listable);
	const names = cache.names ??= Object.keys(cache.record);

	const map: IMap<R> = cache.map ??= {} as IMap<R>;

	map.data ??= {};

	let changed: boolean;

	packageJsonDependenciesFields
		.forEach(field =>
		{
			if (row[field])
			{

				names
					.forEach(name =>
					{
						const old = row[field][name];

						if (typeof old !== 'undefined')
						{
							const parsed = parseRange(old);
							const version = record[name].version;

							const semver = replaceSimpleSemVerVersion(parsed[0] as any, version).toFullString();

							if (semver !== old)
							{
								row[field][name] = semver;
								changed = true;
								map.data[name] = version;
							}
						}

					})
				;

			}
		})
	;

	return {
		row,
		map,
		changed,
		cache: cache as ICache<R>,
	}
}

export function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string)
{
	const record = listableToRecord<R>(listable);

	const names = Object.keys(record);

	const result = listable.reduce((map, row) =>
	{
		let changed: boolean;

		({
			changed,
			map,
		} = fixPkgDepsVersionsCore(row, {
			listable,
			record,
			names,
			map,
		}));

		if (changed)
		{
			map.changed.push(row);
		}
		else
		{
			map.others.push(row);
		}

		return map
	}, {
		changed: [],
		others: [],
		data: {},
	} as IMap<R>);

	return {
		cwd,
		listable,
		record,
		names,
		...result,
	}
}

export function fixWsVersions(cwd?: string)
{
	return fixWsVersionsCore(wsPkgDepsListable(cwd), cwd);
}

export default fixWsVersions

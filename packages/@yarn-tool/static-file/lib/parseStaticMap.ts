import {
	IStaticFiles,
	IStaticFilesID,
	IStaticFilesMapArray,
	IStaticFilesMapRecord,
	IStaticFilesMapArrayEntry,
} from './types';

export function parseStaticMap<K extends string>(file_map: IStaticFilesMapArray<K>): IStaticFilesMapArray<K | IStaticFilesID>
export function parseStaticMap<K extends string>(file_map: IStaticFilesMapRecord<K>): IStaticFilesMapArray<K | IStaticFilesID>
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): IStaticFilesMapArray<K | IStaticFilesID>
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): IStaticFilesMapArray<K | IStaticFilesID>
{
	let ls: IStaticFilesMapArray<K>;

	if (Array.isArray(file_map))
	{
		ls = Object.values(file_map)
	}
	else
	{
		// @ts-ignore
		ls = Object.entries(file_map)
	}

	return ls.filter(v => v && Array.isArray(v) && v.length > 1);
}

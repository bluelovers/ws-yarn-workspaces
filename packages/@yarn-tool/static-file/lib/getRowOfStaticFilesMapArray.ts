import {
	IStaticFiles,
	IStaticFilesID,
	IStaticFilesKey,
	IStaticFilesMapArray,
	IStaticFilesMapArrayEntry,
	IStaticFilesMapRecord,
} from './types';
import { parseStaticMap } from './parseStaticMap';

export function getRowOfStaticFilesMapArray<T extends IStaticFiles<string>, K extends IStaticFilesKey<T>>(file_map: T, key: K)
{
	return parseStaticMap(file_map).find(a => a[0] === key) as IStaticFilesMapArrayEntry<K>
}

import { ICopyStaticFilesOptions, IStaticFilesMapArray } from './types';
import { parseStaticMap } from './parseStaticMap';
import { defaultCopyStaticFiles } from './const';
import { getRowOfStaticFilesMapArray } from './getRowOfStaticFilesMapArray';

export function getStaticFile<K extends string>(file_id: K,
	options?: Pick<ICopyStaticFilesOptions<K>, 'file_map'>,
)
{
	return getRowOfStaticFilesMapArray(options?.file_map || defaultCopyStaticFiles, file_id)
}

import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray, IStaticFilesMapArrayEntry } from './types';
import { parseStaticMap } from './parseStaticMap';
import { getRowOfStaticFilesMapArray } from './getRowOfStaticFilesMapArray';
import { replaceTargetOfStaticFilesMapArrayEntry } from './replaceTargetOfStaticFilesMapArrayEntry';
import { array_unique_overwrite } from 'array-hyper-unique';

export function reMapStaticFilesMapArray<T extends IStaticFiles<string>, N extends string>(file_map: T,
	replaceMap: Record<N, IStaticFilesKey<T>>,
)
{
	const ls = parseStaticMap(file_map);
	const arr = (Object.entries(replaceMap) as [N, IStaticFilesKey<T>][])
		.reduce((arr, [targetNew, targetOld]) =>
		{

			let old = getRowOfStaticFilesMapArray(ls, targetOld)

			if (old?.length)
			{
				arr.push(replaceTargetOfStaticFilesMapArrayEntry(old, targetNew))
			}

			return arr
		}, [] as IStaticFilesMapArray<N>)
	;

	return array_unique_overwrite(arr.concat(ls as any)) as IStaticFilesMapArray<IStaticFilesKey<T> | N>
}

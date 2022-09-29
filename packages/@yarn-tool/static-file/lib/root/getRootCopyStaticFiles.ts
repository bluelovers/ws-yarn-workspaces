import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IStaticFilesMapArray } from '../types';
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '../const';

export function getRootCopyStaticFilesAuto(rootData: Pick<IFindRootReturnType, 'isRoot'| 'hasWorkspace'>)
{
	let file_map: IStaticFilesMapArray<string> = [
		...defaultCopyStaticFiles,
	];

	if (rootData.isRoot)
	{
		if (!rootData.hasWorkspace)
		{
			file_map = [
				...file_map,
				...defaultCopyStaticFilesRootOnly,
			];
		}
	}

	return file_map
}

import { IStaticFilesMapArrayEntry } from './types';

export function replaceTargetOfStaticFilesMapArrayEntry<K extends string>(entry: IStaticFilesMapArrayEntry<string>, targetFile: K)
{
	return [targetFile, ...entry.slice(1)] as IStaticFilesMapArrayEntry<K>
}

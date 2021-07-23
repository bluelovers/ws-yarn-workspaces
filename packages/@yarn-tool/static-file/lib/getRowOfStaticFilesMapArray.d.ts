import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArrayEntry } from './types';
export declare function getRowOfStaticFilesMapArray<T extends IStaticFiles<string>, K extends IStaticFilesKey<T>>(file_map: T, key: K): IStaticFilesMapArrayEntry<K>;

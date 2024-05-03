import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray } from './types';
export declare function reMapStaticFilesMapArray<T extends IStaticFiles<string>, N extends string>(file_map: T, replaceMap: Record<N, IStaticFilesKey<T>>): IStaticFilesMapArray<IStaticFilesKey<T> | N>;

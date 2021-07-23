import { IStaticFiles, IStaticFilesID, IStaticFilesMapArray, IStaticFilesMapRecord } from './types';
export declare function parseStaticMap<K extends string>(file_map: IStaticFilesMapArray<K>): IStaticFilesMapArray<K | IStaticFilesID>;
export declare function parseStaticMap<K extends string>(file_map: IStaticFilesMapRecord<K>): IStaticFilesMapArray<K | IStaticFilesID>;
export declare function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): IStaticFilesMapArray<K | IStaticFilesID>;

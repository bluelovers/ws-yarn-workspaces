import { ICopyStaticFilesOptions, IStaticFilesMapArrayEntry } from './types';
export declare function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>): IStaticFilesMapArrayEntry<string | K>[];

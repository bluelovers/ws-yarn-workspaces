import { ICopyStaticFilesOptions } from './types';
export declare function getStaticFile<K extends string>(file_id: K, options?: Pick<ICopyStaticFilesOptions<K>, 'file_map'>): import("./types").IStaticFilesMapArrayEntry<K>;

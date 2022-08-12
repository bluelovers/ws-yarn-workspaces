import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from './const';
export type IStaticFilesID<T = typeof defaultCopyStaticFiles & typeof defaultCopyStaticFilesRootOnly> = T extends ({
    [n: number]: IStaticFilesMapArrayEntry<infer U>;
} | {
    readonly [n: number]: IStaticFilesMapArrayEntry<infer U>;
}) ? U : never;
export type IStaticFilesMapArrayEntry<K extends string> = [
    targetFile: K,
    staticFile: string,
    detectFile?: string
];
export type IStaticFilesMapRecord<K extends string> = {
    [P in K]: string;
};
export type IStaticFilesMapArray<K extends string> = IStaticFilesMapArrayEntry<K>[];
export type IStaticFiles<K extends string> = IStaticFilesMapArray<K> | IStaticFilesMapRecord<K>;
export interface ICopyStaticFilesOptionsBase<K extends string = string> {
    cwd: string;
    staticRoot?: string;
    overwrite?: boolean;
}
export interface ICopyStaticFilesOptions<K extends string = string> extends ICopyStaticFilesOptionsBase<K> {
    file_map?: IStaticFiles<K>;
}
export type IStaticFilesKey<T extends IStaticFiles<string> | readonly any[]> = T extends IStaticFilesMapArray<infer K> ? K : T extends readonly IStaticFilesMapArrayEntry<infer K>[] ? K : T extends IStaticFilesMapRecord<infer K> ? K : _Key<T>;
export type _Key<T> = T extends readonly (infer U)[] | (infer U)[] ? (U extends [infer K, string, string] | readonly [infer K, string, string] ? K : never) : never;

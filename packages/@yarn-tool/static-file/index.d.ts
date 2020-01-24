declare const _defaultCopyStaticFiles: readonly [readonly [".npmignore", "file/npmignore"], readonly [".gitignore", "file/gitignore"], readonly [".eslintignore", "file/eslintignore"], readonly [".nvmrc", "file/nvmrc"], readonly [".browserslistrc", "file/browserslistrc"], readonly ["tsconfig.json.tpl", "file/tsconfig.json.tpl", "tsconfig.json"], readonly ["tsconfig.esm.json.tpl", "file/tsconfig.esm.json.tpl", "tsconfig.esm.json"], readonly [".eslintrc.json.tpl", "file/eslintrc.json.tpl", ".eslintrc.json"], readonly ["README.md", "file/README.md"], readonly [".nycrc", "file/nycrc"]];
export declare type IStaticFilesID<T = typeof _defaultCopyStaticFiles> = T extends ({
    [n: number]: [infer U, string, string?] | readonly [infer U, string, string?];
} | {
    readonly [n: number]: [infer U, string, string?] | readonly [infer U, string, string?];
}) ? U : never;
export declare type IStaticFilesRow<K extends string> = [K, string, string?];
declare type IStaticFilesMap01<K extends string> = {
    [P in K]: IStaticFilesRow<P>;
};
export declare type IStaticFilesMapRecord<K extends string> = {
    [P in K]: string;
};
export declare type IStaticFilesMapArray<K extends string> = IStaticFilesMap01<K>[K][];
export declare type IStaticFiles<K extends string> = IStaticFilesMapArray<K> | IStaticFilesMapRecord<K>;
export declare const defaultCopyStaticFiles: IStaticFilesMapArray<IStaticFilesID>;
export interface ICopyStaticFilesOptionsBase<K extends string = string> {
    cwd: string;
    staticRoot?: string;
    overwrite?: boolean;
}
export interface ICopyStaticFilesOptions<K extends string = string> extends ICopyStaticFilesOptionsBase<K> {
    file_map?: IStaticFiles<K>;
}
export declare function parseStaticMap<K extends string>(file_map: IStaticFilesMapRecord<K>): [K | IStaticFilesID, string, string?][];
export declare function parseStaticMap<K extends string>(file_map: IStaticFilesMapArray<K>): [K | IStaticFilesID, string, string?][];
export declare function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): [K | IStaticFilesID, string, string?][];
export declare function getStaticFile<K extends string>(file_id: K, options?: Pick<ICopyStaticFilesOptions<string>, 'file_map'>): [K, string, string?];
export declare function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>): [".npmignore" | ".gitignore" | ".eslintignore" | ".nvmrc" | ".browserslistrc" | "tsconfig.json.tpl" | "tsconfig.esm.json.tpl" | ".eslintrc.json.tpl" | "README.md" | ".nycrc" | K, string, string?][];
export default copyStaticFiles;

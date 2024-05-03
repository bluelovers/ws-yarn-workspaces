import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { _Key, IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
export declare function updatePackageJson<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>): P;
declare const _defaultCopyStaticFilesTsdx: readonly [readonly ["tsconfig.json", "file/tsconfig.tsdx.json.tpl", "tsconfig.json"], readonly ["test/tsconfig.json", "file/test/tsconfig.json.tpl", "test/tsconfig.json"], readonly ["src/index.cts", "file/tsdx/index.cts"]];
export declare const defaultCopyStaticFilesTsdx: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesTsdx>>;
export interface ISetupTsdxOptions<P extends IPackageJson> {
    targetDir: string;
    pkg: P;
    rootData: IFindRootReturnType;
    file_map: IStaticFilesMapArray<string>;
    mdFile: string;
    existsReadme: boolean;
    oldExists: boolean;
}
export declare function setup<P extends IPackageJson>(config: ISetupTsdxOptions<P>): {
    pkg: P;
    file_map: IStaticFilesMapArray<string>;
    targetDir: string;
    rootData: IFindRootReturnType;
    mdFile: string;
    existsReadme: boolean;
    oldExists: boolean;
};
export {};

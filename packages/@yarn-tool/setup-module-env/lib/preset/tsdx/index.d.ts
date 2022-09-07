import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
export declare function updatePackageJson<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>): P;
export declare const defaultCopyStaticFilesTsdx: IStaticFilesMapArray<"tsconfig.json" | "test/tsconfig.json">;
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

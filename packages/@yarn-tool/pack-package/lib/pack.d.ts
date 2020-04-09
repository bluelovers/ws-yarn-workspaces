/**
 * Created by user on 2020/4/9.
 */
/// <reference types="node" />
import { IPackageJson } from '@ts-type/package-dts';
export declare function packTargetDirectory({ packageDir, packageTarball, }: {
    packageDir: string;
    packageTarball: string;
}): Promise<import("stream").Readable>;
export declare function packTargetPackage(options: {
    pkg?: IPackageJson;
    packageDir: string;
    packageTarball?: string;
    versionPrefix?: string;
}): Promise<{
    pkg: IPackageJson<any>;
    packageDir: string;
    packageTarball: string;
    versionPrefix?: string;
}>;
export default packTargetPackage;

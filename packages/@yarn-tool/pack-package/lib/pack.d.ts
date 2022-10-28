/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
export declare function packlist(options: {
    path: string;
}): Promise<string[]>;
export declare function packTargetDirectory({ packageDir, packageTarball, }: {
    packageDir: string;
    packageTarball: string;
}): Promise<readonly string[]>;
export declare function packTargetPackage(options: {
    pkg?: IPackageJson;
    packageDir: string;
    packageTarball?: string;
    versionPrefix?: string;
}): Promise<{
    pkg: IPackageJson<unknown>;
    packageDir: string;
    packageTarball: string;
    files: readonly string[];
    versionPrefix?: string;
}>;
export default packTargetPackage;

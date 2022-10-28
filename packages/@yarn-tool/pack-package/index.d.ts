/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
import { IPackedTarballInfo } from './lib/types';
export { packTargetPackage } from './lib/pack';
export { printPackedTarballInfo } from './lib/print';
export { getPackedTarballInfo } from './lib/info';
export declare function packPackage(options: {
    pkg?: IPackageJson;
    packageDir: string;
    packageTarball?: string;
    versionPrefix?: string;
}): Promise<Readonly<{
    tarball(): Promise<IPackedTarballInfo>;
    log(): Promise<void>;
    pkg: IPackageJson<unknown>;
    packageDir: string;
    packageTarball: string;
    files: readonly string[];
    versionPrefix?: string;
}>>;
export default packPackage;

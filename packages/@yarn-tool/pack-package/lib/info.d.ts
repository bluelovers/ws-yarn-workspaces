/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
import { IPackedTarballInfo } from './types';
export declare function getPackedTarballInfo(options: {
    pkg: IPackageJson;
    packageTarball: string;
}): Promise<IPackedTarballInfo>;
export default getPackedTarballInfo;

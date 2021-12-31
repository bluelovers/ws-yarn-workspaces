import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonPublishConfig } from '@ts-type/package-dts/lib/package-json/types';
export declare function fixPublishConfig<T extends IPackageJson>(pkg: T): T & {
    publishConfig: IPackageJsonPublishConfig;
};

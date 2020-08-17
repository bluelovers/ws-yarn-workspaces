import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
export declare function checkInstallTargetTypes(packageName: string, options?: {
    excludeVersion?: boolean;
    pkg?: IPackageJson;
    checkExists?: boolean;
}): Promise<{
    name: string;
    target: string;
    error: EnumInstallTypesErrorCode;
    msg: string;
}>;

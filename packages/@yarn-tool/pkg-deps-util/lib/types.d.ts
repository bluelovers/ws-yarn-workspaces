import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
export interface IOptionsCheckInstallTarget {
    excludeVersion?: boolean;
    pkg?: IPackageJson;
    checkExists?: boolean;
}
export interface IReturnTypeCheckInstallTarget {
    name: string;
    target: string;
    error: EnumInstallTypesErrorCode;
    msg: string;
}

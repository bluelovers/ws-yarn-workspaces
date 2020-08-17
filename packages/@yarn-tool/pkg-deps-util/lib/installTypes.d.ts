/// <reference types="bluebird" />
import { AbbreviatedVersion } from 'package-json';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function getPackageInfo(packageName: string | IParsePackageName, excludeVersion?: boolean): import("bluebird")<AbbreviatedVersion>;
export declare const enum EnumInstallTypesErrorCode {
    NOT_EXISTS = 1,
    DEPRECATED = 2,
    SKIP = 3
}
export declare function checkInstallTargetTypes(packageName: string, options?: {
    excludeVersion?: boolean;
    pkg?: IPackageJson;
    checkExists?: boolean;
}): Promise<{
    name: string;
    target: string;
    error: EnumInstallTypesErrorCode;
    msg: string;
} | {
    name: string;
    target: string;
    error?: undefined;
    msg?: undefined;
}>;

import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { IOptionsAddDepsToPackageJson as IOptionsInstallDepsFromWorkspaces } from '@yarn-tool/pkg-deps-add';
export type { IOptionsInstallDepsFromWorkspaces };
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
export interface IOptionsInstallDepsFromQuery extends IOptionsInstallDepsFromWorkspaces {
    queryOptions?: IOptionsQueryVersion<Options>;
}
export interface IOptionsInstallDepsFromYarnLock extends IOptionsInstallDepsFromQuery, IGroupYarnLockParsedEntriesOptions {
}
export declare type IFilteredRecord<T extends Record<string, any>, K extends string> = T extends Record<string, infer U> ? T & Record<K, U> : T;

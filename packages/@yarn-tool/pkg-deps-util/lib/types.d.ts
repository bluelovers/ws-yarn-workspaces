import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
import { IFindRootReturnType } from '@yarn-tool/find-root';
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
export declare type IAddedList = [name: string, semver: string][];
export interface IResultInstallDepsChanged {
    added: IAddedList;
    exists: string[];
    updated: boolean;
}
export interface IResultInstallDepsInfo {
    cwd: string;
    rootData: IFindRootReturnType;
    pkg: IPackageJson;
}
export interface IResultInstallDeps extends IResultInstallDepsChanged, IResultInstallDepsInfo {
    others: string[];
}
export interface IResultFilterInstallDeps extends IResultInstallDepsChanged, IResultInstallDepsInfo {
    packageNames: string[];
}

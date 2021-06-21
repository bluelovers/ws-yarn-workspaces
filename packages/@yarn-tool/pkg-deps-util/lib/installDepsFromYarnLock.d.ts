import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse';
import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersion } from '@yarn-tool/yarnlock-util/lib/types';
export interface IOptionsInstallDepsFromYarnLock extends IOptionsInstallDepsFromWorkspaces, IGroupYarnLockParsedEntriesOptions {
    queryOptions?: IOptionsQueryVersion<Options>;
}
export declare function fetchRemoteInfo<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Bluebird<Record<string, IParsePackageName & {
    versionQuery: string;
}> & Record<T, IParsePackageName & {
    versionQuery: string;
}>>;
export declare type IFilteredRecord<T extends Record<string, any>, K extends string> = T extends Record<string, infer U> ? T & Record<K, U> : T;
export declare function filterDepsFromYarnLock<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions): IComputedPackageEntries<IParseNameAndVersion> & Record<T, [key: string, data: IParseNameAndVersion][]>;
export declare function installDepsFromYarnLockCore<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: [name: string, semver: string][];
    exists: string[];
    others: T[];
    pkg: IPackageJson<any>;
}>;
/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
export declare function installDepsFromYarnLock<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: [name: string, semver: string][];
    exists: string[];
    others: T[];
    pkg: IPackageJson<any>;
}>;

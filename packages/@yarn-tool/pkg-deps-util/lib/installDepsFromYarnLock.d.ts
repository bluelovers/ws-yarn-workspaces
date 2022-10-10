import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util/lib/types';
import { IAddedList, IOptionsInstallDepsFromYarnLock } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export declare function filterDepsFromYarnLock<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions): IComputedPackageEntries<IParseNameAndVersionWithNpaResult> & Record<T, [key: string, data: IParseNameAndVersionWithNpaResult][]>;
export declare function installDepsFromYarnLockCore<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: IAddedList;
    exists: string[];
    others: T[];
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    updated: boolean;
}>;
/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
export declare function installDepsFromYarnLock<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: IAddedList;
    exists: string[];
    others: T[];
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    updated: boolean;
}>;

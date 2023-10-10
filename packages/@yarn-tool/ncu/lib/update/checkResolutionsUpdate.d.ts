/// <reference types="node" />
/// <reference types="bluebird" />
import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import { EnumDetectYarnLock, IYarnLockSource } from '@yarn-tool/yarnlock-types';
import { ITSExcludeEnumValue } from 'ts-type/lib/helper/record/enum';
export declare function checkResolutionsUpdate<T extends IYarnLockSource>(resolutions: IPackageMap, yarnlock_old_obj: IYarnLockSource | Buffer | string, options: Partial<IOptionsNpmCheckUpdates>): import("bluebird")<{
    verType: ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>;
    yarnlock_old_obj: T;
    yarnlock_new_obj: T;
    update_list: string[];
    yarnlock_changed: boolean;
    deps: IVersionCacheMapValue[];
    deps2: IPackageMap;
    deps3: Record<string, IVersionCacheMapValue>;
}>;

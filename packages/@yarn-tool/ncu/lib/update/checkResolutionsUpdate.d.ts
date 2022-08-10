import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import Bluebird from 'bluebird';
import { IYarnLockfileParseObject } from '@yarn-tool/yarnlock/lib/types';
export declare function checkResolutionsUpdate(resolutions: IPackageMap, yarnlock_old_obj: IYarnLockfileParseObject | string, options: Partial<IOptionsNpmCheckUpdates>): Bluebird<{
    yarnlock_old_obj: string | IYarnLockfileParseObject<string[]>;
    yarnlock_new_obj: IYarnLockfileParseObject<string[]>;
    update_list: string[];
    yarnlock_changed: boolean;
    deps: IVersionCacheMapValue[];
    deps2: IPackageMap<string[]>;
    deps3: Record<string, IVersionCacheMapValue>;
}>;

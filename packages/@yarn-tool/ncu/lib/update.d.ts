import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from './types';
import { IYarnLockfileParseObject, IWrapDedupeCache } from '@yarn-tool/yarnlock';
import Bluebird from 'bluebird';
export declare function checkResolutionsUpdate(resolutions: IPackageMap, yarnlock_old_obj: IYarnLockfileParseObject | string, options: Partial<IOptionsNpmCheckUpdates>): Bluebird<{
    yarnlock_old_obj: Record<string, import("@yarn-tool/yarnlock").IYarnLockfileParseObjectRow<string[]>>;
    yarnlock_new_obj: Record<string, import("@yarn-tool/yarnlock").IYarnLockfileParseObjectRow<string[]>>;
    update_list: string[];
    yarnlock_changed: boolean;
    deps: IVersionCacheMapValue[];
    deps2: IPackageMap;
    deps3: Record<string, IVersionCacheMapValue>;
}>;
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: IOptionsNpmCheckUpdates): Promise<IOptionsNpmCheckUpdates>;

/**
 * Created by user on 2020/6/12.
 */
import { IVersionValue } from '@ts-type/package-dts/lib/package-json/types';
import { IVersionCacheMapKey, IVersionCacheMapValue, IPackageMap } from './types';
export declare function isBadVersion(version: IVersionValue): boolean;
export declare function keyObjectToPackageMap(obj: IVersionCacheMapKey[] | IVersionCacheMapValue[], useVarsionNew?: boolean): IPackageMap;

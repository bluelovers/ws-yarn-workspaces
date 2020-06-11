/**
 * Created by user on 2020/6/12.
 */
import { IVersionCacheMapValue, IRomotePackageJsonReturnType, IVersionCacheMapKey } from './types';
export declare const versionCacheMap: Map<string, IVersionCacheMapValue>;
export declare const remoteCacheMap: Map<string, IRomotePackageJsonReturnType>;
export declare function objVersionCache({ name, versionTarget, version_old, }: IVersionCacheMapKey): IVersionCacheMapKey;
export declare function objVersionCacheValue({ name, versionTarget, version_old, version_new, }: IVersionCacheMapValue): IVersionCacheMapValue;
export declare function strVersionCache(key: IVersionCacheMapKey): string;
export declare function hasQueryedVersionCache(key: IVersionCacheMapKey): boolean;
export declare function setVersionCacheMap(data: IVersionCacheMapValue): Map<string, IVersionCacheMapValue>;

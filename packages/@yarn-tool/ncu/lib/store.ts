/**
 * Created by user on 2020/6/12.
 */

import { IVersionCacheMapValue, IRomotePackageJsonReturnType, IVersionCacheMapKey } from './types';

export const versionCacheMap = new Map<string, IVersionCacheMapValue>();

export const remoteCacheMap = new Map<string, IRomotePackageJsonReturnType>();

export function objVersionCache({
	name,
	versionTarget,
	version_old,
}: IVersionCacheMapKey): IVersionCacheMapKey
{
	return {
		name,
		versionTarget,
		version_old,
	};
}

export function objVersionCacheValue({
	name,
	versionTarget,
	version_old,
	version_new,
}: IVersionCacheMapValue): IVersionCacheMapValue
{
	return {
		name,
		versionTarget,
		version_old,
		version_new,
	};
}

export function strVersionCache(key: IVersionCacheMapKey)
{
	return JSON.stringify(objVersionCache(key));
}

export function hasQueryedVersionCache(key: IVersionCacheMapKey)
{
	return versionCacheMap.has(strVersionCache(key))
}

export function setVersionCacheMap(data: IVersionCacheMapValue)
{
	return versionCacheMap.set(strVersionCache(data), objVersionCacheValue(data));
}

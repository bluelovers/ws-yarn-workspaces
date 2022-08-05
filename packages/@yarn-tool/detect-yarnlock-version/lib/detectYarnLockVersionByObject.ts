
import { getMetadataVersion } from './util';
import {
	_detectYarnLockVersionWithMetadataCore,
	detectYarnLockVersionWithMetadata,
} from './detectYarnLockVersionWithMetadata';
import { EnumDetectYarnLock, IYarnLockMetaVersion, IYarnLockVersionSyml } from '@yarn-tool/yarnlock-types';

export function detectYarnLockVersionByObject(yarnLockObject: Record<string, any>)
{
	if (typeof yarnLockObject !== 'object')
	{
		return EnumDetectYarnLock.unknown
	}

	const version = detectYarnLockVersionWithMetadata(yarnLockObject);

	if (version && checkV2(yarnLockObject))
	{
		return version
	}
	else if (typeof yarnLockObject.type === 'string' && yarnLockObject.object && checkV1(yarnLockObject.object))
	{
		return EnumDetectYarnLock.v1
	}
	else if (!('__metadata' in yarnLockObject) && checkV2(yarnLockObject))
	{
		return EnumDetectYarnLock.v3
	}
	else if (!('type' in yarnLockObject) && !('object' in yarnLockObject) && checkV1(yarnLockObject))
	{
		return EnumDetectYarnLock.v1
	}

	return EnumDetectYarnLock.unknown
}

export function _checkV2Row(row: unknown): boolean
{
	// @ts-ignore
	return row.version && row.resolution && row.linkType
}

/**
 * check v2 and v3
 */
export function checkV2(obj)
{
	const { entryKeys: ks, verType, existsEntries, onlyExistsMeta } = _checkExistsMetaCore(obj);

	if (existsEntries)
	{
		const k = ks[0];

		if (_checkV2Row(obj[k]))
		{
			return verType || EnumDetectYarnLock.v3
		}

		return EnumDetectYarnLock.unknown
	}
	/**
	 * ncu 模式時可能會造成只剩下 __metadata
	 * 而其他項目都被移除的狀況
	 * 這時候改用 __metadata 來判斷
	 */
	else if (onlyExistsMeta)
	{
		return verType
	}
}

export function checkV1(obj)
{
	let ks = Object.keys(obj)
		.slice(2)
	;

	let k = ks[0];

	if (ks.length && obj[k].version && obj[k].resolved)
	{
		return EnumDetectYarnLock.v1
	}
}

export function _checkExistsMetaCore(obj: unknown)
{
	const entryKeys = Object.keys(obj)
		.filter(k => k !== '__metadata')
	;

	const metaVersion = getMetadataVersion(obj);

	const emptyEntries = entryKeys.length === 0;
	const existsEntries = entryKeys.length > 0;

	const existsMeta = !!metaVersion;

	const onlyExistsMeta = emptyEntries && existsMeta;

	return {
		verType: _detectYarnLockVersionWithMetadataCore(metaVersion) as IYarnLockVersionSyml | EnumDetectYarnLock.unknown,
		metaVersion,
		existsMeta,
		emptyEntries,
		existsEntries,
		onlyExistsMeta,
		// @ts-ignore
		meta: obj.__metadata as {
			version: IYarnLockMetaVersion,
		},
		entryKeys,
	}
}

export function checkExistsMeta(obj: unknown): obj is {
	__metadata: {
		version: IYarnLockMetaVersion,
	}
}
{
	return _checkExistsMetaCore(obj).onlyExistsMeta
}

export default detectYarnLockVersionByObject

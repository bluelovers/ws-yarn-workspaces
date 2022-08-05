import { getMetadataVersion } from './util';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

export function detectYarnLockVersionWithMetadata(yarnLockObject: Record<string, any>)
{
	const metaVersion = getMetadataVersion(yarnLockObject);

	return _detectYarnLockVersionWithMetadataCore(metaVersion)
}

export function _detectYarnLockVersionWithMetadataCore(metaVersion: string | ReturnType<typeof getMetadataVersion>)
{
	switch (metaVersion)
	{
		case '4':
		case '5':
			return EnumDetectYarnLock.v2
		case '6':
			return EnumDetectYarnLock.v3
		default:
			if (+metaVersion > 6)
			{
				return EnumDetectYarnLock.v3
			}
			else if ((metaVersion as string)?.length)
			{
				return EnumDetectYarnLock.unknown
			}
	}
}

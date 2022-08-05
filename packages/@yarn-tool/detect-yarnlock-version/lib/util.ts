import { IYarnLockMetaVersion } from '@yarn-tool/yarnlock-types';

export function getMetadataVersion(yarnLockObject: Record<string, any>)
{
	return _getMetadataVersionCore(yarnLockObject.__metadata)
}

export function _getMetadataVersionCore(__metadata: Record<string, any>): '4' | '5' | '6' | IYarnLockMetaVersion
{
	return __metadata?.version?.toString()
}

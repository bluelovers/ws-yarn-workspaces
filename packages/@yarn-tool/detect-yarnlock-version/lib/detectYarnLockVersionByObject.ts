import { EnumDetectYarnLock } from './types';

export function detectYarnLockVersionByObject(yarnLockObject: Record<string, any>)
{
	if (yarnLockObject.__metadata?.version?.toString() === '4' && checkV2(yarnLockObject))
	{
		return EnumDetectYarnLock.berry
	}
	else if (typeof yarnLockObject.type === 'string' && yarnLockObject.object && checkV1(yarnLockObject.object))
	{
		return EnumDetectYarnLock.v1
	}
	else if (!('type' in yarnLockObject) && !('object' in yarnLockObject) && checkV1(yarnLockObject))
	{
		return EnumDetectYarnLock.v1
	}

	return EnumDetectYarnLock.unknown
}

export function checkV2(obj)
{
	let ks = Object.keys(obj)
		.slice(2)
		.filter(k => k !== '__metadata')
	;

	let k = ks[0];

	if (ks.length && obj[k].version && obj[k].resolution && obj[k].linkType)
	{
		return EnumDetectYarnLock.berry
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

export default detectYarnLockVersionByObject

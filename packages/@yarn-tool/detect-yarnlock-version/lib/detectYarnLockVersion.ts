import { detectYarnLockVersionByObject } from './detectYarnLockVersionByObject';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { parseYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw';

export function _detectYarnLockVersionSimple(buf: Buffer | string)
{
	const head = buf.slice(0, 160).toString().trim();

	if (head.includes('# yarn lockfile v1'))
	{
		return EnumDetectYarnLock.v1
	}
	else if (/^__metadata:\s*version: (4|5)(?:\r|\n)/m.test(head))
	{
		return EnumDetectYarnLock.v2
	}
	else if (/^__metadata:\s*version: (\d)(?:\r|\n)/m.test(head))
	{
		return EnumDetectYarnLock.v3
	}

	return EnumDetectYarnLock.unknown
}

export function detectYarnLockVersion(buf: Buffer | string)
{
	return _detectYarnLockVersionSimple(buf) || _tryParse(buf) || EnumDetectYarnLock.unknown
}

/**
 * only check v2 and v3
 */
export function _tryParse(buf: Buffer | string)
{
	try
	{
		const yarnLockObject = parseYarnLockRawV2(buf.toString());
		return _tryParseObject(yarnLockObject)
	}
	catch (e)
	{

	}
}

export function _tryParseObject(yarnLockObject: Record<string, any>)
{
	const result = detectYarnLockVersionByObject(yarnLockObject);

	return (result === EnumDetectYarnLock.v2 || result === EnumDetectYarnLock.v3) ? result : void 0
}

export default detectYarnLockVersion;

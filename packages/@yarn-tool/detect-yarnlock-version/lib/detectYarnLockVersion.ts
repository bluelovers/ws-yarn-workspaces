import { detectYarnLockVersionByObject } from './detectYarnLockVersionByObject';
import { EnumDetectYarnLock, EnumDetectYarnLockInputType } from '@yarn-tool/yarnlock-types';
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

export function _detectYarnLockVersionCore<T extends Buffer | string>(input: T)
{
	let verType: EnumDetectYarnLock = _detectYarnLockVersionSimple(input);

	if (verType)
	{
		return {
			verType,
			detectType: EnumDetectYarnLockInputType.simple as const,
			input,
		}
	}

	if (verType = _tryParse(input))
	{
		return {
			verType,
			detectType: EnumDetectYarnLockInputType.parse_raw as const,
			input,
		}
	}

	return {
		verType: EnumDetectYarnLock.unknown as const,
		detectType: EnumDetectYarnLockInputType.unknown as const,
		input,
	}
}

export function detectYarnLockVersion(buf: Buffer | string)
{
	return _detectYarnLockVersionCore(buf).verType
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

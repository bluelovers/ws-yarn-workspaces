import { EnumDetectYarnLock } from './types';

export function detectYarnLockVersion(buf: Buffer | string)
{
	let head = buf.slice(0, 160).toString().trim();

	if (head.includes('# yarn lockfile v1'))
	{
		return EnumDetectYarnLock.v1
	}
	else if (/^__metadata:\s*version: 4(?:\r|\n)/m.test(head))
	{
		return EnumDetectYarnLock.berry
	}

	return EnumDetectYarnLock.unknown
}

export default detectYarnLockVersion;

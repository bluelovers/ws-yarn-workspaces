import { EnumDetectYarnLock } from './types';
import { parseSyml } from '@yarnpkg/parsers';
import detectYarnLockVersionByObject from './detectYarnLockVersionByObject';

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
	else if (tryParse(buf))
	{
		return EnumDetectYarnLock.berry
	}

	return EnumDetectYarnLock.unknown
}

function tryParse(buf: Buffer | string)
{
	try
	{
		let json = parseSyml(buf.toString())

		return detectYarnLockVersionByObject(json) === EnumDetectYarnLock.berry
	}
	catch (e)
	{

	}
}

export default detectYarnLockVersion;

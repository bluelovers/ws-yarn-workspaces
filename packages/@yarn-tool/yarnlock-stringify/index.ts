import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { yarnLockParsedToRawJSON } from '@yarn-tool/yarnlock-parsed-to-json';
import { EnumDetectYarnLock, IYarnLockParsed, IYarnLockSource } from '@yarn-tool/yarnlock-types';
import { detectYarnLockVersionByParsed } from '@yarn-tool/detect-yarnlock-version';
import { stringifyYarnLockRawV1 } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { stringifyYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw/lib/v2';

export function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string | IYarnLockSource | IYarnLockParsed): string
{
	let verType = detectYarnLockVersionByParsed(yarnlock_old as IYarnLockParsed);

	if (verType)
	{
		yarnlock_old = yarnLockParsedToRawJSON(yarnlock_old as IYarnLockParsed)
	}
	else
	{
		verType = detectYarnLockVersionByObject(yarnlock_old as any);
	}

	if (verType)
	{
		switch (verType)
		{
			case EnumDetectYarnLock.v3:
			case EnumDetectYarnLock.v2:
				return stringifyYarnLockRawV2(yarnlock_old)
			case EnumDetectYarnLock.v1:
				// @ts-ignore
				return stringifyYarnLockRawV1(yarnlock_old.object ?? yarnlock_old)
		}
	}
	else
	{
		verType = detectYarnLockVersion(yarnlock_old as string);

		if (verType)
		{
			return yarnlock_old.toString()
		}
	}

	throw newYarnLockParsedVersionError()
}

export default yarnLockStringify

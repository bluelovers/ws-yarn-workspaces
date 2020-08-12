import detectYarnLockVersionByObject from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { stringify as _stringify } from '@yarnpkg/lockfile';
import detectYarnLockVersion from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { stringifySyml } from '@yarnpkg/parsers';

export function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string): string
{
	let verType = detectYarnLockVersionByObject(yarnlock_old as any);

	if (verType)
	{
		switch (verType)
		{
			case EnumDetectYarnLock.berry:
				return stringifySyml(yarnlock_old)
			case EnumDetectYarnLock.v1:
				// @ts-ignore
				return _stringify(yarnlock_old.object ?? yarnlock_old)
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

	throw new TypeError(`can't detect yarn.lock`)
}

export default yarnLockStringify

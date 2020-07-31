import { IOptionsDedupe } from './lib/types';
import detectYarnLockVersion from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import v2 from './lib/v2';
import v1 from './lib/v1';

export function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[]
{
	yarnlock_old = yarnlock_old.toString();
	let verType = detectYarnLockVersion(yarnlock_old)

	switch (verType)
	{
		case EnumDetectYarnLock.berry:
			return v2.listDuplicates(yarnlock_old, options)
		case EnumDetectYarnLock.v1:
			return v1.listDuplicates(yarnlock_old, options)
	}

	throw new TypeError(`can't detect yarn.lock version`)
}

export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();
	let verType = detectYarnLockVersion(yarnlock_old)

	switch (verType)
	{
		case EnumDetectYarnLock.berry:
			return v2.fixDuplicates(yarnlock_old, options)
		case EnumDetectYarnLock.v1:
			return v1.fixDuplicates(yarnlock_old, options)
	}

	throw new TypeError(`can't detect yarn.lock version`)
}

const auto = {
	listDuplicates,
	fixDuplicates,
}

export default auto

import { IOptionsDedupe } from './lib/types';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import v2 from './lib/v2';
import v1 from './lib/v1';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

export function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[]
{
	yarnlock_old = yarnlock_old.toString();
	let verType = detectYarnLockVersion(yarnlock_old)

	switch (verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
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
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			return v2.fixDuplicates(yarnlock_old, options)
		case EnumDetectYarnLock.v1:
			return v1.fixDuplicates(yarnlock_old, options)
	}

	throw new TypeError(`can't detect yarn.lock version`)
}

export function yarnDedupeFile(yarnlock_old_file: string, options?: IOptionsDedupe)
{
	return yarnDedupe(readFileSync(yarnlock_old_file) as any, options)
}

export function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe)
{
	yarnlock_old = yarnlock_old.toString();
	const yarnlock_new = fixDuplicates(yarnlock_old, options);

	return {
		/**
		 * 執行前的 yarn.lock
		 */
		yarnlock_old,
		/**
		 * 執行後的 yarn.lock
		 */
		yarnlock_new,
		/**
		 * yarn.lock 是否有變動
		 */
		yarnlock_changed: yarnlock_old !== yarnlock_new,
	}
}

const auto = {
	listDuplicates,
	fixDuplicates,
	yarnDedupe,
}

export default auto

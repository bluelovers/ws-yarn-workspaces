import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-deduplicate';
import { IYarnLockfileParseObject } from './types';
import { stringify } from './parse';

export interface IOptionsDedupe
{
	includePackages?: string[],
	excludePackages?: string[],
	useMostCommon?: boolean,
}

export function listDuplicates(yarnlock_old: IYarnLockfileParseObject | string, options?: IOptionsDedupe): string[]
{
	if (typeof yarnlock_old !== 'string')
	{
		yarnlock_old = stringify(yarnlock_old)
	}

	return _listDuplicates(yarnlock_old)
}

export function fixDuplicates(yarnlock_old: IYarnLockfileParseObject | string, options?: IOptionsDedupe): string
{
	if (typeof yarnlock_old !== 'string')
	{
		yarnlock_old = stringify(yarnlock_old)
	}

	return _fixDuplicates(yarnlock_old)
}

export function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe)
{
	let yarnlock_new: string = fixDuplicates(yarnlock_old, options);

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

export default yarnDedupe

import { IOptionsDedupe } from './lib/types';
import { listDuplicates as _listDuplicates, fixDuplicates as _fixDuplicates, yarnDedupe as _yarnDedupe } from './index';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';

/**
 * @deprecated
 */
export function listDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string[]
{
	return _listDuplicates(yarnLockStringify(yarnlock_old), options)
}

/**
 * @deprecated
 */
export function fixDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string
{
	return _fixDuplicates(yarnLockStringify(yarnlock_old), options)
}

/**
 * @deprecated
 */
export function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe)
{
	return _yarnDedupe(yarnLockStringify(yarnlock_old), options)
}

/**
 * @deprecated
 */
const auto = {
	listDuplicates,
	fixDuplicates,
	yarnDedupe,
} as const

/**
 * @deprecated
 */
export default auto

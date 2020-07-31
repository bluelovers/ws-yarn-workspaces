import { fixDuplicates } from './fixDuplicates';
import { listDuplicates } from './listDuplicates';
import { IOptionsDedupe } from '../types';

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

export {
	fixDuplicates,
	listDuplicates,
}

const v2 = {
	fixDuplicates,
	listDuplicates,
	yarnDedupe,
}

export default v2

import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-berry-deduplicate';
import { IOptionsDedupe } from '../types';

export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	return _fixDuplicates(yarnlock_old.toString(), options)
}

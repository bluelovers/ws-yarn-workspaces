import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-berry-deduplicate';
import { IOptionsDedupe } from '../types';

export function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[]
{
	return _listDuplicates(yarnlock_old.toString(), options)
}

import { IListableRow } from './types';
import micromatch, { Options, isMatch } from 'micromatch';

export function globFilterListable<T extends IListableRow>(list: T[], globPattern: string | string[], globOptions?: Options): T[]
{
	return list.filter(row => {
		return isMatch(row.name, globPattern, globOptions)
	})
}

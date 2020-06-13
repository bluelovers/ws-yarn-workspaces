import { IListableRow } from './types';
import { Options } from 'micromatch';
export declare function globFilterListable<T extends IListableRow>(list: T[], globPattern: string | string[], globOptions?: Options): T[];

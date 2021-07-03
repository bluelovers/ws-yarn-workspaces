import { Comparator } from 'semver';
import { IOptions } from '../types';
export declare function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>;

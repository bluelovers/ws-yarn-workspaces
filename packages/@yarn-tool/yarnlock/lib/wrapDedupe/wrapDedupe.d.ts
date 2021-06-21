import { Arguments, Argv } from 'yargs';
import { IWrapDedupeCache, IWrapDedupeReturnType } from '../types';
import { IWrapDedupeOptions } from './types';
/**
 * @deprecated
 */
export declare function wrapDedupe<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): IWrapDedupeReturnType<T, U, C>;

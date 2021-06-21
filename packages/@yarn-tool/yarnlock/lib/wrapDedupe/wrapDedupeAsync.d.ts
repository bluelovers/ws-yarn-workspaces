import { IWrapDedupeCache, IWrapDedupeReturnType } from '../types';
import { Arguments, Argv } from 'yargs';
import { IWrapDedupeOptions } from './types';
export declare function wrapDedupeAsync<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): Promise<IWrapDedupeReturnType<T, U, C>>;

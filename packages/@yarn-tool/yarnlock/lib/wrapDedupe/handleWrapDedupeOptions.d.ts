import { IWrapDedupeCache } from '../types';
import { Arguments, Argv } from 'yargs';
import { IWrapDedupeCacheRuntime, IWrapDedupeOptions } from './types';
export declare function handleWrapDedupeOptions<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): {
    options: IWrapDedupeOptions<T, U, C>;
    cache: IWrapDedupeCacheRuntime;
};

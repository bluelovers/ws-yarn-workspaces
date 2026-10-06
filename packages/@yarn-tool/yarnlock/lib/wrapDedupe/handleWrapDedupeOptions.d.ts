import { IWrapDedupeCache } from '../types';
import { Arguments, Argv } from 'yargs';
import { IWrapDedupeCacheRuntime, IWrapDedupeOptions } from './types';
/**
 * 初始化 `wrapDedupe` 的選項與快取：補上 cwd 預設值、重置步驟狀態、
 * 解析專案根目錄與 yarn.lock 快取，讓每個步驟拿到一致的起始狀態。
 *
 * Initialises wrapDedupe options and cache: fills the cwd default, resets step status,
 * resolves the project root and yarn.lock cache so every step starts from the same state.
 *
 * @throws TypeError 未能取得 cwd / when cwd cannot be resolved
 */
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
